import { type FaqItem, productFaqItems } from "@/lib/faq-content"
import { getCompoundParentHandle } from "@/lib/compound-product"
import { buildAutoProductFaqs, type ProductFaqContext } from "@/lib/product-faq-auto"

/**
 * Hand-curated PDP FAQs: featured top sellers + next sales tier.
 * Other catalog products use buildAutoProductFaqs() (still unique per product).
 */
export const productFaqsByHandle: Record<string, FaqItem[]> = {
  "bpc-157": [
    {
      question: "What is BPC-157 used for in laboratory research?",
      answer:
        "BPC-157 is a synthetic gastric pentadecapeptide studied in tissue repair, angiogenesis, and musculoskeletal research models. Tetrava Labs supplies it as a Research Use Only (RUO) reagent with lot-linked documentation — not for human or veterinary use."
    },
    {
      question: "Where can you buy BPC-157 / buy BPC-157 peptide online?",
      answer:
        "You can buy BPC-157 peptide online from Tetrava Labs. BPC-157 peptides for sale on this page ship to qualified researchers with lot-linked COA documentation and cold-chain-aware fulfillment. When comparing suppliers, the best place to buy BPC-157 is one that publishes third-party HPLC-MS purity for the exact batch you receive — not only a generic catalog claim."
    },
    {
      question: "Where can I get BPC-157 near me?",
      answer:
        "RUO research peptides like BPC-157 are not stocked at local pharmacies or walk-in clinics, so \"BPC-157 near me\" searches usually will not find a retail counter. Tetrava Labs ships BPC-157 peptides for sale directly to qualified laboratories nationwide — order online on this page for documented research supply rather than a local store pickup."
    },
    {
      question: "What purity and COA documentation come with BPC-157?",
      answer:
        "Each lot is verified by independent third-party HPLC-MS analysis. The purity percentage shown on this page is confirmed on the Certificate of Analysis when published for that batch. Always match the COA batch number to the vial before starting comparative work."
    },
    {
      question: "Does oral BPC-157 work?",
      answer:
        "In published research, most angiogenesis, tendon-repair, and myotendinous-junction findings used intraperitoneal or local injection routes in animal models — that injectable dataset is larger than the oral one. Oral BPC-157 has been evaluated in a subset of gastrointestinal-protection models, but there is no validated human oral-bioavailability data, and results should not be extrapolated as clinical proof. This is laboratory research context only — not human-use guidance."
    },
    {
      question: "Can BPC-157 be taken orally?",
      answer:
        "BPC-157 is gastric-juice-derived and often described as relatively acid- and enzyme-stable in preclinical GI literature, so some animal studies do use oral administration. Laboratories asking whether BPC-157 can be taken orally should treat the oral route as its own experimental variable (stability, vehicle, and pharmacokinetics), not a drop-in substitute for injectable protocols. Tetrava Labs supplies RUO research material only — not for human or veterinary consumption."
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
  ],

  // --- Next sales tier (curated) ---
  "aod-9604": [
    {
      question: "What is AOD-9604 studied for in research?",
      answer:
        "AOD-9604 is a modified fragment related to the C-terminal region of growth hormone, examined in metabolic and adipose-biology research models. Tetrava Labs supplies it as Research Use Only material for qualified laboratories."
    },
    {
      question: "Does AOD-9604 include third-party purity testing?",
      answer:
        "Lots are verified by independent HPLC-MS analysis. Review the lot-linked Certificate of Analysis when published and reconcile batch numbers before comparative assays."
    },
    {
      question: "How should AOD-9604 be reconstituted?",
      answer:
        "Reconstitute lyophilized powder under sterile technique with a diluent specified by your SOP. Document concentration and operator in your ELN. Laboratory preparation only — not dosing guidance."
    },
    {
      question: "How should AOD-9604 be stored?",
      answer:
        "Store lyophilized vials at -20°C. After reconstitution, hold at 4°C with minimal freeze–thaw cycling per your validated method."
    },
    {
      question: "How is AOD-9604 shipped?",
      answer:
        "Orders ship in cold-chain-aware packaging where required. Tracking is emailed after dispatch. See Shipping for regional windows."
    },
    {
      question: "Is AOD-9604 for human use?",
      answer:
        "No. Catalog AOD-9604 is Research Use Only and must not be used for human or veterinary administration."
    }
  ],
  "cjc-1295-without-dac": [
    {
      question: "What is CJC-1295 without DAC used for in research?",
      answer:
        "CJC-1295 without DAC (Mod GRF 1-29 analogues) is studied in growth-hormone axis and GHRH-receptor research models. Tetrava Labs lists it strictly as an RUO laboratory reagent."
    },
    {
      question: "How does “without DAC” matter for lab procurement?",
      answer:
        "Without-DAC and with-DAC catalog families are distinct identities with different pharmacokinetic research framing. Select the handle that matches your protocol — do not treat them as interchangeable without a bridging study."
    },
    {
      question: "What COA data should I expect for CJC-1295 without DAC?",
      answer:
        "Independent HPLC-MS supports purity and identity. File the published COA with your material ID and confirm the strength on the vial label."
    },
    {
      question: "How should CJC-1295 without DAC be stored?",
      answer:
        "Keep lyophilized powder at -20°C. Reconstituted stocks are typically stored at 4°C with limited freeze–thaw cycles."
    },
    {
      question: "How is CJC-1295 without DAC shipped?",
      answer:
        "Lyophilized vials ship with temperature-controlled packaging where required. Tracking is emailed when the shipment is labeled."
    },
    {
      question: "Is CJC-1295 without DAC Research Use Only?",
      answer:
        "Yes. It is not approved for human consumption, compounding for clinical use, or veterinary administration."
    }
  ],
  "cjc-1295-with-dac": [
    {
      question: "What is CJC-1295 with DAC in a research catalog?",
      answer:
        "CJC-1295 with DAC is a GHRH-analogue research reagent framed for longer-exposure growth-hormone axis models. Tetrava Labs supplies it under Research Use Only terms."
    },
    {
      question: "How is CJC-1295 with DAC purity verified?",
      answer:
        "Third-party HPLC-MS testing supports lot identity and purity. Retain the COA with working stocks when published."
    },
    {
      question: "How should CJC-1295 with DAC be reconstituted?",
      answer:
        "Use sterile technique and a protocol-appropriate diluent. Record preparation details in your ELN. Not a clinical dosing protocol."
    },
    {
      question: "What are the storage conditions?",
      answer:
        "Lyophilized: -20°C. Reconstituted: typically 4°C with minimal freeze–thaw cycling per SOP."
    },
    {
      question: "How is it shipped?",
      answer:
        "Cold-chain-aware packaging where required; discreet parcels; email tracking after labeling."
    },
    {
      question: "Can CJC-1295 with DAC be used in humans?",
      answer: "No. This catalog item is Research Use Only for qualified laboratory professionals."
    }
  ],
  cagrilintide: [
    {
      question: "What is cagrilintide studied for in research settings?",
      answer:
        "Cagrilintide is an amylin-analogue research peptide examined in metabolic and appetite-pathway models. Tetrava Labs offers it as RUO material only."
    },
    {
      question: "How do I verify cagrilintide identity?",
      answer:
        "Review third-party HPLC-MS data on the lot COA when published, and match batch numbers to the sealed vial."
    },
    {
      question: "Which strengths are available?",
      answer:
        "Strength and pack options appear in the purchase panel. Choose the configuration that matches assay cadence and retention policy."
    },
    {
      question: "How should cagrilintide be stored?",
      answer:
        "Store lyophilized powder at -20°C; reconstituted solutions at 4°C with limited freeze–thaw cycles."
    },
    {
      question: "How is cagrilintide shipped?",
      answer:
        "Temperature-controlled packaging where required, with tracking emailed after dispatch."
    },
    {
      question: "Is cagrilintide approved for human use?",
      answer: "No. It is designated Research Use Only."
    }
  ],
  "cagrilintide-semaglutide": [
    {
      question: "What is the cagrilintide + semaglutide blend for research?",
      answer:
        "This catalog blend combines amylin- and GLP-1-pathway research reagents for laboratories running multi-agonist metabolic designs. RUO only — not a clinical combination product."
    },
    {
      question: "How should blend identity be documented?",
      answer:
        "Treat the blend COA and labeled composition as part of the experimental record. Confirm each component’s strength fields against your protocol before reconstitution."
    },
    {
      question: "How is the blend reconstituted?",
      answer:
        "Follow sterile technique and your SOP for multi-component lyophilized reagents. Record diluent, concentration targets, and lot IDs in the ELN."
    },
    {
      question: "Storage guidance?",
      answer:
        "Lyophilized blend vials: -20°C. After reconstitution, refrigerate at 4°C and minimize freeze–thaw cycles."
    },
    {
      question: "Shipping?",
      answer: "Cold-chain-aware packaging where required; tracking emailed when labeled."
    },
    {
      question: "Is this blend for human consumption?",
      answer: "No. Research Use Only for qualified laboratories."
    }
  ],
  mazdutide: [
    {
      question: "What is mazdutide in laboratory research?",
      answer:
        "Mazdutide is a dual GLP-1/glucagon receptor agonist analogue studied in metabolic research models. Tetrava Labs supplies it as an RUO catalog reagent."
    },
    {
      question: "How is mazdutide purity verified?",
      answer:
        "Independent HPLC-MS testing supports identity and purity. File lot COAs when published."
    },
    {
      question: "How should mazdutide be handled after reconstitution?",
      answer:
        "Prepare under sterile conditions per SOP, aliquot if required, and store reconstituted material at 4°C with limited freeze–thaw cycling."
    },
    {
      question: "Storage of lyophilized mazdutide?",
      answer: "Keep sealed lyophilized vials at -20°C for long-term stability."
    },
    {
      question: "How is mazdutide shipped?",
      answer: "Temperature-controlled packaging where required; email tracking after dispatch."
    },
    {
      question: "Is mazdutide Research Use Only?",
      answer: "Yes. Not for human or veterinary administration."
    }
  ],
  nad: [
    {
      question: "What is NAD+ used for in research catalogs?",
      answer:
        "NAD+ (nicotinamide adenine dinucleotide) research reagents are used in metabolic, redox, and cellular-energy pathway studies. Tetrava Labs lists NAD under Research Use Only."
    },
    {
      question: "How do I confirm NAD lot quality?",
      answer:
        "Review the published Certificate of Analysis for the batch you receive and retain it with inventory records."
    },
    {
      question: "Which NAD strengths are available?",
      answer:
        "Strength options are shown on this product page. Select based on assay design and institutional inventory controls."
    },
    {
      question: "How should research NAD be stored?",
      answer:
        "Follow the storage guidance on this page. Protect lyophilized or liquid forms from unnecessary temperature excursions and light if your SOP requires it."
    },
    {
      question: "How is NAD shipped?",
      answer: "Cold-chain-aware packaging where required; tracking emailed after labeling."
    },
    {
      question: "Is catalog NAD a supplement for personal use?",
      answer: "No. This is a Research Use Only laboratory reagent."
    }
  ],
  "bacteriostatic-water": [
    {
      question: "What is bacteriostatic water used for in the lab?",
      answer:
        "Bacteriostatic water is a research solvent commonly used to reconstitute lyophilized peptides under sterile laboratory protocols. RUO catalog item — not a medical product."
    },
    {
      question: "Does bacteriostatic water have a COA?",
      answer:
        "When a lot document is published, it appears in the COA library and on the product page. Match batch identity to the bottle you received."
    },
    {
      question: "How should bacteriostatic water be stored?",
      answer:
        "Store sealed per the product specifications, typically at controlled room temperature or as stated on the label/SOP. Record open dates when required."
    },
    {
      question: "Can I use bacteriostatic water for injections in humans?",
      answer:
        "No. Tetrava Labs bacteriostatic water is sold for laboratory research use only."
    },
    {
      question: "How is bacteriostatic water shipped?",
      answer:
        "Shipped with appropriate packaging for liquid lab supplies. Tracking is emailed after dispatch."
    },
    {
      question: "Which volumes are available?",
      answer:
        "Available fill volumes are listed in the purchase options on this page."
    }
  ],
  selank: [
    {
      question: "What is Selank studied for in research?",
      answer:
        "Selank is a synthetic tuftsin-analogue peptide examined in neuropeptide and stress-pathway research models. Supplied by Tetrava Labs as Research Use Only."
    },
    {
      question: "How is Selank purity documented?",
      answer:
        "Third-party HPLC-MS supports lot purity and identity. Cross-check the COA batch with the vial label."
    },
    {
      question: "How should Selank be reconstituted?",
      answer:
        "Reconstitute lyophilized material under sterile technique per your SOP. Document diluent and concentration in the ELN. Not clinical dosing advice."
    },
    {
      question: "Storage conditions for Selank?",
      answer:
        "Lyophilized: -20°C. Reconstituted: typically 4°C with minimal freeze–thaw cycles."
    },
    {
      question: "How is Selank shipped?",
      answer: "Temperature-controlled packaging where required; discreet parcels; email tracking."
    },
    {
      question: "Is Selank for human use?",
      answer: "No. Research Use Only for qualified laboratories."
    }
  ],
  semax: [
    {
      question: "What is Semax used for in laboratory research?",
      answer:
        "Semax is an ACTH(4-10) analogue studied in neuropeptide and cognitive-research models. Tetrava Labs provides it strictly as an RUO reagent."
    },
    {
      question: "What COA information accompanies Semax?",
      answer:
        "Lot-linked HPLC-MS documentation is published when available. Retain analytical summaries with your material ID."
    },
    {
      question: "How should Semax be handled after reconstitution?",
      answer:
        "Prepare under sterile conditions, store reconstituted stocks at 4°C, and follow institutional waste and PPE rules."
    },
    {
      question: "How should lyophilized Semax be stored?",
      answer: "Keep sealed vials at -20°C for long-term stability."
    },
    {
      question: "Shipping for Semax?",
      answer: "Cold-chain-aware packaging where required; tracking emailed after dispatch."
    },
    {
      question: "Is Semax Research Use Only?",
      answer: "Yes. Not for human or veterinary administration."
    }
  ],
  epithalon: [
    {
      question: "What is Epithalon (Epitalon) in research catalogs?",
      answer:
        "Epithalon is a synthetic tetrapeptide studied in longevity and pineal-related research models. Tetrava Labs lists it as Research Use Only."
    },
    {
      question: "How is Epithalon purity verified?",
      answer:
        "Independent HPLC-MS analysis supports identity and purity claims for published lots."
    },
    {
      question: "Reconstitution guidance for research use?",
      answer:
        "Use sterile technique and a protocol-appropriate diluent. Record preparation parameters in your ELN."
    },
    {
      question: "Storage?",
      answer:
        "Lyophilized powder at -20°C; reconstituted solutions at 4°C with limited freeze–thaw cycling."
    },
    {
      question: "How is Epithalon shipped?",
      answer: "Temperature-controlled packaging where required; email tracking when labeled."
    },
    {
      question: "Can Epithalon be used clinically?",
      answer: "No. This catalog item is RUO only."
    }
  ],
  "mots-c": [
    {
      question: "What is MOTS-c studied for?",
      answer:
        "MOTS-c is a mitochondrial-derived peptide examined in metabolic and exercise-physiology research models. Supplied as Research Use Only."
    },
    {
      question: "COA and purity for MOTS-c?",
      answer:
        "Lots are tested by third-party HPLC-MS. Match the published COA to the vial batch before assays."
    },
    {
      question: "How should MOTS-c be reconstituted?",
      answer:
        "Sterile reconstitution per SOP; document concentration and diluent lot. Not dosing advice."
    },
    {
      question: "Storage requirements?",
      answer: "Lyophilized at -20°C; reconstituted at 4°C with minimal freeze–thaw cycles."
    },
    {
      question: "Shipping?",
      answer: "Cold-chain-aware packaging where required; tracking emailed after dispatch."
    },
    {
      question: "Is MOTS-c for human consumption?",
      answer: "No. Research Use Only."
    }
  ],
  "glow-bpc-157-tb500-ghk-cu": [
    {
      question: "What is the GLOW blend (BPC-157 + TB-500 + GHK-Cu)?",
      answer:
        "GLOW is a multi-component research blend combining tissue-repair and copper-peptide reagents for laboratories studying combination protocols. RUO only — not a therapeutic cocktail."
    },
    {
      question: "How should blend composition be verified?",
      answer:
        "Use the lot COA and labeled component strengths as the source of truth. Record each component identity in the ELN before reconstitution."
    },
    {
      question: "How is GLOW reconstituted?",
      answer:
        "Reconstitute under sterile technique per your multi-peptide SOP. Keep vehicle and concentration controls consistent across study arms."
    },
    {
      question: "Storage for GLOW blend vials?",
      answer:
        "Store lyophilized blend at -20°C. After reconstitution, refrigerate at 4°C and avoid repeated freeze–thaw cycles."
    },
    {
      question: "How is GLOW shipped?",
      answer: "Temperature-controlled packaging where required; discreet shipping; email tracking."
    },
    {
      question: "Is the GLOW blend for human use?",
      answer: "No. Research Use Only for qualified laboratories."
    }
  ],
  "bpc-157-tb500-blend": [
    {
      question: "What is the BPC-157 + TB-500 research blend?",
      answer:
        "A two-component tissue-repair research blend for laboratories evaluating combination peptide protocols. Distinct from single-SKU BPC-157 or TB-500 — document identity carefully."
    },
    {
      question: "How do I read the COA for a blend?",
      answer:
        "Confirm the COA lists the expected components and batch. File analytical data with your material ID before comparative work."
    },
    {
      question: "Reconstitution notes?",
      answer:
        "Sterile technique, SOP-defined diluent, and ELN documentation of concentration targets for each study arm."
    },
    {
      question: "Storage?",
      answer: "Lyophilized at -20°C; reconstituted at 4°C with limited freeze–thaw cycling."
    },
    {
      question: "Shipping?",
      answer: "Cold-chain-aware packaging where required; tracking emailed after labeling."
    },
    {
      question: "Is this blend Research Use Only?",
      answer: "Yes. Not for human or veterinary administration."
    }
  ],
  sermorelin: [
    {
      question: "What is sermorelin used for in research?",
      answer:
        "Sermorelin is a GHRH(1-29) analogue studied in growth-hormone axis research. Tetrava Labs supplies it as an RUO laboratory reagent."
    },
    {
      question: "How is sermorelin purity verified?",
      answer:
        "Independent HPLC-MS testing supports lot identity and purity when a COA is published."
    },
    {
      question: "How should sermorelin be reconstituted?",
      answer:
        "Reconstitute under sterile conditions per SOP. Record diluent and concentration in your ELN."
    },
    {
      question: "Storage conditions?",
      answer: "Lyophilized at -20°C; reconstituted typically at 4°C with minimal freeze–thaw cycles."
    },
    {
      question: "How is sermorelin shipped?",
      answer: "Temperature-controlled packaging where required; email tracking after dispatch."
    },
    {
      question: "Is sermorelin a prescription medicine on this site?",
      answer: "No. This listing is Research Use Only and not a dispensed medication."
    }
  ],
  tesamorelin: [
    {
      question: "What is tesamorelin in a research context?",
      answer:
        "Tesamorelin is a GHRH analogue examined in growth-hormone axis and metabolic research models. Catalogued here as Research Use Only."
    },
    {
      question: "COA documentation for tesamorelin?",
      answer:
        "Third-party HPLC-MS data is published per lot when available. Match batch numbers before locking experimental design."
    },
    {
      question: "Laboratory handling after reconstitution?",
      answer:
        "Sterile preparation, refrigerated storage of working solutions, and limited freeze–thaw cycles per SOP."
    },
    {
      question: "Lyophilized storage?",
      answer: "Keep sealed vials at -20°C."
    },
    {
      question: "Shipping?",
      answer: "Cold-chain-aware packaging where required; tracking emailed when labeled."
    },
    {
      question: "Human use?",
      answer: "Not permitted. Research Use Only."
    }
  ],
  "igf-1-lr3": [
    {
      question: "What is IGF-1 LR3 used for in research?",
      answer:
        "IGF-1 LR3 is a long-arginine-3 insulin-like growth factor analogue studied in cell growth and signaling models. Supplied as RUO material only."
    },
    {
      question: "How is IGF-1 LR3 purity confirmed?",
      answer:
        "Review lot-linked third-party analytical documentation when published and retain it with inventory records."
    },
    {
      question: "Reconstitution guidance?",
      answer:
        "Follow sterile technique and your assay SOP for growth-factor reagents. Document vehicle and concentration carefully."
    },
    {
      question: "Storage?",
      answer:
        "Lyophilized at -20°C; reconstituted stocks typically refrigerated with strict freeze–thaw control."
    },
    {
      question: "Shipping?",
      answer: "Temperature-controlled packaging where required; email tracking after dispatch."
    },
    {
      question: "Is IGF-1 LR3 for human use?",
      answer: "No. Research Use Only for qualified laboratories."
    }
  ],
  kpv: [
    {
      question: "What is KPV studied for in research?",
      answer:
        "KPV is an alpha-MSH-derived tripeptide examined in inflammation and barrier-model research. Tetrava Labs lists it as Research Use Only."
    },
    {
      question: "Purity and COA for KPV?",
      answer:
        "Lots are supported by independent HPLC-MS analysis. Cross-check the COA batch with the vial."
    },
    {
      question: "How should KPV be reconstituted?",
      answer:
        "Sterile reconstitution per SOP; ELN documentation of concentration and diluent. Not dosing advice."
    },
    {
      question: "Storage conditions?",
      answer: "Lyophilized at -20°C; reconstituted at 4°C with minimal freeze–thaw cycles."
    },
    {
      question: "Shipping?",
      answer: "Cold-chain-aware packaging where required; tracking emailed after labeling."
    },
    {
      question: "Is KPV Research Use Only?",
      answer: "Yes."
    }
  ],
  "thymosin-alpha-1": [
    {
      question: "What is Thymosin Alpha-1 in research catalogs?",
      answer:
        "Thymosin Alpha-1 is a thymic peptide studied in immune-modulation research models. Offered here strictly as an RUO reagent."
    },
    {
      question: "How is Thymosin Alpha-1 documented?",
      answer:
        "Lot COAs with HPLC-MS summaries are published when available. File them with your material ID."
    },
    {
      question: "Reconstitution and handling?",
      answer:
        "Prepare under sterile technique per SOP. Record operator, diluent, and concentration in the ELN."
    },
    {
      question: "Storage?",
      answer: "Lyophilized at -20°C; reconstituted typically at 4°C with limited freeze–thaw cycling."
    },
    {
      question: "Shipping?",
      answer: "Temperature-controlled packaging where required; email tracking."
    },
    {
      question: "Human therapeutic use?",
      answer: "Not allowed. Research Use Only."
    }
  ],
  "5-amino-1mq": [
    {
      question: "What is 5-Amino-1MQ studied for?",
      answer:
        "5-Amino-1MQ is a small-molecule NNMT-pathway research tool used in metabolic laboratory models. Catalogued as Research Use Only."
    },
    {
      question: "How is 5-Amino-1MQ purity verified?",
      answer:
        "Independent analytical testing supports lot identity and purity when a COA is published."
    },
    {
      question: "How should 5-Amino-1MQ be prepared?",
      answer:
        "Follow your SOP for small-molecule research reagents (solvent choice, sterile filtration if required, and ELN documentation). Not human-use guidance."
    },
    {
      question: "Storage?",
      answer:
        "Store per the product specifications — typically cold, dry, and sealed. Protect from unnecessary moisture."
    },
    {
      question: "Shipping?",
      answer: "Shipped with appropriate packaging; tracking emailed after dispatch."
    },
    {
      question: "Is 5-Amino-1MQ for human consumption?",
      answer: "No. Research Use Only."
    }
  ],
  "ss-31": [
    {
      question: "What is SS-31 (Elamipretide) in research?",
      answer:
        "SS-31 is a mitochondria-targeting peptide studied in bioenergetics and oxidative-stress models. Tetrava Labs supplies it as RUO material."
    },
    {
      question: "COA expectations for SS-31?",
      answer:
        "Third-party HPLC-MS documentation is published per lot when available. Match batch identity before assays."
    },
    {
      question: "Reconstitution guidance?",
      answer:
        "Sterile technique and SOP-defined diluent; record concentration in the ELN. Not clinical dosing advice."
    },
    {
      question: "Storage?",
      answer: "Lyophilized at -20°C; reconstituted at 4°C with minimal freeze–thaw cycles."
    },
    {
      question: "Shipping?",
      answer: "Cold-chain-aware packaging where required; tracking emailed after labeling."
    },
    {
      question: "Is SS-31 Research Use Only?",
      answer: "Yes. Not for human or veterinary administration."
    }
  ]
}

/** Curated FAQs if present; otherwise unique auto FAQs from catalog context. */
export function getProductFaqs(
  parentHandle: string,
  context?: Omit<ProductFaqContext, "parentHandle">
): FaqItem[] {
  const raw = parentHandle.trim().toLowerCase()
  const key = getCompoundParentHandle(raw) || raw
  const curated = productFaqsByHandle[key]
  if (curated?.length) return curated

  const auto = buildAutoProductFaqs({
    parentHandle: key,
    productName: context?.productName,
    category: context?.category,
    appearance: context?.appearance
  })
  return auto.length ? auto : productFaqItems
}
