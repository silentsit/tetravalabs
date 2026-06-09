export type FaqItem = {
  question: string
  answer: string
}

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
      "We ship using temperature-controlled packaging where appropriate for lyophilized peptides. Domestic orders typically arrive within 2–5 business days. International shipping times vary by destination. All packages are discreet and unmarked."
  },
  {
    question: "How should peptides be stored?",
    answer:
      "Lyophilized peptides should be stored at -20°C for long-term stability. Once reconstituted, store at 4°C and use within the timeframe specified in product documentation. Avoid repeated freeze-thaw cycles."
  },
  {
    question: "Do you ship internationally?",
    answer:
      "International shipping availability depends on destination and compliance policy. Customs fees and import duties are the responsibility of the recipient. Contact support before placing large international orders."
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
