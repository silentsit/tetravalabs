import { type FaqItem, productFaqItems } from "@/lib/faq-content"

/**
 * Curated PDP FAQs for homepage featured (top-seller) compounds.
 * Keys = compound parent handles from FEATURED_PRODUCT_HANDLES.
 * Non-listed products fall back to generic productFaqItems.
 */
export const productFaqsByHandle: Record<string, FaqItem[]> = {
  "bpc-157": [
    {
      question: "What is BPC-157 used for in laboratory research?",
      answer:
        "BPC-157 is a synthetic gastric pentadecapeptide studied in tissue repair, angiogenesis, and musculoskeletal research models. Tetrava Labs supplies it as a Research Use Only (RUO) reagent with lot-linked documentation — not for human or veterinary use."
    },
    {
      question: "What purity and COA documentation come with BPC-157?",
      answer:
        "Each lot is verified by independent third-party HPLC-MS analysis. The purity percentage shown on this page is confirmed on the Certificate of Analysis when published for that batch. Always match the COA batch number to the vial before starting comparative work."
    },
    {
      question: "How should lyophilized BPC-157 be reconstituted in the lab?",
      answer:
        "Reconstitute under sterile technique with a protocol-appropriate diluent (commonly bacteriostatic water or another vehicle specified in your SOP). Avoid vigorous foaming, record diluent lot and final concentration in your ELN, and follow institutional chemical-handling rules. This guidance is for laboratory preparation only — not dosing advice."
    },
    {
      question: "How should I store BPC-157 before and after reconstitution?",
      answer:
        "Store lyophilized powder at -20°C for long-term stability. Once reconstituted, store at 4°C, minimize freeze–thaw cycles, and use within the window defined by your laboratory protocol."
    },
    {
      question: "How is BPC-157 shipped?",
      answer:
        "Lyophilized BPC-157 ships in temperature-controlled packaging with cold packs where required. Packages are discreet. Tracking is emailed when the carrier label is generated — see the Shipping page for regional delivery windows."
    },
    {
      question: "Is BPC-157 Research Use Only?",
      answer:
        "Yes. All Tetrava Labs BPC-157 vials are designated Research Use Only. They are not approved for human consumption, diagnostic use, or therapeutic applications. Buyers must be qualified research professionals."
    }
  ],
  semaglutide: [
    {
      question: "What is semaglutide studied for in research settings?",
      answer:
        "Semaglutide is a GLP-1 receptor agonist analog used in metabolic, receptor-binding, and signaling research models. Tetrava Labs offers it strictly as an RUO laboratory reagent with identity and purity controls — not as a medication or consumer product."
    },
    {
      question: "How do I verify semaglutide purity and identity?",
      answer:
        "Lots are tested by independent third-party HPLC-MS. Review the lot-linked Certificate of Analysis for purity percentage, molecular-weight confirmation, and chromatographic data when published, and file it with your material ID."
    },
    {
      question: "What strengths of research semaglutide are available?",
      answer:
        "Strength options and pack sizes are listed on this product page. Choose the configuration that matches your assay cadence and retention policy so inventory planning stays consistent across study arms."
    },
    {
      question: "How should research semaglutide be stored?",
      answer:
        "Keep lyophilized material at -20°C. After reconstitution per your SOP, store working solutions at 4°C, protect from unnecessary light exposure if your protocol requires it, and avoid repeated freeze–thaw cycles."
    },
    {
      question: "How is semaglutide shipped for laboratory orders?",
      answer:
        "Orders ship in cold-chain-aware packaging appropriate for lyophilized peptides. Tracking is emailed after dispatch. Delivery windows and rates are summarized on the Shipping page."
    },
    {
      question: "Can semaglutide from Tetrava Labs be used in humans?",
      answer:
        "No. This catalog item is Research Use Only and is not intended for human or veterinary administration, compounding for clinical use, or diagnostic applications."
    }
  ],
  tirzepatide: [
    {
      question: "What is tirzepatide used for in laboratory research?",
      answer:
        "Tirzepatide is a dual GIP/GLP-1 receptor agonist analog studied in metabolic and receptor pharmacology models. Tetrava Labs supplies research-grade material for qualified laboratories under RUO designation only."
    },
    {
      question: "Does tirzepatide include a Certificate of Analysis?",
      answer:
        "When a batch COA is published, it documents third-party HPLC-MS purity and identity data for that lot. Cross-check the batch number on the vial against the COA before locking experimental design."
    },
    {
      question: "How does tirzepatide differ from semaglutide in research catalogs?",
      answer:
        "Semaglutide is typically framed as a GLP-1 pathway research tool; tirzepatide is framed as a dual GIP/GLP-1 pathway tool. Both are RUO reagents here — selection should follow your assay targets and institutional protocol, not therapeutic intent."
    },
    {
      question: "How should tirzepatide be reconstituted and handled?",
      answer:
        "Use sterile technique and a diluent specified by your laboratory SOP. Record concentration, operator, and timestamp in your ELN. Handle as a research chemical under institutional PPE and waste rules — not as a clinical preparation."
    },
    {
      question: "What are the storage requirements for tirzepatide?",
      answer:
        "Store lyophilized powder at -20°C. Reconstituted stocks are typically held at 4°C with minimal freeze–thaw cycling, per your validated method."
    },
    {
      question: "How is tirzepatide shipped?",
      answer:
        "Lyophilized vials ship with temperature-controlled packaging where required. Tracking is provided by email after the label is generated. See Shipping for international windows and customs notes."
    }
  ],
  retatrutide: [
    {
      question: "What is retatrutide in a research context?",
      answer:
        "Retatrutide is a multi-agonist peptide analog investigated in metabolic research models. Tetrava Labs lists it as Research Use Only material for laboratory procurement — not for clinical or consumer use."
    },
    {
      question: "How is retatrutide purity verified?",
      answer:
        "Independent third-party HPLC-MS testing supports identity and purity claims. Lot-linked COA documents are published when available and should be retained with working stocks."
    },
    {
      question: "Which retatrutide strengths can laboratories order?",
      answer:
        "Available strengths and vial packs appear in the purchase panel on this page. Select the option that fits your plate map, bridging studies, and retention aliquot policy."
    },
    {
      question: "How should retatrutide be stored in the lab?",
      answer:
        "Lyophilized powder: -20°C for long-term stability. After reconstitution under sterile technique, store at 4°C and follow your SOP for use-by timing and light protection."
    },
    {
      question: "Is retatrutide shipped with cold-chain packaging?",
      answer:
        "Yes where required for lyophilized peptides. Packages are discreet, and tracking is emailed when the shipment is labeled. Regional delivery estimates are on the Shipping page."
    },
    {
      question: "Is Tetrava Labs retatrutide approved for human use?",
      answer:
        "No. It is designated Research Use Only and must not be used for human consumption, veterinary administration, or diagnostic testing."
    }
  ],
  "ghk-cu": [
    {
      question: "What is GHK-Cu studied for in research?",
      answer:
        "GHK-Cu (copper tripeptide-1 complex) is examined in skin biology, wound-model, and extracellular-matrix research. Tetrava Labs supplies it as an RUO laboratory reagent with documented purity controls."
    },
    {
      question: "What purity documentation is provided for GHK-Cu?",
      answer:
        "Batches are analyzed by independent third-party HPLC-MS. When a Certificate of Analysis is published, it lists purity and identity data for that lot — file it with your internal material ID."
    },
    {
      question: "What GHK-Cu strengths are available?",
      answer:
        "Strength options (for example 50mg / 100mg families where listed) and pack tiers are shown on this page. Choose based on assay volume planning, not ad-hoc mid-study restocking."
    },
    {
      question: "How should GHK-Cu be stored?",
      answer:
        "Store lyophilized powder at -20°C. After reconstitution per your protocol, hold at 4°C, minimize freeze–thaw cycles, and dispose of unused solution under institutional chemical-waste rules."
    },
    {
      question: "How is GHK-Cu shipped?",
      answer:
        "Orders ship in temperature-controlled packaging appropriate for lyophilized peptides, with email tracking after dispatch. See the Shipping page for delivery windows by region."
    },
    {
      question: "Is GHK-Cu from this store for cosmetic or clinical use?",
      answer:
        "No. Catalog GHK-Cu is Research Use Only for qualified laboratory professionals and is not intended for cosmetic, diagnostic, or therapeutic applications."
    }
  ],
  ipamorelin: [
    {
      question: "What is ipamorelin used for in laboratory research?",
      answer:
        "Ipamorelin is a selective growth hormone secretagogue peptide studied in receptor and endocrine research models. Tetrava Labs provides it strictly as RUO material for qualified labs."
    },
    {
      question: "How do I confirm ipamorelin identity and purity?",
      answer:
        "Third-party HPLC-MS testing supports lot identity and purity. Review the published COA for the batch you receive and reconcile it against the vial label before comparative assays."
    },
    {
      question: "How should ipamorelin be reconstituted for research protocols?",
      answer:
        "Reconstitute under sterile conditions with the diluent specified in your SOP. Document concentration, diluent lot, and operator in your ELN. This is laboratory preparation guidance only — not a clinical dosing protocol."
    },
    {
      question: "What are the storage conditions for ipamorelin?",
      answer:
        "Keep lyophilized vials at -20°C. Reconstituted solutions are typically stored at 4°C with limited freeze–thaw cycles according to your method validation."
    },
    {
      question: "How is ipamorelin shipped?",
      answer:
        "Lyophilized ipamorelin ships with cold packs where required and discreet packaging. Tracking is emailed when the carrier label is created."
    },
    {
      question: "Can I buy ipamorelin for personal use?",
      answer:
        "No. Sales are limited to Research Use Only procurement for qualified research professionals. The product is not for human consumption or veterinary use."
    }
  ],
  tb500: [
    {
      question: "What is TB-500 in research catalogs?",
      answer:
        "TB-500 refers to a synthetic thymosin β4 fragment used in tissue-repair and cell-migration research models. Tetrava Labs lists it as Research Use Only with lot-linked analytical documentation when published."
    },
    {
      question: "How does TB-500 differ from BPC-157 for lab procurement?",
      answer:
        "Both appear in tissue-repair research categories, but they are distinct sequences with different molecular identities. Select based on your assay design and documented CAS/sequence fields — not interchangeable substitutes without a bridging study."
    },
    {
      question: "What COA data should I expect for TB-500?",
      answer:
        "Independent HPLC-MS analysis supports purity and identity. When a COA is published for your batch, retain HPLC summaries and batch numbers with your ELN records."
    },
    {
      question: "How should TB-500 be reconstituted and stored?",
      answer:
        "Reconstitute lyophilized powder under sterile technique per your SOP. Store dry material at -20°C; keep reconstituted stocks at 4°C and avoid repeated freeze–thaw cycles."
    },
    {
      question: "How is TB-500 shipped?",
      answer:
        "Shipments use temperature-controlled packaging where appropriate for lyophilized peptides. Tracking is emailed after dispatch; see Shipping for regional timelines."
    },
    {
      question: "Is TB-500 approved for human use?",
      answer:
        "No. Tetrava Labs TB-500 is designated Research Use Only and must not be used for human or veterinary administration."
    }
  ],
  "hgh-191aa": [
    {
      question: "What is HGH 191aa as a research reagent?",
      answer:
        "HGH 191aa refers to recombinant human growth hormone (somatropin) sequence material used in receptor, signaling, and analytical research contexts. Tetrava Labs supplies it under Research Use Only terms for qualified laboratories."
    },
    {
      question: "How is HGH 191aa purity verified?",
      answer:
        "Lots are evaluated with independent third-party analytical methods appropriate to the catalog item. Review the lot-linked Certificate of Analysis when published for purity and identity confirmation."
    },
    {
      question: "What IU strengths are available for research HGH 191aa?",
      answer:
        "Available IU strengths and pack options are listed in the purchase panel. Match strength selection to your assay design and inventory controls rather than informal unit conversion mid-study."
    },
    {
      question: "How should HGH 191aa be stored?",
      answer:
        "Follow the storage guidance on this page and your institutional SOP. Lyophilized material is typically held cold for stability; reconstituted solutions require controlled refrigerated storage and limited freeze–thaw cycling."
    },
    {
      question: "How is HGH 191aa shipped?",
      answer:
        "Orders ship with temperature-controlled packaging where required. Tracking is emailed when the shipment is labeled. International delivery windows are outlined on the Shipping page."
    },
    {
      question: "Is research HGH 191aa the same as a pharmacy prescription product?",
      answer:
        "No. This listing is a Research Use Only catalog item for laboratory use. It is not a dispensed medication and is not intended for human therapeutic administration."
    }
  ]
}

/** Resolve PDP FAQs for a compound parent handle; generic fallback for the rest of the catalog. */
export function getProductFaqs(parentHandle: string): FaqItem[] {
  const key = parentHandle.trim().toLowerCase()
  return productFaqsByHandle[key] || productFaqItems
}
