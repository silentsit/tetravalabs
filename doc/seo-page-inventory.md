# SEO page inventory — title, description, schema

Source: `apps/storefront` metadata + JSON-LD registry (Jul 2026).

**Global on every HTML response**
- Title template: `%s | Tetrava Labs`
- Default title: `Tetrava Labs — Verified. Documented. Delivered.`
- Default description: Research-use peptides with HPLC-MS verification, lot-linked COAs, and cold-chain shipping for qualified laboratories.
- Always inject: `Organization` (incl. `PostalAddress` array: primary 580 California Street, San Francisco, CA 94104, US; plus London GB, Singapore SG, Bangkok TH regional offices; `hasMerchantReturnPolicy` → `/refund`), `WebSite` (SearchAction → `/search?q=…`)
- Social cards: 1200×630 PNG via `/og` (not the brand icon). Per-page title, eyebrow, and optional catalog photo.

## Indexable pages

| Path | Title tag | Meta description | Schema markup | Notes |
|---|---|---|---|---|
| `/` | Buy Peptides Online \| Peptides for Sale \| Tetrava Labs | Buy peptides online from Tetrava Labs. Research peptides for sale with verified purity and third-party lab testing. | Organization, WebSite, WebPage | absoluteTitle; visible FAQ accordion, no FAQPage schema |
| `/shop` | Research Peptides for Sale \| Tetrava Labs | Browse the full Tetrava Labs catalog — GLP-1 peptides, tissue repair compounds, growth secretagogues, and lab supplies with batch COAs. | Organization, WebSite, CollectionPage, BreadcrumbList | noIndex when search/price filters present |
| `/{handle}` | Buy {Name} Online ({strengths}) \| 99%+ Purity COA \| Tetrava Labs | Buy research-grade {Name} online in {strengths}. Verified {purity} HPLC-MS purity with lot-linked COAs. Cold-chain shipping. Research use only (RUO). [CAS …]. | Organization (+ MerchantReturnPolicy), WebSite, Product/ProductGroup (size + description on each variant; Offer per strength × pack with shippingDetails + hasMerchantReturnPolicy), WebPage, BreadcrumbList | One URL per compound. Strengths in title/meta. Progressive title fallbacks under 70 chars. ASCII separators only (`\|` / `-`). H1 may show selected strength for UX. Merchant listings: `size` is the strength × pack label; shipping schema lists $0.00 (free on all orders); returns are `MerchantReturnNotPermitted` per `/refund`. |
| `/buy-bpc-157-online` | BPC-157 Peptide for Sale \| Buy BPC-157 (5mg/10mg) \| Tetrava Labs | BPC-157 peptide for sale at Tetrava Labs — third-party verified 99%+ purity with lot-linked COA. Buy BPC-157 online with us today. | Organization, WebSite, Product (Offer per strength × pack), WebPage, BreadcrumbList | Curated override in `product-seo-overrides.ts`; image alt: BPC-157 peptide for sale in vial |
| `/buy-retatrutide-online` | Buy Retatrutide Peptide Online \| Retatrutide for Sale \| Tetrava | Wondering where to buy retatrutide? Find 99%+ pure retatrutide for sale with lot-linked COA, competitive pricing, and cold-chain dispatch. RUO. | Organization, WebSite, Product (Offer per strength × pack), WebPage, BreadcrumbList | Curated override in `product-seo-overrides.ts` |
| `/buy-semaglutide-online` | Buy Semaglutide Online (5mg, 10mg) \| 99% Purity \| Tetrava | Buy research-grade Semaglutide online in 5mg and 10mg. Verified 99%+ HPLC-MS purity with lot-linked COAs. Cold-chain shipping. RUO. CAS 910463-68-2. | Organization, WebSite, Product (Offer per strength × pack), WebPage, BreadcrumbList | Curated override in `product-seo-overrides.ts` |
| `/buy-mots-c-online` | Buy MOTS-c Peptide Online \| MOTS-c for Sale \| Tetrava | Buy MOTS-c peptide online for qualified labs. Get 99%+ HPLC-MS purity, lot-linked COA documentation, competitive pricing, and cold-chain dispatch. RUO only. | Organization, WebSite, Product (Offer per strength × pack), WebPage, BreadcrumbList | Curated override in `product-seo-overrides.ts` |
| `/buy-aod-9604-online` | Buy AOD-9604 Peptide Online (5mg / 10mg) \| 99%+ COA \| Tetrava | Buy AOD-9604 peptide online in 5mg and 10mg vials. 99%+ HPLC-MS lab-tested purity, lot-linked COA. Research-grade hGH fragment 176-191. RUO. | Organization, WebSite, Product (Offer per strength × pack), WebPage, BreadcrumbList | Curated override in `product-seo-overrides.ts`; image alt: Buy AOD-9604 peptide for sale in research vial |
| `/buy-nad-online` | Buy NAD+ Peptide Online (100mg/500mg/1000mg) \| 99%+ Purity \| Tetrava | Buy research-grade NAD+ online in 100mg, 500mg, and 1000mg. Verified 99%+ HPLC-MS purity with lot-linked COAs. Cold-chain shipping. Research use only (RUO). | Organization, WebSite, Product (Offer per strength × pack), WebPage, BreadcrumbList | Curated override in `product-seo-overrides.ts`; image alt: Buy NAD+ peptide for sale in research vial |
| `/buy-dsip-online` | Buy DSIP Peptide Online (5mg / 10mg / 15mg) \| 99%+ COA \| Tetrava | Buy DSIP peptide online in 5mg, 10mg, and 15mg vials. 99%+ HPLC-MS lab-tested purity, lot-linked COA. Delta Sleep-Inducing Peptide for research. RUO. | Organization, WebSite, Product (Offer per strength × pack), WebPage, BreadcrumbList | Curated override in `product-seo-overrides.ts`; image alt: Buy DSIP peptide for sale in research vial |
| `/category/{slug}` | {seoTitle or "{label} \| research peptides"} \| Tetrava Labs | Sanity seoDescription → art description (~120–155 chars) → Shop {label}… fallback | Organization, WebSite, CollectionPage, BreadcrumbList | |
| `/categories` | Product categories \| Tetrava Labs | Browse research peptides by category — GLP-1, tissue repair, growth hormone axis, longevity, metabolic, blends, and lab supplies. | Organization, WebSite, CollectionPage, BreadcrumbList | |
| `/blog` | Research Hub — articles & protocols \| Tetrava Labs | Protocol notes, peptide handling guidance, and analytical documentation for qualified research buyers. | Organization, WebSite, CollectionPage, BreadcrumbList | |
| `/blog/{slug}` | {post.title} \| Tetrava Labs | {post.excerpt \|\| "Research article from Tetrava Labs."} | Organization, WebSite, Article, WebPage, BreadcrumbList | Visible editorial byline (Tetrava Labs Editorial Team) |
| `/coa-library` | COA library — batch certificates \| Tetrava Labs | Search lot-linked Certificates of Analysis (COA) and HPLC documents for Tetrava Labs research peptides. | Organization, WebSite, CollectionPage, BreadcrumbList | |
| `/about` | About Tetrava Labs \| Verified Research-Use-Only Peptides | Tetrava Labs supplies HPLC-MS verified, COA-documented research peptides with cold-chain shipping to qualified labs. Verified. Documented. Delivered. RUO. | Organization, WebSite, AboutPage, BreadcrumbList | Uses absoluteTitle |
| `/faq` | FAQ — ordering, shipping & COAs \| Tetrava Labs | Answers about research-use peptides, HPLC verification, certificates of analysis, shipping, and payment. | Organization, WebSite, WebPage, BreadcrumbList | Visible FAQ accordion, no FAQPage schema |
| `/contact` | Contact Tetrava Labs \| Customer & Technical Support | Contact Tetrava Labs for research support, order questions, COA documents, and compliance inquiries. | Organization, WebSite, ContactPage, BreadcrumbList | Curated absoluteTitle |
| `/payment` | How to pay — card & crypto checkout \| Tetrava Labs | Step-by-step payment guide for Tetrava Labs orders using credit card, Apple Pay, BTC, USDT, ETH, and other supported assets. | Organization, WebSite, WebPage, BreadcrumbList | FAQ UI without FAQPage schema |
| `/shipping` | Shipping Information \| Tetrava Labs | Tetrava Labs international delivery times, fulfillment, cold-chain packaging, tracking guidance, and customs information for research peptide orders. | Organization, WebSite, WebPage, BreadcrumbList | |
| `/privacy` | Privacy Policy \| Tetrava Labs | How Tetrava Labs collects, uses, stores, and protects personal information for research-use customers on tetravalabs.com. | Organization, WebSite, WebPage, BreadcrumbList | |
| `/terms` | Terms of Service \| Tetrava Labs | Terms governing Tetrava Labs website use and research-compound purchases, including RUO requirements, orders, shipping, quality, and liability. | Organization, WebSite, WebPage, BreadcrumbList | |
| `/refund` | Refund & Delivery Policy \| Tetrava Labs | Tetrava Labs delivery guarantee, reshipment policy, customs exceptions, and refund conditions for research peptides. | Organization, WebSite, WebPage, BreadcrumbList | |
| `/ruo` | Research Use Only Policy \| Tetrava Labs | Tetrava Labs Research Use Only (RUO) policy — compounds are for qualified laboratory research, not human consumption. | Organization, WebSite, WebPage, BreadcrumbList | |
| `/sitemap` | Sitemap \| Tetrava Labs | HTML sitemap of Tetrava Labs: research peptide product pages, categories, Research Hub articles, and policy pages. XML index at /sitemap_index.xml. | Organization, WebSite, WebPage, BreadcrumbList | Human-readable HTML sitemap; XML remains `/sitemap_index.xml` |
| `/coa-library/{handle}` | {displayName} — COA documents \| Tetrava Labs | Lot-linked Certificates of Analysis for {displayName}. {N} research document(s) available. | Organization, WebSite, WebPage, BreadcrumbList | In XML page sitemap + HTML sitemap |
| `/reorder/{token}` | Reorder \| Tetrava | Reload a previous Tetrava Labs research order from your secure email link. | Organization, WebSite | noIndex; robots.txt Disallow: /reorder |
| `(not-found)` | Page not found \| Tetrava | The page you requested does not exist on tetravalabs.com. Browse the research peptide catalog or return home. | Organization, WebSite | noindex, follow |

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
| `/account/indexing` | Indexing \| Tetrava Labs | Submit Tetrava Labs sitemap URLs to search engines via IndexNow. | Organization, WebSite | noIndex; store admins only |
| `/account/forgot-password` | Forgot Password \| Tetrava Labs | Request a secure password reset link for your Tetrava Labs account. | Organization, WebSite | |
| `/account/reset-password` | Reset Password \| Tetrava Labs | Set a new password for your Tetrava Labs account. | Organization, WebSite | |
| `/account/oauth/{provider}/callback` | Account \| Tetrava Labs (inherited) | (inherited from account layout) | Organization, WebSite | No page-level metadata |
| `/login` | (root default) | (root default) | Organization, WebSite | Redirect → /account |
| `/register` | (root default) | (root default) | Organization, WebSite | Redirect → /account |

## Priority gaps

Closed Aug 2026: `/reorder/{token}` noIndex + title; `not-found` metadata; CollectionPage/WebPage JSON-LD on shop, legal, FAQ, COA, about, categories, sitemap; `/categories` and `/coa-library/{handle}` added to XML sitemap.

Implementation: `apps/storefront` `buildPageMetadata`, `json-ld-store.ts`, `json-ld-registry.ts`, `<PageJsonLd>`, root `layout.tsx`.
