import { categoryLabelFromSlug, isStorefrontCategorySlug, normalizeCategorySlug } from "@/lib/categories"
import {
  compoundSeoProductName,
  getCompoundProductView,
  productPath,
  resolveCatalogHandle
} from "@/lib/compound-product"
import { getBlogPostBySlug } from "@/lib/sanity"
import { getProductByHandle, listProducts, type StoreProduct } from "@/lib/medusa"
import { registerDynamicJsonLd } from "@/lib/json-ld-store"
import { blogImageForPost } from "@/lib/blog-utils"
import {
  articleJsonLd,
  productJsonLd,
  productResearchArticleJsonLd,
  stripBrandTitleSuffix,
  webPageJsonLd,
  type JsonLdGraph,
  type ProductOfferVariantInput,
  type ProductReviewSchemaInput
} from "@/lib/seo"
import { packTiersFromVariants } from "@/lib/pack-pricing"
import { variantSizeLabel } from "@/lib/merchant-listing-schema"
import { getVariantPriceCents, type StoreVariant } from "@/lib/product-price"
import { resolveProductSku, resolveStrengthPackSku, packQtyFromVariantTitle } from "@/lib/product-sku"
import { getProductImage, getProductFullName, normalizeTb500DisplayText } from "@/lib/revamp/product-visual"
import { getProductResearchDetail } from "@/lib/product-research-detail"
import { authorPersonFields, getAuthor } from "@/lib/authors"
import { buildProductSeoDescription, buildProductSeoTitle } from "@/lib/product-seo"
import { getProductSeoOverride } from "@/lib/product-seo-overrides"
import { getProductImage as getMappedHandleImage } from "@/lib/product-image-map"
import { listProductReviews, type ProductReview } from "@/lib/reviews"

async function reviewsForProductSchema(input: {
  productHandle: string
  productId?: string
  extraHandles?: Array<{ productHandle: string; productId?: string }>
}): Promise<ProductReviewSchemaInput | null> {
  const sources = [
    { productHandle: input.productHandle, productId: input.productId },
    ...(input.extraHandles || [])
  ]
  const seen = new Set<string>()
  const uniqueSources = sources.filter((source) => {
    const key = `${source.productHandle}:${source.productId || ""}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const responses = (
    await Promise.all(
      uniqueSources.map((source) =>
        listProductReviews({
          productHandle: source.productHandle,
          productId: source.productId,
          limit: 6
        })
      )
    )
  ).filter((response): response is NonNullable<typeof response> => Boolean(response))

  const aggregate = responses
    .map((response) => response.aggregate)
    .filter((entry) => entry.reviewCount > 0 && entry.ratingValue > 0)
    .sort((a, b) => b.reviewCount - a.reviewCount)[0]
  if (!aggregate) return null

  const byId = new Map<string, ProductReview>()
  for (const response of responses) {
    for (const item of response.items) {
      byId.set(item.id, item)
    }
  }

  return {
    ratingValue: aggregate.ratingValue,
    reviewCount: aggregate.reviewCount,
    reviews: [...byId.values()].map((item) => ({
      authorName: item.author_name,
      rating: item.rating,
      body: item.body,
      datePublished: item.created_at
    }))
  }
}

function variantInStock(variant?: StoreVariant): boolean {
  if (!variant) return true
  if (variant.manage_inventory === false) return true
  if (variant.allow_backorder) return true
  if (variant.inventory_quantity == null) return true
  return variant.inventory_quantity > 0
}

function offerName(displayName: string, strengthLabel: string, packTitle: string) {
  const productName = getProductFullName(
    displayName,
    strengthLabel.toLowerCase() === "standard" ? null : strengthLabel
  )
  return `${productName} · ${packTitle}`
}

function offersFromCompoundView(
  view: NonNullable<Awaited<ReturnType<typeof getCompoundProductView>>>
): ProductOfferVariantInput[] {
  const rows: ProductOfferVariantInput[] = []
  for (const strength of view.strengths) {
    const tiers = strength.packTiers.length
      ? strength.packTiers
      : packTiersFromVariants(strength.variants)
    if (tiers.length) {
      for (const tier of tiers) {
        if (tier.price <= 0) continue
        const variant = strength.variants.find((item) => item.id === tier.variantId)
        rows.push({
          name: offerName(view.displayName, strength.strengthLabel, tier.tier),
          size: variantSizeLabel(strength.strengthLabel, tier.tier),
          sku: resolveStrengthPackSku({
            handle: strength.imageHandle || strength.handle,
            parentHandle: view.parentHandle,
            strengthKey: strength.strengthKey,
            packQty: tier.qty,
            variantTitle: tier.tier,
            sku: variant?.sku
          }),
          priceUsd: tier.price,
          inStock: variantInStock(variant)
        })
      }
      continue
    }
    for (const variant of strength.variants) {
      const priceUsd = getVariantPriceCents(variant) / 100
      if (priceUsd <= 0) continue
      rows.push({
        name: offerName(view.displayName, strength.strengthLabel, variant.title || "1 vial"),
        size: variantSizeLabel(strength.strengthLabel, variant.title || "1 vial"),
        sku: resolveStrengthPackSku({
          handle: strength.imageHandle || strength.handle,
          parentHandle: view.parentHandle,
          strengthKey: strength.strengthKey,
          packQty: packQtyFromVariantTitle(variant.title),
          variantTitle: variant.title,
          sku: variant.sku
        }),
        priceUsd,
        inStock: variantInStock(variant)
      })
    }
  }
  return rows
}

function offersFromStoreProduct(product: StoreProduct): ProductOfferVariantInput[] {
  const displayName = normalizeTb500DisplayText(product.title)
  const tiers = packTiersFromVariants((product.variants || []) as StoreVariant[])
  if (tiers.length) {
    return tiers
      .filter((tier) => tier.price > 0)
      .map((tier) => {
        const variant = product.variants?.find((item) => item.id === tier.variantId)
        return {
          name: `${displayName} · ${tier.tier}`,
          size: variantSizeLabel("standard", tier.tier),
          sku: resolveProductSku({
            handle: product.handle,
            variantTitle: tier.tier,
            sku: variant?.sku
          }),
          priceUsd: tier.price,
          inStock: variantInStock(variant as StoreVariant | undefined)
        }
      })
  }
  return (product.variants || [])
    .map((variant) => {
      const priceUsd = getVariantPriceCents(variant as StoreVariant) / 100
      return {
        name: `${displayName} · ${variant.title || "1 vial"}`,
        size: variantSizeLabel("standard", variant.title || "1 vial"),
        sku: resolveProductSku({
          handle: product.handle,
          variantTitle: variant.title,
          sku: variant.sku
        }),
        priceUsd,
        inStock: variantInStock(variant as StoreVariant)
      }
    })
    .filter((offer) => offer.priceUsd > 0)
}

const RESERVED_TOP_LEVEL = new Set([
  "about",
  "account",
  "api",
  "blog",
  "cart",
  "categories",
  "category",
  "checkout",
  "coa-library",
  "contact",
  "faq",
  "login",
  "orders",
  "payment",
  "privacy",
  "product",
  "refund",
  "register",
  "reorder",
  "ruo",
  "search",
  "shipping",
  "shipping-restricted",
  "shop",
  "sitemap",
  "terms"
])

registerDynamicJsonLd(/^\/([^/]+)$/, async (match) => {
  const handle = match[1]
  if (RESERVED_TOP_LEVEL.has(handle)) return []

  const catalogHandle = resolveCatalogHandle(handle)
  const view = await getCompoundProductView(catalogHandle)
  if (view) {
    const strength = view.strengths[0]
    const seoOverride = getProductSeoOverride(view.parentHandle)
    const seoName = compoundSeoProductName(view)
    const strengthLabels = view.strengths.map((item) => item.strengthLabel)
    const absoluteTitle =
      seoOverride?.absoluteTitle ||
      buildProductSeoTitle({
        displayName: view.displayName,
        strengthLabels
      })
    const pageTitle = stripBrandTitleSuffix(absoluteTitle)
    const pageDescription =
      seoOverride?.description ||
      buildProductSeoDescription({
        displayName: view.displayName,
        strengthLabels,
        purity: strength?.purity,
        casNumber: view.casNumber
      })
    const imageHandle = strength?.imageHandle || strength?.handle || view.parentHandle
    const allVariants = view.strengths.flatMap(
      (item) => (item.variants || []) as NonNullable<StoreProduct["variants"]>
    )
    const productLike = {
      title: seoName,
      handle: view.parentHandle,
      metadata: { source_category: view.categoryLabel },
      description: pageDescription,
      variants: allVariants
    }
    const image = getMappedHandleImage(imageHandle)
    const path = productPath(view.parentHandle)
    const reviewData = await reviewsForProductSchema({
      productHandle: view.parentHandle,
      productId: strength?.productId,
      extraHandles: view.strengths.map((item) => ({
        productHandle: item.handle,
        productId: item.productId
      }))
    })
    const researchDetail = getProductResearchDetail(view.parentHandle)
    const researchAuthor = getAuthor(researchDetail?.authorId ?? "editorial-team")
    const pageAuthor = authorPersonFields(researchAuthor)

    return [
      productJsonLd(productLike, view.parentHandle, image, reviewData, offersFromCompoundView(view)),
      webPageJsonLd({
        title: pageTitle,
        description: pageDescription,
        path,
        author: pageAuthor
      }),
      productResearchArticleJsonLd({
        headline: pageTitle,
        description: pageDescription,
        path,
        image,
        dateModified: researchDetail?.updatedAt,
        author: pageAuthor
      })
    ]
  }

  const product = await getProductByHandle(catalogHandle)
  if (!product) return []

  const displayTitle = normalizeTb500DisplayText(product.title)
  const image = getProductImage(product)
  const path = productPath(catalogHandle)
  const reviewData = await reviewsForProductSchema({
    productHandle: catalogHandle,
    productId: product.id
  })

  const editorialAuthor = getAuthor("editorial-team")

  return [
    productJsonLd(product, catalogHandle, image, reviewData, offersFromStoreProduct(product)),
    webPageJsonLd({
      title: stripBrandTitleSuffix(
        buildProductSeoTitle({ displayName: displayTitle, strengthLabels: [] })
      ),
      description: buildProductSeoDescription({
        displayName: displayTitle,
        strengthLabels: []
      }),
      path,
      author: authorPersonFields(editorialAuthor)
    })
  ]
})

registerDynamicJsonLd(/^\/blog\/([^/]+)$/, async (match) => {
  const slug = match[1]
  const post = await getBlogPostBySlug(slug)
  if (!post) return []

  const editorialAuthor = getAuthor("editorial-team")
  const pageAuthor = authorPersonFields(editorialAuthor)
  const path = `/blog/${slug}`
  const description =
    post.seoDescription || post.excerpt || "Research article from Tetrava Labs."

  return [
    articleJsonLd({ ...post, image: blogImageForPost(post), author: pageAuthor }),
    webPageJsonLd({
      title: post.seoTitle || post.title,
      description,
      path,
      author: pageAuthor
    })
  ]
})

registerDynamicJsonLd(/^\/category\/([^/]+)$/, async (match) => {
  const slug = match[1]
  const normalized = normalizeCategorySlug(slug)
  if (!isStorefrontCategorySlug(String(normalized))) return []

  const products = await listProducts()
  const label = categoryLabelFromSlug(String(normalized), products)

  return [
    webPageJsonLd({
      title: `${label} | research peptides`,
      description: `Shop ${label} research peptides with verified 99%+ HPLC-MS purity, lot-linked COAs, and cold-chain shipping. Research use only (RUO).`,
      path: `/category/${normalized}`,
      type: "CollectionPage"
    })
  ]
})
