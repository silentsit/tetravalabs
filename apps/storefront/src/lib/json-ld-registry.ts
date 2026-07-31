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
import { articleJsonLd, faqJsonLd, productJsonLd, webPageJsonLd } from "@/lib/seo"
import { getProductFaqs } from "@/lib/product-faqs"
import { getProductImage as getMappedHandleImage } from "@/lib/product-image-map"
import { getProductImage, normalizeTb500DisplayText } from "@/lib/revamp/product-visual"

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
    const seoName = compoundSeoProductName(view)
    const imageHandle = strength?.imageHandle || strength?.handle || view.parentHandle
    const allVariants = view.strengths.flatMap(
      (item) => (item.variants || []) as NonNullable<StoreProduct["variants"]>
    )
    const productLike = {
      title: seoName,
      handle: view.parentHandle,
      metadata: { source_category: view.categoryLabel },
      variants: allVariants
    }
    const image = getMappedHandleImage(imageHandle)
    const path = productPath(view.parentHandle)
    const faqs = getProductFaqs(view.parentHandle, {
      productName: view.displayName,
      category: view.categoryLabel,
      appearance: view.appearance
    })

    return [
      productJsonLd(productLike, view.parentHandle, image),
      webPageJsonLd({
        title: `${seoName} — ${view.categoryLabel}`,
        description: `${seoName} for laboratory research (RUO).`,
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

  return [
    productJsonLd(product, catalogHandle, image),
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
