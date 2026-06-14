import { categoryLabelFromSlug } from "@/lib/categories"
import { getBlogPostBySlug } from "@/lib/sanity"
import { getProductByHandle, listProducts } from "@/lib/medusa"
import { registerDynamicJsonLd } from "@/lib/json-ld-store"
import { articleJsonLd, productJsonLd, webPageJsonLd } from "@/lib/seo"
import { getProductImage } from "@/lib/revamp/product-visual"

registerDynamicJsonLd(/^\/product\/([^/]+)$/, async (match) => {
  const handle = match[1]
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
  const products = await listProducts()
  const label = categoryLabelFromSlug(slug, products)

  return [
    webPageJsonLd({
      title: `${label} — research peptides`,
      description: `Shop ${label} research compounds with HPLC-MS verification and lot-linked COAs.`,
      path: `/category/${slug}`,
      type: "CollectionPage"
    })
  ]
})
