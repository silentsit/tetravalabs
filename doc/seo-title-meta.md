# Title tags & meta descriptions

Rendered titles use the template `%s | Tetrava Labs` unless noted as absolute.

Default (fallback): **Tetrava Labs — Verified. Documented. Delivered.**  
Default description: Research-use peptides with HPLC-MS verification, lot-linked COAs, and cold-chain shipping for qualified laboratories.

## Public pages

| Path | Title tag | Meta description |
|---|---|---|
| `/` | Buy Peptides Online \| Peptides for Sale \| Tetrava Labs | Buy peptides online from Tetrava Labs. Research peptides for sale with verified purity and third-party lab testing. |
| `/shop` | Research Peptides for Sale \| Tetrava Labs | Browse the full Tetrava Labs catalog — GLP-1 peptides, tissue repair compounds, growth secretagogues, and lab supplies with batch COAs. |
| `/{handle}` | {productName with strengths} — {category} \| Tetrava Labs | {productName with strengths} for laboratory research (RUO). {purity} purity with lot-linked COA. [CAS …]. |
| `/category/{slug}` | {seoTitle or "{label} — research peptides"} \| Tetrava Labs | Sanity seoDescription → category art description → Shop {label} research compounds… |
| `/categories` | Product categories \| Tetrava Labs | Browse research peptides by category — GLP-1, tissue repair, growth hormone axis, longevity, metabolic, blends, and lab supplies. |
| `/blog` | Research Hub — articles & protocols \| Tetrava Labs | Protocol notes, peptide handling guidance, and analytical documentation for qualified research buyers. |
| `/blog/{slug}` | {post.title} \| Tetrava Labs | {post.excerpt} or “Research article from Tetrava Labs.” |
| `/coa-library` | COA library — batch certificates \| Tetrava Labs | Search lot-linked Certificates of Analysis (COA) for Tetrava Labs research peptides. |
| `/coa-library/{handle}` | {displayName} — COA documents \| Tetrava Labs | Lot-linked Certificates of Analysis for {displayName}. {N} research document(s) available. |
| `/about` | About Tetrava Labs \| Verified Research-Use-Only Peptides | Tetrava Labs supplies HPLC-MS verified, COA-documented research peptides with cold-chain shipping to qualified labs. Verified. Documented. Delivered. RUO. |
| `/faq` | FAQ — ordering, shipping & COAs \| Tetrava Labs | Answers about research-use peptides, HPLC verification, certificates of analysis, shipping, and payment. |
| `/contact` | Contact \| Tetrava Labs | Contact Tetrava Labs for research support, order questions, COA documents, and compliance inquiries. |
| `/payment` | How to pay — card & crypto checkout \| Tetrava Labs | Step-by-step payment guide for Tetrava Labs orders using credit card, Apple Pay, BTC, USDT, ETH, and other supported assets. |
| `/shipping` | Shipping Information \| Tetrava Labs | Tetrava Labs international delivery times, fulfillment, cold-chain packaging, tracking guidance, and customs information for research peptide orders. |
| `/privacy` | Privacy Policy \| Tetrava Labs | How Tetrava Labs collects, uses, stores, and protects personal information for research-use customers on tetravalabs.com. |
| `/terms` | Terms of Service \| Tetrava Labs | Terms governing Tetrava Labs website use and research-compound purchases, including RUO requirements, orders, shipping, quality, and liability. |
| `/refund` | Refund & Delivery Policy \| Tetrava Labs | Tetrava Labs delivery guarantee, reshipment policy, customs exceptions, and refund conditions for research peptides. |
| `/ruo` | Research Use Only Policy \| Tetrava Labs | Tetrava Labs Research Use Only (RUO) policy — compounds are for qualified laboratory research, not human consumption. |

## Utility / noIndex pages

| Path | Title tag | Meta description |
|---|---|---|
| `/search` | Search research compounds \| Tetrava Labs | Search the Tetrava Labs catalog by peptide name, CAS number, formula, or sequence. |
| `/cart` | Cart \| Tetrava Labs | Review your selected research compounds before checkout. |
| `/orders` | Order history \| Tetrava Labs | View past orders or look up a guest checkout with your email and order number. |
| `/checkout` | Checkout \| Tetrava Labs | Complete your Tetrava Labs research order. |
| `/checkout/payment` | Payment \| Tetrava Labs | Complete payment for your Tetrava Labs order. |
| `/checkout/success` | Order confirmed \| Tetrava Labs | Your Tetrava Labs order confirmation. |
| `/shipping-restricted` | Shipping Restricted \| Tetrava Labs | Checkout is unavailable for your location due to Tetrava Labs shipping compliance restrictions. |
| `/account` | Account \| Tetrava Labs | Manage your Tetrava Labs research account. |
| `/account/details` | Account details \| Tetrava Labs | Edit your Tetrava Labs account profile and password settings. |
| `/account/addresses` | Addresses \| Tetrava Labs | Manage billing and shipping addresses for your Tetrava Labs account. |
| `/account/orders` | Orders \| Tetrava Labs | View your Tetrava Labs order history. |
| `/account/downloads` | Downloads \| Tetrava Labs | Access COA and batch documents for your Tetrava Labs orders. |
| `/account/restocks` | Peptide Refills \| Tetrava Labs | Manage your Tetrava Labs Peptide Refill schedules. |
| `/account/forgot-password` | Forgot Password \| Tetrava Labs | Request a secure password reset link for your Tetrava Labs account. |
| `/account/reset-password` | Reset Password \| Tetrava Labs | Set a new password for your Tetrava Labs account. |
| `/reorder/{token}` | (site default) | (site default) |

Source: `apps/storefront` `buildPageMetadata` (Jul 2026). For schema markup too, see `doc/seo-page-inventory.md`.
