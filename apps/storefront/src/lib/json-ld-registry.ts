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
  productJsonLd,
  productResearchArticleJsonLd,
  stripBrandTitleSuffix,
  videoObjectJsonLd,
  webPageJsonLd,
  type JsonLdGraph,
  type ProductReviewSchemaInput
} from "@/lib/seo"
import { getProductResearchDetail } from "@/lib/product-research-detail"
import { authorBioText, getAuthor } from "@/lib/authors"
import { buildProductSeoDescription, buildProductSeoTitle } from "@/lib/product-seo"
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
    const pageAuthor = {
      name: researchAuthor.name,
      jobTitle: researchAuthor.title,
      description: authorBioText(researchAuthor),
      image: researchAuthor.image,
      credentials: researchAuthor.credentials
    }

    return [
      productJsonLd(productLike, view.parentHandle, image, reviewData),
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

  return [
    productJsonLd(product, catalogHandle, image, reviewData),
    webPageJsonLd({
      title: stripBrandTitleSuffix(
        buildProductSeoTitle({ displayName: displayTitle, strengthLabels: [] })
      ),
      description: buildProductSeoDescription({
        displayName: displayTitle,
        strengthLabels: []
      }),
      path
    })
  ]
})

registerDynamicJsonLd(/^\/blog\/([^/]+)$/, async (match) => {
  const slug = match[1]
  const post = await getBlogPostBySlug(slug)
  if (!post) return []

  const editorialAuthor = getAuthor("editorial-team")
  const pageAuthor = {
    name: editorialAuthor.name,
    jobTitle: editorialAuthor.title,
    description: authorBioText(editorialAuthor),
    image: editorialAuthor.image
  }
  const path = `/blog/${slug}`
  const description =
    post.seoDescription || post.excerpt || "Research article from Tetrava Labs."
  const image = post.video?.youtubeId
    ? post.video.thumbnail || `https://i.ytimg.com/vi/${post.video.youtubeId}/maxresdefault.jpg`
    : post.image

  const graphs: JsonLdGraph[] = [
    articleJsonLd({ ...post, image, author: pageAuthor }),
    webPageJsonLd({
      title: post.seoTitle || post.title,
      description,
      path,
      author: pageAuthor
    })
  ]

  if (post.video?.youtubeId) {
    graphs.push(
      videoObjectJsonLd({
        name: post.video.title || post.title,
        description: post.video.description || description,
        youtubeId: post.video.youtubeId,
        path,
        uploadDate:
          post.video.uploadDate || post.publishedAt || post.updatedAt || undefined,
        thumbnail: post.video.thumbnail
      })
    )
  }

  return graphs
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
