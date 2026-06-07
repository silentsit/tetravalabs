# Sanity Content Plan

Sanity is deferred until core commerce flow is live. When added, create:

## Schemas

- `researchArticle`
  - `title`, `slug`, `excerpt`, `body`, `faq`, `relatedProducts`, `seo`
- `categorySeoBlock`
  - `category`, `introCopy`, `supportingCopy`, `faq`, `seo`
- `legalPage`
  - `type` (terms/privacy/refund/ruo), `content`, `version`, `publishedAt`

## Publishing Flow

1. Editors publish in Sanity.
2. Sanity webhook calls storefront `/api/revalidate`.
3. Storefront invalidates product/category/blog pages by path/tag.

## SEO Requirements

- Metadata from Sanity should populate title/description/open graph.
- Blog pages should output `Article` JSON-LD.
- Category pages should maintain crawlable intro and lower supporting copy blocks.
