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
import {
  articleJsonLd,
  faqJsonLd,
  productJsonLd,
  webPageJsonLd,
  type ProductReviewSchemaInput
} from "@/lib/seo"
import { getProductFaqs } from "@/lib/product-faqs"
import { getProductSeoOverride } from "@/lib/product-seo-overrides"
import { getProductImage as getMappedHandleImage } from "@/lib/product-image-map"
import { getProductImage, normalizeTb500DisplayText } from "@/lib/revamp/product-visual"
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

  const responses = await Promise.all(
    uniqueSources.map((source) =>
      listProductReviews({
        productHandle: source.productHandle,
        productId: source.productId,
        limit: 6
      })
    )
  )

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
    const pageTitle =
      seoOverride?.absoluteTitle.replace(/\s*\|\s*Tetrava Labs\s*$/i, "").trim() ||
      `${seoName} — ${view.categoryLabel}`
    const pageDescription =
      seoOverride?.description || `${seoName} for laboratory research (RUO).`
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
    const faqs = getProductFaqs(view.parentHandle, {
      productName: view.displayName,
      category: view.categoryLabel,
      appearance: view.appearance
    })
    const reviewData = await reviewsForProductSchema({
      productHandle: view.parentHandle,
      productId: strength?.productId,
      extraHandles: view.strengths.map((item) => ({
        productHandle: item.handle,
        productId: item.productId
      }))
    })

    return [
      productJsonLd(productLike, view.parentHandle, image, reviewData),
      webPageJsonLd({
        title: pageTitle,
        description: pageDescription,
        path
      }),
      faqJsonLd(faqs, path)
    ]
  }

  const product = await getProductByHandle(catalogHandle)
  if (!product) return []

  const displayTitle = normalizeTb500DisplayText(product.title)
  const category = normalizeTb500DisplayText(
    String(product.metadata?.source_category || "Research peptide")
  )
  const image = getProductImage(product)
  const path = productPath(catalogHandle)
  const faqs = getProductFaqs(catalogHandle, {
    productName: displayTitle,
    category,
    appearance: String(product.metadata?.appearance || "")
  })
  const reviewData = await reviewsForProductSchema({
    productHandle: catalogHandle,
    productId: product.id
  })

  return [
    productJsonLd(product, catalogHandle, image, reviewData),
    webPageJsonLd({
      title: `${displayTitle} — ${category}`,
      description: `${displayTitle} for laboratory research (RUO).`,
      path
    }),
    faqJsonLd(faqs, path)
  ]
})

registerDynamicJsonLd(/^\/blog\/([^/]+)$/, async (match) => {
  const slug = match[1]
  const post = await getBlogPostBySlug(slug)
  if (!post) return []

  return [
    articleJsonLd(post),
    webPageJsonLd({
      title: post.title,
      description: post.excerpt || "Research article from Tetrava Labs.",
      path: `/blog/${slug}`
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
      title: `${label} — research peptides`,
      description: `Shop ${label} research compounds with HPLC-MS verification and lot-linked COAs.`,
      path: `/category/${normalized}`,
      type: "CollectionPage"
    })
  ]
})
