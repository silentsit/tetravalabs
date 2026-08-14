/**
 * Live Research Hub slugs. Unknown `/blog/[slug]` URLs 404
 * (`dynamicParams = false` + `notFound()`). Do not 308 retired posts to `/blog`:
 * that is a non-equivalent redirect Google treats as "Page with redirect".
 */
export const KEPT_BLOG_SLUGS = [
  "retatrutide-benefits-beyond-weight-loss",
  "bpc-157-vs-tb-500"
] as const
