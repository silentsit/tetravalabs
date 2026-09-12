# Title tags & meta descriptions

Rendered titles use the template `%s | Tetrava Labs` unless noted as absolute.

Default (fallback): **Tetrava Labs — Verified. Documented. Delivered.**  
Default description: Research-use peptides with HPLC-MS verification, lot-linked COAs, and cold-chain shipping for qualified laboratories.

## Open Graph / Twitter cards

Social previews are **1200×630 PNG** cards from `/og` (`apps/storefront/src/app/og/route.tsx`). `buildPageMetadata` always emits `og:image` / `twitter:image` with width, height, and type. Do not use `/brand/tetravalabs-icon.png` as a share image (favicon / Organization.logo only).

Product, article, and category cards include the page title, RUO eyebrow, and a composited catalog photo when one exists.

## Public pages

| Path | Title tag | Meta description |
|---|---|---|
| `/` | Buy Peptides Online \| Peptides for Sale \| Tetrava Labs | Buy peptides online from Tetrava Labs. Research peptides for sale with verified purity and third-party lab testing. |
| `/shop` | Research Peptides for Sale \| Tetrava Labs | Browse the full Tetrava Labs catalog — GLP-1 peptides, tissue repair compounds, growth secretagogues, and lab supplies with batch COAs. |
| `/{handle}` | {productName with strengths} — {category} \| Tetrava Labs | {productName with strengths} for laboratory research (RUO). {purity} purity with lot-linked COA. [CAS …]. |
| `/buy-bpc-157-online` | BPC-157 Peptide for Sale • Tissue Repair \| Tetrava Labs | BPC-157 peptide for sale at Tetrava Labs — third-party verified 99%+ purity with lot-linked COA. Buy BPC-157 online with us today. |
| `/buy-retatrutide-online` | Buy Retatrutide Peptide Online \| Retatrutide for Sale \| Tetrava | Wondering where to buy retatrutide? Find 99%+ pure retatrutide for sale with lot-linked COA, competitive pricing, and cold-chain dispatch. RUO. |
| `/buy-semaglutide-online` | Buy Semaglutide Online (5mg, 10mg) \| 99% Purity \| Tetrava | Buy research-grade Semaglutide online in 5mg and 10mg. Verified 99%+ HPLC-MS purity with lot-linked COAs. Cold-chain shipping. RUO. CAS 910463-68-2. |
| `/buy-mots-c-online` | Buy MOTS-c Peptide Online \| MOTS-c for Sale \| Tetrava | Buy MOTS-c peptide online for qualified labs. Get 99%+ HPLC-MS purity, lot-linked COA documentation, competitive pricing, and cold-chain dispatch. RUO only. |
| `/buy-aod-9604-online` | Buy AOD-9604 Peptide Online (5mg / 10mg) \| 99%+ COA \| Tetrava | Buy AOD-9604 peptide online in 5mg and 10mg vials. 99%+ HPLC-MS lab-tested purity, lot-linked COA. Research-grade hGH fragment 176-191. RUO. |
| `/buy-nad-online` | Buy NAD+ Peptide Online (100mg/500mg/1000mg) \| 99%+ Purity \| Tetrava | Buy research-grade NAD+ online in 100mg, 500mg, and 1000mg. Verified 99%+ HPLC-MS purity with lot-linked COAs. Cold-chain shipping. Research use only (RUO). |
| `/buy-dsip-online` | Buy DSIP Peptide Online (5mg / 10mg / 15mg) \| 99%+ COA \| Tetrava | Buy DSIP peptide online in 5mg, 10mg, and 15mg vials. 99%+ HPLC-MS lab-tested purity, lot-linked COA. Delta Sleep-Inducing Peptide for research. RUO. |
| `/buy-pinealon-capsules-online` | Buy Pinealon Capsules (500 mcg) \| 100 capsules \| Tetrava | Buy Pinealon capsules (500 mcg, 100 count) for oral-route Glu-Asp-Arg research. Lot-linked COA. Research use only (RUO). |
| `/buy-ghk-cu-online` | Buy GHK-Cu Peptide Online \| GHK-Cu for Sale \| Tetrava | Where to buy GHK-Cu peptide? 50mg and 100mg research vials with 99%+ HPLC-MS purity and lot-linked COA. Cold-chain shipping. Research use only. |
| `/buy-tb-500-online` | Buy TB-500 Peptide Online \| TB-500 for Sale \| Tetrava | Buy TB-500 peptide online in 5mg and 10mg. TB-500 for sale with 99%+ HPLC-MS purity, lot-linked COA, and cold-chain shipping. Research use only (RUO). |
| `/buy-ipamorelin-online` | Buy Ipamorelin Peptide \| Ipamorelin for Sale \| Tetrava | Buy ipamorelin online in 5mg and 10mg. Where to buy ipamorelin peptide with 99%+ HPLC-MS purity and lot-linked COA. Cold-chain. Research use only. |
| `/buy-tesamorelin-online` | Buy Tesamorelin Peptide Online \| 5mg / 10mg / 20mg \| Tetrava | Buy tesamorelin peptide online in 5mg, 10mg, and 20mg. Tesamorelin 10mg for sale with 99%+ HPLC-MS and lot-linked COA. Cold-chain. Research use only. |
| `/buy-hgh-191aa-online` | Buy HGH 191aa Online \| HGH 191aa for Sale \| Tetrava | HGH 191aa for sale as a documented 191-amino-acid research reagent. 99%+ HPLC-MS purity, lot-linked COA, cold-chain shipping. Not a fragment. RUO. |
| `/buy-igf-1-lr3-online` | Buy IGF-1 LR3 Peptide Online \| IGF-1 LR3 for Sale \| Tetrava | Buy IGF-1 LR3 peptide online in 0.1mg and 1mg. IGF-1 LR3 for sale with 99%+ HPLC-MS purity and lot-linked COA. Cold-chain shipping. Research use only. |
| `/cjc-1295-without-dac` | Buy CJC-1295 No DAC \| CJC-1295 without DAC \| Tetrava | Buy CJC-1295 no DAC online in 5mg and 10mg. CJC-1295 without DAC for sale with 99%+ HPLC-MS and lot-linked COA. Not the DAC analog. RUO. |
| `/cjc-1295-with-dac` | Buy CJC-1295 with DAC Online \| 5mg / 10mg \| Tetrava | Buy CJC-1295 with DAC online in 5mg and 10mg, including CJC-1295 with DAC 10mg. 99%+ HPLC-MS, lot-linked COA, cold-chain. Research use only. |
| `/buy-kpv-online` | Buy KPV Peptide Online \| KPV Peptide for Sale \| Tetrava | Where to buy KPV peptide? Buy KPV peptide online in 5mg and 10mg research vials. 99%+ HPLC-MS, lot-linked COA, cold-chain. Research use only (RUO). |
| `/buy-epithalon-online` | Buy Epithalon (Epitalon) \| Epitalon Peptide \| Tetrava | Buy epithalon online (also searched as epitalon) in 10mg, 20mg, and 50mg. 99%+ HPLC-MS purity, lot-linked COA, cold-chain shipping. Research use only. |
| `/wolverine-bpc-157-tb-500-blend` | Buy BPC-157 and TB-500 Blend \| Wolverine Stack \| Tetrava | Where to buy BPC-157 and TB-500? Wolverine peptide stack for sale in 10mg and 20mg blend vials. 99%+ HPLC-MS, lot-linked COA. Research use only. |
| `/glow-bpc-157-tb-500-ghk-cu` | Buy GLOW Peptide Online \| GLOW Blend for Sale \| Tetrava | Buy GLOW peptide online. GLOW blend peptide for sale (BPC-157, TB-500, GHK-Cu) in 30mg, 70mg, and 85mg. 99%+ HPLC-MS, lot-linked COA. RUO. |
| `/buy-melanotan-2-online` | Buy Melanotan 2 Online \| Melanotan 2 for Sale \| Tetrava | Where to buy Melanotan 2? Melanotan 2 for sale as a 10mg research vial with 99%+ HPLC-MS purity and lot-linked COA. Cold-chain. Research use only. |
| `/buy-mk-677-online` | MK-677 for Sale \| Buy MK-677 (Ibutamoren) \| Tetrava | MK-677 for sale (ibutamoren). Buy MK-677 online as a documented 5mg research reagent with 99%+ HPLC-MS and lot-linked COA. Cold-chain. Research use only. |
| `/buy-hexarelin-acetate-online` | Buy Hexarelin Online \| Hexarelin Peptide for Sale \| Tetrava | Buy hexarelin online in 2mg and 5mg. Hexarelin peptide for sale with 99%+ HPLC-MS purity and lot-linked COA. Cold-chain shipping. Research use only. |
| `/buy-thymosin-alpha-1-online` | Buy Thymosin Alpha-1 Online (5mg / 10mg) \| Tetrava | Buy thymosin alpha-1 online in 5mg and 10mg, including thymosin alpha-1 10mg. 99%+ HPLC-MS, lot-linked COA, cold-chain. Research use only (RUO). |
| `/buy-kisspeptin-10-online` | Buy Kisspeptin-10 Online \| Kisspeptin-10 for Sale \| Tetrava | Buy kisspeptin-10 for sale in 5mg and 10mg research vials. 99%+ HPLC-MS purity, lot-linked COA, and cold-chain shipping. Research use only (RUO). |
| `/buy-cagrilintide-semaglutide-online` | Buy Cagrilintide Semaglutide Blend \| 5mg / 10mg \| Tetrava | Buy cagrilintide semaglutide blend online in 5mg and 10mg. Two-ligand research vial, 99%+ HPLC-MS, lot-linked COA. Not a branded pen. RUO. |
| `/buy-hcg-online` | Buy HCG Peptide Online \| HCG 5000 IU / 10000 IU \| Tetrava | Buy HCG peptide online in 5000 IU and 10000 IU. Where can I buy HCG online with lot-linked COA and 99%+ HPLC-MS? Cold-chain. Research use only. |
| `/buy-aicar-online` | Buy AICAR Peptide Online \| AICAR 50mg for Sale \| Tetrava | Buy AICAR peptide online. AICAR 50mg for sale with 99%+ HPLC-MS purity and lot-linked COA. AMPK research reagent. Cold-chain. Research use only. |
| `/category/{slug}` | {seoTitle or "{label} — research peptides"} \| Tetrava Labs | Sanity seoDescription → category art description → Shop {label} research compounds… |
| `/categories` | Product categories \| Tetrava Labs | Browse research peptides by category — GLP-1, tissue repair, growth hormone axis, longevity, metabolic, blends, and lab supplies. |
| `/blog` | Research Hub — articles & protocols \| Tetrava Labs | Protocol notes, peptide handling guidance, and analytical documentation for qualified research buyers. |
| `/blog/{slug}` | {post.title} \| Tetrava Labs | {post.excerpt} or “Research article from Tetrava Labs.” |
| `/coa-library` | COA library — batch certificates \| Tetrava Labs | Search lot-linked Certificates of Analysis (COA) for Tetrava Labs research peptides. |
| `/tools/peptide-identity` | Peptide identity index \| Tetrava | Peptide identity index for research peptides: sequence, CAS, mass, and expected MS ions. Compare two names to see if they are the same molecule. RUO. |
| `/coa-library/{handle}` | {displayName} — COA documents \| Tetrava Labs | Lot-linked Certificates of Analysis for {displayName}. {N} research document(s) available. |
| `/about` | About Tetrava Labs \| Verified Research-Use-Only Peptides | Tetrava Labs supplies HPLC-MS verified, COA-documented research peptides with cold-chain shipping to qualified labs. Verified. Documented. Delivered. RUO. |
| `/faq` | FAQ — ordering, shipping & COAs \| Tetrava Labs | Answers about research-use peptides, HPLC verification, certificates of analysis, shipping, and payment. |
| `/contact` | Contact Tetrava Labs \| Customer & Technical Support | Contact Tetrava Labs for research support, order questions, COA documents, and compliance inquiries. |
| `/payment` | How to pay — card, Wise & crypto \| Tetrava Labs | How to pay at Tetrava Labs: place the order, then pay by card in a new checkout tab. Wise and crypto charge on their own pages. |
| `/shipping` | Shipping Information \| Tetrava Labs | Tetrava Labs international delivery times, fulfillment, cold-chain packaging, tracking guidance, and customs information for research peptide orders. |
| `/privacy` | Privacy Policy \| Tetrava Labs | How Tetrava Labs collects, uses, stores, and protects personal information for research-use customers on tetravalabs.com. |
| `/terms` | Terms of Service \| Tetrava Labs | Terms governing Tetrava Labs website use and research-compound purchases, including RUO requirements, orders, shipping, quality, and liability. |
| `/refund` | Refund & Delivery Policy \| Tetrava Labs | Tetrava Labs delivery guarantee, reshipment policy, customs exceptions, and refund conditions for research peptides. |
| `/ruo` | Research Use Only Policy \| Tetrava Labs | Tetrava Labs Research Use Only (RUO) policy — compounds are for qualified laboratory research, not human consumption. |
| `/sitemap` | Sitemap \| Tetrava Labs | HTML sitemap of Tetrava Labs: research peptide product pages, categories, Research Hub articles, and policy pages. XML index at /sitemap_index.xml. |

## Utility / noIndex pages

| Path | Title tag | Meta description |
|---|---|---|
| `/search` | Search research compounds \| Tetrava Labs | Search the Tetrava Labs catalog by peptide name, CAS number, formula, or sequence. |
| `/cart` | Cart \| Tetrava Labs | Review your selected research compounds before checkout. |
| `/orders` | Order history \| Tetrava Labs | View past orders or look up a guest checkout with your email and order number. |
| `/checkout` | Checkout \| Tetrava Labs | Complete your Tetrava Labs research order. |
| `/checkout/payment` | Payment \| Tetrava Labs | Complete payment for your Tetrava Labs order. |
| `/checkout/success` | Order received \| Tetrava Labs | Your Tetrava Labs order confirmation. |
| `/checkout/thank-you` | Order received \| Tetrava Labs | Your Tetrava Labs order is recorded. Check email for the receipt and PayPal invoice. |
| `/account/invoices` | Invoice orders \| Tetrava Labs | Review on-hold card invoice orders and mark PayPal invoices as paid. |
| `/account/indexing` | Indexing \| Tetrava Labs | Submit Tetrava Labs sitemap URLs to search engines via IndexNow. |
| `/shipping-restricted` | Shipping Restricted \| Tetrava Labs | Checkout is unavailable for your location due to Tetrava Labs shipping compliance restrictions. |
| `/account` | Account \| Tetrava Labs | Manage your Tetrava Labs research account. |
| `/account/details` | Account details \| Tetrava Labs | Edit your Tetrava Labs account profile and password settings. |
| `/account/addresses` | Addresses \| Tetrava Labs | Manage billing and shipping addresses for your Tetrava Labs account. |
| `/account/orders` | Orders \| Tetrava Labs | View your Tetrava Labs order history. |
| `/account/downloads` | Downloads \| Tetrava Labs | Access COA and batch documents for your Tetrava Labs orders. |
| `/account/forgot-password` | Forgot Password \| Tetrava Labs | Request a secure password reset link for your Tetrava Labs account. |
| `/account/reset-password` | Reset Password \| Tetrava Labs | Set a new password for your Tetrava Labs account. |
| `/reorder/{token}` | Reorder \| Tetrava | Reload a previous Tetrava Labs research order from your secure email link. |
| `(not-found)` | Page not found \| Tetrava | The page you requested does not exist on tetravalabs.com. Browse the research peptide catalog or return home. |

Source: `apps/storefront` `buildPageMetadata` (Aug 2026). For schema markup too, see `doc/seo-page-inventory.md`.
