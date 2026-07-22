export type FaqItem = {
  question: string
  answer: string
}

export const productFaqItems: FaqItem[] = [
  {
    question: "What is the purity of this compound?",
    answer:
      "All compounds are verified by independent third-party HPLC-MS analysis. The purity percentage is listed on the product page and documented in the lot-linked Certificate of Analysis when published."
  },
  {
    question: "How is this compound shipped?",
    answer:
      "Lyophilized peptides ship via USPS in temperature-controlled packaging with cold packs where required. Packages are discreet and unmarked. Tracking is emailed when the carrier label is generated. See the Shipping page for rates and delivery windows."
  },
  {
    question: "How should I store this product?",
    answer:
      "Store lyophilized powder at -20°C for long-term stability. Avoid repeated freeze-thaw cycles. Once reconstituted, store at 4°C and follow your laboratory protocol for use-by timing."
  }
]

export const faqItems: FaqItem[] = [
  {
    question: 'What does "Research Use Only" mean?',
    answer:
      "Research Use Only (RUO) designates that these compounds are intended strictly for laboratory research purposes. They are not approved for human consumption, diagnostic use, or therapeutic applications. All customers must confirm they are qualified research professionals before purchase."
  },
  {
    question: "How do you verify peptide purity?",
    answer:
      "Every batch is analyzed by independent third-party laboratories using HPLC and mass spectrometry. Certificates of Analysis (COA) are available for products, detailing purity percentage, molecular weight confirmation, and chromatographic data."
  },
  {
    question: "What shipping methods do you use?",
    answer:
      "We ship with temperature-controlled packaging where appropriate for lyophilized peptides. Orders are processed within 12 hours; delivery times vary by region (e.g. 5–11 business days to USA, Canada, Australia, and UK). Shipping rate is shown at checkout. Tracking is emailed after dispatch — use Post Track or 17 Track for the most accurate updates."
  },
  {
    question: "How should peptides be stored?",
    answer:
      "Lyophilized peptides should be stored at -20°C for long-term stability. Once reconstituted, store at 4°C and use within the timeframe specified in product documentation. Avoid repeated freeze-thaw cycles."
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, where your destination is not restricted. Typical delivery windows: 5–11 business days (USA, Canada, Australia, UK), 3–5 business days (South-East Asia), 7–14 business days (rest of world). Customs fees and import duties are the recipient’s responsibility. See our Shipping page for tracking guidance."
  },
  {
    question: "What is your return policy?",
    answer:
      "Due to the nature of research compounds, we cannot accept returns on opened or used products. Unopened products may qualify for store credit within 14 days of delivery. Contact support to initiate a return review."
  },
  {
    question: "How do I verify the purity of my order?",
    answer:
      "Each product batch can include a Certificate of Analysis (COA) from an independent laboratory. COA documents include HPLC data, purity percentages, and molecular weight confirmation where applicable."
  },
  {
    question: "Do you offer bulk or institutional pricing?",
    answer:
      "Volume pricing may be available for institutional orders. Contact our research support team with your requirements for a custom quote."
  }
]
