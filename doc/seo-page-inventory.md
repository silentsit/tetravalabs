# SEO page inventory — title, description, schema

Source: `apps/storefront` metadata + JSON-LD registry (Jul 2026).

**Global on every HTML response**
- Title template: `%s | Tetrava Labs`
- Default title: `Tetrava Labs — Verified. Documented. Delivered.`
- Default description: Research-use peptides with HPLC-MS verification, lot-linked COAs, and cold-chain shipping for qualified laboratories.
- Always inject: `Organization` (incl. `PostalAddress`: 455 Gateway Drive, Pacifica, CA 94044, US), `WebSite` (SearchAction → `/search?q=…`)

## Indexable pages

| Path | Title tag | Meta description | Schema markup | Notes |
|---|---|---|---|---|
| `/` | Buy Peptides Online \| Peptides for Sale \| Tetrava Labs | Buy peptides online from Tetrava Labs. Research-grade peptides with verified purity and third-party lab testing. | Organization, WebSite, WebPage, FAQPage | absoluteTitle; FAQPage = first 4 FAQs |
| `/shop` | Research Peptides for Sale \| Tetrava Labs | Browse the full Tetrava Labs catalog — GLP-1 peptides, tissue repair compounds, growth secretagogues, and lab supplies with batch COAs. | Organization, WebSite, CollectionPage, BreadcrumbList | noIndex when search/price filters present |
| `/{handle}` | {productName} — {category} \| Tetrava Labs | {productName} for laboratory research (RUO). {purity} purity with lot-linked COA. [CAS …]. | Organization, WebSite, Product, WebPage, BreadcrumbList, FAQPage | Featured handles use curated FAQs; others use generic product FAQs |
| `/category/{slug}` | {seoTitle or "{label} — research peptides"} \| Tetrava Labs | Sanity seoDescription → art description → Shop {label}… fallback | Organization, WebSite, CollectionPage, BreadcrumbList | |
| `/categories` | Product categories \| Tetrava Labs | Browse research peptides by category — GLP-1, tissue repair, growth hormone axis, longevity, metabolic, blends, and lab supplies. | Organization, WebSite, CollectionPage, BreadcrumbList | |
| `/blog` | Research Hub — articles & protocols \| Tetrava Labs | Protocol notes, peptide handling guidance, and analytical documentation for qualified research buyers. | Organization, WebSite, CollectionPage, BreadcrumbList | |
| `/blog/{slug}` | {post.title} \| Tetrava Labs | {post.excerpt \|\| "Research article from Tetrava Labs."} | Organization, WebSite, Article, WebPage, BreadcrumbList | |
| `/coa-library` | COA library — batch certificates \| Tetrava Labs | Search lot-linked Certificates of Analysis (COA) and HPLC documents for Tetrava Labs research peptides. | Organization, WebSite, CollectionPage, BreadcrumbList | |
| `/about` | About Tetrava Labs \| Verified Research-Use-Only Peptides | Tetrava Labs supplies HPLC-MS verified, COA-documented research peptides with cold-chain shipping to qualified labs. Verified. Documented. Delivered. RUO. | Organization, WebSite, AboutPage, BreadcrumbList | Uses absoluteTitle |
| `/faq` | FAQ — ordering, shipping & COAs \| Tetrava Labs | Answers about research-use peptides, HPLC verification, certificates of analysis, shipping, and payment. | Organization, WebSite, WebPage, FAQPage, BreadcrumbList | |
| `/contact` | Contact \| Tetrava Labs | Contact Tetrava Labs for research support, order questions, COA documents, and compliance inquiries. | Organization, WebSite, ContactPage, BreadcrumbList | layout vs page metadata overlap |
| `/payment` | How to pay — card & crypto checkout \| Tetrava Labs | Step-by-step payment guide for Tetrava Labs orders using credit card, Apple Pay, BTC, USDT, ETH, and other supported assets. | Organization, WebSite, WebPage, BreadcrumbList | FAQ UI without FAQPage schema |
| `/shipping` | Shipping Information \| Tetrava Labs | Tetrava Labs international delivery times, fulfillment, cold-chain packaging, tracking guidance, and customs information for research peptide orders. | Organization, WebSite, WebPage, BreadcrumbList | |
| `/privacy` | Privacy Policy \| Tetrava Labs | How Tetrava Labs collects, uses, stores, and protects personal information for research-use customers on tetravalabs.com. | Organization, WebSite, WebPage, BreadcrumbList | |
| `/terms` | Terms of Service \| Tetrava Labs | Terms governing Tetrava Labs website use and research-compound purchases, including RUO requirements, orders, shipping, quality, and liability. | Organization, WebSite, WebPage, BreadcrumbList | |
| `/refund` | Refund & Delivery Policy \| Tetrava Labs | Tetrava Labs delivery guarantee, reshipment policy, customs exceptions, and refund conditions for research peptides. | Organization, WebSite, WebPage, BreadcrumbList | |
| `/ruo` | Research Use Only Policy \| Tetrava Labs | Tetrava Labs Research Use Only (RUO) policy — compounds are for qualified laboratory research, not human consumption. | Organization, WebSite, WebPage, BreadcrumbList | |
| `/reorder/{token}` | Tetrava Labs — Verified. Documented. Delivered. (root default) | (root default) | Organization, WebSite, WebPage (fallback) | **Gap:** no dedicated metadata / noIndex |
| `(not-found)` | (inherits requesting path / root default) | (root default) | Organization, WebSite | **Gap:** no dedicated metadata / noindex |

## noIndex / utility pages

| Path | Title tag | Meta description | Schema markup | Notes |
|---|---|---|---|---|
| `/shipping-restricted` | Shipping Restricted \| Tetrava Labs | Checkout is unavailable for your location due to Tetrava Labs shipping compliance restrictions. | Organization, WebSite, WebPage (fallback) | noIndex; generic WebPage fallback possible |
| `/search` | Search research compounds \| Tetrava Labs | Search the Tetrava Labs catalog by peptide name, CAS number, formula, or sequence. | Organization, WebSite | |
| `/cart` | Cart \| Tetrava Labs | Review your selected research compounds before checkout. | Organization, WebSite | |
| `/orders` | Order history \| Tetrava Labs | View past orders or look up a guest checkout with your email and order number. | Organization, WebSite | |
| `/checkout` | Checkout \| Tetrava Labs | Complete your Tetrava Labs research order. | Organization, WebSite | |
| `/checkout/payment` | Payment \| Tetrava Labs | Complete payment for your Tetrava Labs order. | Organization, WebSite | |
| `/checkout/success` | Order confirmed \| Tetrava Labs | Your Tetrava Labs order confirmation. | Organization, WebSite | layout may say “Payment confirmed” |
| `/account` | Account \| Tetrava Labs | Manage your Tetrava Labs research account. | Organization, WebSite | |
| `/account/details` | Account details \| Tetrava Labs | Edit your Tetrava Labs account profile and password settings. | Organization, WebSite | |
| `/account/addresses` | Addresses \| Tetrava Labs | Manage billing and shipping addresses for your Tetrava Labs account. | Organization, WebSite | |
| `/account/orders` | Orders \| Tetrava Labs | View your Tetrava Labs order history. | Organization, WebSite | |
| `/account/downloads` | Downloads \| Tetrava Labs | Access COA and batch documents for your Tetrava Labs orders. | Organization, WebSite | |
| `/account/restocks` | Peptide Refills \| Tetrava Labs | Manage your Tetrava Labs Peptide Refill schedules. | Organization, WebSite | |
| `/account/forgot-password` | Forgot Password \| Tetrava Labs | Request a secure password reset link for your Tetrava Labs account. | Organization, WebSite | |
| `/account/reset-password` | Reset Password \| Tetrava Labs | Set a new password for your Tetrava Labs account. | Organization, WebSite | |
| `/account/oauth/{provider}/callback` | Account \| Tetrava Labs (inherited) | (inherited from account layout) | Organization, WebSite | No page-level metadata |
| `/login` | (root default) | (root default) | Organization, WebSite | Redirect → /account |
| `/register` | (root default) | (root default) | Organization, WebSite | Redirect → /account |

## Priority gaps

1. **`/payment`** — FAQ accordion without `FAQPage` schema  
3. **`/reorder/{token}`** — inherits root title/description; not marked noIndex  
4. **`not-found`** — no dedicated metadata / noindex  

Implementation: `apps/storefront/src/lib/seo.ts`, `json-ld-store.ts`, `json-ld-registry.ts`, root `layout.tsx`.
