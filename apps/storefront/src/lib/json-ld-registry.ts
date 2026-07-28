import { categoryLabelFromSlug, isStorefrontCategorySlug, normalizeCategorySlug } from "@/lib/categories"
import { getCompoundProductView } from "@/lib/compound-product"
import { getBlogPostBySlug } from "@/lib/sanity"
import { getProductByHandle, listProducts, type StoreProduct } from "@/lib/medusa"
import { registerDynamicJsonLd } from "@/lib/json-ld-store"
import { articleJsonLd, productJsonLd, webPageJsonLd } from "@/lib/seo"
import { getProductImage as getMappedHandleImage } from "@/lib/product-image-map"
import { getProductImage } from "@/lib/revamp/product-visual"

registerDynamicJsonLd(/^\/product\/([^/]+)$/, async (match) => {
  const handle = match[1]
  const view = await getCompoundProductView(handle)
  if (view) {
    const strength = view.strengths[0]
    const imageHandle = strength?.imageHandle || strength?.handle || view.parentHandle
    const productLike = {
      title: view.displayName,
      handle: view.parentHandle,
      metadata: { source_category: view.categoryLabel },
      variants: (strength?.variants || []) as StoreProduct["variants"]
    }
    const image = getMappedHandleImage(imageHandle)

    return [
      productJsonLd(productLike, view.parentHandle, image),
      webPageJsonLd({
        title: `${view.displayName} — ${view.categoryLabel}`,
        description: `${view.displayName} for laboratory research (RUO).`,
        path: `/product/${view.parentHandle}`
      })
    ]
  }

  const product = await getProductByHandle(handle)
  if (!product) return []

  const category = String(product.metadata?.source_category || "Research peptide")
  const image = getProductImage(product)

  return [
    productJsonLd(product, handle, image),
    webPageJsonLd({
      title: `${product.title} — ${category}`,
      description: `${product.title} for laboratory research (RUO).`,
      path: `/product/${handle}`
    })
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
