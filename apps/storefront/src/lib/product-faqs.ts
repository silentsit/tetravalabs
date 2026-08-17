import { type FaqItem, productFaqItems } from "@/lib/faq-content";
import { getCompoundParentHandle } from "@/lib/compound-product";
import {
  buildAutoProductFaqs,
  type ProductFaqContext,
} from "@/lib/product-faq-auto";

/**
 * Hand-curated PDP FAQs: featured top sellers + next sales tier.
 * Other catalog products use buildAutoProductFaqs() (still unique per product).
 */
export const productFaqsByHandle: Record<string, FaqItem[]> = {
  "bpc-157": [
    {
      question: "What is BPC-157 used for in laboratory research?",
      answer:
        "BPC-157 is a synthetic gastric pentadecapeptide studied in tissue repair, angiogenesis, and musculoskeletal research models. Tetrava Labs supplies it as a Research Use Only (RUO) reagent with lot-linked documentation. It's not for human or veterinary use.",
    },
    {
      question: "Where can you buy BPC-157 / buy BPC-157 peptide online?",
      answer:
        "You can buy BPC-157 peptide online from Tetrava Labs. The BPC-157 peptides for sale on this page ship to qualified researchers with lot-linked COA documentation and cold-chain-aware fulfillment. When you're deciding where to buy BPC-157 peptide, the best place to buy BPC-157 publishes third-party HPLC-MS purity for the exact batch you receive, not just a generic catalog claim.",
    },
    {
      question: "Where can I get BPC-157 near me?",
      answer:
        'RUO research peptides like BPC-157 aren\'t stocked at local pharmacies or walk-in clinics, so a "BPC-157 near me" search usually won\'t turn up a retail counter. Tetrava Labs ships BPC-157 peptides for sale directly to qualified laboratories nationwide. Order online on this page for documented research supply instead of a local store pickup.',
    },
    {
      question: "What purity and COA documentation come with BPC-157?",
      answer:
        "Each lot gets verified by independent third-party HPLC-MS analysis. The purity percentage shown on this page is confirmed on the Certificate of Analysis when one is published for that batch. Match the COA batch number to the vial before you start comparative work.",
    },
    {
      question: "Does oral BPC-157 work?",
      answer:
        "In published research, most angiogenesis, tendon-repair, and myotendinous-junction findings used intraperitoneal or local injection routes in animal models. That injectable dataset is bigger than the oral one. Oral BPC-157 has been evaluated in a subset of gastrointestinal-protection models, but there's no validated human oral-bioavailability data, and results shouldn't be read as clinical proof. This is laboratory research context only, not human-use guidance.",
    },
    {
      question: "Can BPC-157 be taken orally?",
      answer:
        "BPC-157 is gastric-juice-derived and often described as relatively acid- and enzyme-stable in preclinical GI literature, so some animal studies do use oral administration. Labs asking whether BPC-157 can be taken orally should treat the oral route as its own experimental variable (stability, vehicle, pharmacokinetics), not a drop-in substitute for injectable protocols. Tetrava Labs supplies RUO research material only. It's not for human or veterinary consumption.",
    },
    {
      question: "How does BPC-157 compare to TB-500?",
      answer:
        "BPC-157 is one defined 15-amino-acid sequence. Material sold as TB-500 is different: mass-spectrometry analysis identified it as a short fragment of thymosin beta-4 (Ac-LKKTETQ, about 888 daltons), not the full 4,963-dalton protein the name suggests. Both compounds are Research Use Only, and both sit on the FDA's 2023 Category 2 significant-safety-risk list. See the BPC-157 vs TB-500 comparison in our research library for the full breakdown.",
    },
    {
      question: "What is the difference between BPC-157 oral and injection routes?",
      answer:
        "The two routes serve different research purposes. Oral or intragastric dosing fits BPC-157's original gastrointestinal research context, since it reaches the luminal mucosa directly. Injection (IP, SC, or IM) is the default in receptor- and growth-factor-signaling studies, because it bypasses the GI tract and delivers a known, controlled dose. Tetrava Labs supplies BPC-157 as an injectable vial and as oral capsules, so the route can match your protocol.",
    },
    {
      question: "How should lyophilized BPC-157 be reconstituted in the lab?",
      answer:
        "Reconstitute under sterile technique with a protocol-appropriate diluent, commonly bacteriostatic water or another vehicle your SOP specifies. Avoid vigorous foaming, record the diluent lot and final concentration in your ELN, and follow your institution's chemical-handling rules. This is laboratory preparation guidance only, not dosing advice.",
    },
    {
      question: "How should I store BPC-157 before and after reconstitution?",
      answer:
        "Store the lyophilized powder at -20°C for long-term stability. Once you reconstitute it, store at 4°C, minimize freeze-thaw cycles, and use it within the window your laboratory protocol defines.",
    },
    {
      question: "How is BPC-157 shipped?",
      answer:
        "Lyophilized BPC-157 ships in temperature-controlled packaging, with cold packs where required. Packages are discreet. Tracking gets emailed once the carrier label is generated. See the Shipping page for regional delivery windows.",
    },
    {
      question: "Is BPC-157 Research Use Only?",
      answer:
        "Yes. Every Tetrava Labs BPC-157 vial is designated Research Use Only. It isn't approved for human consumption, diagnostic use, or therapeutic use. Buyers need to be qualified research professionals.",
    },
    {
      question: "Does Tetrava Labs sell other research peptides besides BPC-157?",
      answer:
        "Yes. The Tetrava Labs catalog includes TB-500 for tissue-repair research and Sermorelin for growth-hormone-secretagogue research, alongside BPC-157. Every product ships with its own lot-linked COA, so you can verify identity and purity batch by batch.",
    },
  ],
  semaglutide: [
    {
      question: "What is semaglutide studied for in research settings?",
      answer:
        "Semaglutide is a GLP-1 receptor agonist analog used in metabolic, receptor-binding, and signaling research models. Tetrava Labs offers it strictly as an RUO laboratory reagent with identity and purity controls — not as a medication or consumer product.",
    },
    {
      question: "How do I verify semaglutide purity and identity?",
      answer:
        "Lots are tested by independent third-party HPLC-MS. Review the lot-linked Certificate of Analysis for purity percentage, molecular-weight confirmation, and chromatographic data when published, and file it with your material ID.",
    },
    {
      question: "What strengths of research semaglutide are available?",
      answer:
        "Strength options and pack sizes are listed on this product page. Choose the configuration that matches your assay cadence and retention policy so inventory planning stays consistent across study arms.",
    },
    {
      question: "How should research semaglutide be stored?",
      answer:
        "Keep lyophilized material at -20°C. After reconstitution per your SOP, store working solutions at 4°C, protect from unnecessary light exposure if your protocol requires it, and avoid repeated freeze–thaw cycles.",
    },
    {
      question: "How is semaglutide shipped for laboratory orders?",
      answer:
        "Orders ship in cold-chain-aware packaging appropriate for lyophilized peptides. Tracking is emailed after dispatch. Delivery windows and rates are summarized on the Shipping page.",
    },
    {
      question: "Can semaglutide from Tetrava Labs be used in humans?",
      answer:
        "No. This catalog item is Research Use Only and is not intended for human or veterinary administration, compounding for clinical use, or diagnostic applications.",
    },
  ],
  tirzepatide: [
    {
      question: "What is tirzepatide used for in laboratory research?",
      answer:
        "Tirzepatide is a dual GIP/GLP-1 receptor agonist analog studied in metabolic and receptor pharmacology models. Tetrava Labs supplies research-grade material for qualified laboratories under RUO designation only.",
    },
    {
      question: "Does tirzepatide include a Certificate of Analysis?",
      answer:
        "When a batch COA is published, it documents third-party HPLC-MS purity and identity data for that lot. Cross-check the batch number on the vial against the COA before locking experimental design.",
    },
    {
      question:
        "How does tirzepatide differ from semaglutide in research catalogs?",
      answer:
        "Semaglutide is typically framed as a GLP-1 pathway research tool; tirzepatide is framed as a dual GIP/GLP-1 pathway tool. Both are RUO reagents here — selection should follow your assay targets and institutional protocol, not therapeutic intent.",
    },
    {
      question: "How should tirzepatide be reconstituted and handled?",
      answer:
        "Use sterile technique and a diluent specified by your laboratory SOP. Record concentration, operator, and timestamp in your ELN. Handle as a research chemical under institutional PPE and waste rules — not as a clinical preparation.",
    },
    {
      question: "What are the storage requirements for tirzepatide?",
      answer:
        "Store lyophilized powder at -20°C. Reconstituted stocks are typically held at 4°C with minimal freeze–thaw cycling, per your validated method.",
    },
    {
      question: "How is tirzepatide shipped?",
      answer:
        "Lyophilized vials ship with temperature-controlled packaging where required. Tracking is provided by email after the label is generated. See Shipping for international windows and customs notes.",
    },
  ],
  retatrutide: [
    {
      question: "What is retatrutide?",
      answer:
        "Retatrutide is a synthetic peptide that activates three receptors at once, GLP-1, GIP, and glucagon, developed by Eli Lilly under the code LY3437943. It's the furthest-along \"triple agonist\" peptide in clinical testing, still investigational and not FDA-approved. Tetrava Labs supplies retatrutide as a Research Use Only laboratory reagent, not the drug being tested in clinical trials.",
    },
    {
      question: "What does retatrutide do?",
      answer:
        "It binds GLP-1, GIP, and glucagon receptors in the same molecule. Labs study that combination for insulin secretion, gastric emptying, hepatic fat oxidation, and energy expenditure. Tetrava Labs does not sell it as a treatment.",
    },
    {
      question: "Is retatrutide FDA approved?",
      answer:
        "No. Retatrutide has no FDA approval and no brand name. In July 2026 Lilly said it plans to submit a Biologics License Application in the first quarter of 2027; a planned filing is not an approval. Tetrava Labs' listing is a Research Use Only laboratory reagent.",
    },
    {
      question: "Is retatrutide safe?",
      answer:
        "No FDA safety finding exists, because there is no FDA approval. Trial reports describe mostly mild-to-moderate gastrointestinal events (nausea, diarrhea, vomiting, constipation), often during dose escalation, plus a heart-rate rise that later declined. Those results come from supervised protocols, not from Tetrava Labs' RUO listing.",
    },
    {
      question: "Are mild headaches a known side effect of taking retatrutide?",
      answer:
        "Headache was recorded in the 2023 Phase 2 NEJM trial's less-common events table: 0% on placebo, 11.4% in one 8 mg arm, 6.5% in the 12 mg arm, and 3.3% of participants overall. It was not among the main side effects in that paper, which were gastrointestinal. Those rates are not a safety claim about Tetrava's research reagent.",
    },
    {
      question: "What is retatrutide peptide used for in research?",
      answer:
        "Labs use retatrutide peptide to study triple-receptor incretin signaling, hepatic lipid metabolism, and comparative pharmacology against dual agonists like tirzepatide or single-receptor agonists like semaglutide. Every Tetrava Labs order ships with lot-linked COA documentation. It's not for human or veterinary use.",
    },
    {
      question: "Retatrutide vs tirzepatide: how do they compare?",
      answer:
        "Tirzepatide vs retatrutide comes down to a shared GLP-1/GIP base plus one extra target: retatrutide adds glucagon-receptor activity, tirzepatide doesn't. No trial has run the two head-to-head. Across separate Phase 3 trials, retatrutide's 12 mg arm posted larger mean weight loss (28.3% at 80 weeks) than tirzepatide's highest dose (roughly 22.5% at 72 weeks), but different trials and populations make that a suggestive comparison, not a controlled one. Tirzepatide is FDA-approved (Mounjaro, Zepbound); retatrutide is not approved anywhere.",
    },
    {
      question: "Retatrutide vs semaglutide (Ozempic): what's the difference?",
      answer:
        "Retatrutide vs Ozempic is a triple-agonist-versus-single-agonist comparison. Semaglutide (Ozempic, Wegovy) activates only the GLP-1 receptor; retatrutide adds GIP and glucagon. Semaglutide's Phase 3 program reported up to roughly 14.9% weight loss at 68 weeks, versus 28.3% for retatrutide's 12 mg dose in a separate trial. Semaglutide carries FDA approval and years of prescribing data; retatrutide has neither yet.",
    },
    {
      question: "Where to buy retatrutide, and how do I get it?",
      answer:
        "There is no legal retail or pharmacy channel for human use. The sanctioned treatment path is Lilly's TRIUMPH trials (ClinicalTrials.gov NCT05929066 and NCT05931367). Tetrava Labs sells retatrutide as an RUO laboratory reagent for qualified researchers, not as a personal-use vial.",
    },
    {
      question: "What does retatrutide cost, and is there a price per month?",
      answer:
        "There's no official \"price per month\" for retatrutide, because it isn't a prescription product with a pharmacy price yet. The catalog price shown in the purchase panel on this page reflects the RUO research reagent, per vial, for laboratory use, not a recurring treatment cost.",
    },
    {
      question: "Can I sign up for a retatrutide clinical trial?",
      answer:
        "The only sanctioned way to receive retatrutide as a treatment is through one of Eli Lilly's active TRIUMPH trials. ClinicalTrials.gov lists current enrollment status and eligibility criteria under identifiers including NCT05929066 (TRIUMPH-1) and NCT05931367 (TRIUMPH-4); search those numbers directly on ClinicalTrials.gov for up-to-date openings.",
    },
    {
      question: "What does retatrutide Reddit discussion usually cover?",
      answer:
        "Retatrutide threads split into two camps: people tracking TRIUMPH trial data and cross-posting Lilly's press releases, and people discussing personal sourcing and vendor pricing for unregulated retatrutide, which this page doesn't cover or endorse. Dosing, side-effect, and long-term-effects claims on Reddit mix real trial numbers with unverified self-reports; check whether a claim traces back to a named trial before treating it as fact.",
    },
    {
      question: "How to reconstitute retatrutide, and how much bacteriostatic water for 10 mg?",
      answer:
        "This page does not publish a milliliter-per-vial reconstitution recipe, including for a 10 mg vial. Diluent volume belongs in your laboratory SOP for the assay. Store lyophilized vials at -20°C, reconstitute under sterile technique with a protocol-appropriate diluent, and log lot, date, concentration, and operator against the batch COA. Bacteriostatic water is sold separately as a research solvent, not paired to any retatrutide strength at a fixed volume.",
    },
    {
      question: "What should I check before buying retatrutide from any vendor?",
      answer:
        "Before treating any seller, including Tetrava Labs, as a qualified research supplier: does the listing give a lot/batch number matching the shipped Certificate of Analysis, is that COA from an independent third-party lab reporting HPLC purity, does it confirm identity rather than just a purity percentage, and does the listing describe a laboratory reagent rather than market dosing charts and monthly pricing for human use? Skip any vendor that won't produce a lot-specific COA on request.",
    },
    {
      question: "How is retatrutide purity and identity verified?",
      answer:
        "Each lot is checked by independent third-party HPLC-MS analysis reporting both purity and identity. Match the COA batch number in the COA library to the vial you actually received before starting comparative research work.",
    },
  ],
  "ghk-cu": [
    {
      question: "What is GHK-Cu studied for in research?",
      answer:
        "GHK-Cu (copper tripeptide-1 complex) is examined in skin biology, wound-model, and extracellular-matrix research. Tetrava Labs supplies it as an RUO laboratory reagent with documented purity controls.",
    },
    {
      question: "What purity documentation is provided for GHK-Cu?",
      answer:
        "Batches are analyzed by independent third-party HPLC-MS. When a Certificate of Analysis is published, it lists purity and identity data for that lot — file it with your internal material ID.",
    },
    {
      question: "What GHK-Cu strengths are available?",
      answer:
        "Strength options (for example 50mg / 100mg families where listed) and pack tiers are shown on this page. Choose based on assay volume planning, not ad-hoc mid-study restocking.",
    },
    {
      question: "How should GHK-Cu be stored?",
      answer:
        "Store lyophilized powder at -20°C. After reconstitution per your protocol, hold at 4°C, minimize freeze–thaw cycles, and dispose of unused solution under institutional chemical-waste rules.",
    },
    {
      question: "How is GHK-Cu shipped?",
      answer:
        "Orders ship in temperature-controlled packaging appropriate for lyophilized peptides, with email tracking after dispatch. See the Shipping page for delivery windows by region.",
    },
    {
      question: "Is GHK-Cu from this store for cosmetic or clinical use?",
      answer:
        "No. Catalog GHK-Cu is Research Use Only for qualified laboratory professionals and is not intended for cosmetic, diagnostic, or therapeutic applications.",
    },
  ],
  ipamorelin: [
    {
      question: "What is ipamorelin used for in laboratory research?",
      answer:
        "Ipamorelin is a selective growth hormone secretagogue peptide studied in receptor and endocrine research models. Tetrava Labs provides it strictly as RUO material for qualified labs.",
    },
    {
      question: "How do I confirm ipamorelin identity and purity?",
      answer:
        "Third-party HPLC-MS testing supports lot identity and purity. Review the published COA for the batch you receive and reconcile it against the vial label before comparative assays.",
    },
    {
      question:
        "How should ipamorelin be reconstituted for research protocols?",
      answer:
        "Reconstitute under sterile conditions with the diluent specified in your SOP. Document concentration, diluent lot, and operator in your ELN. This is laboratory preparation guidance only — not a clinical dosing protocol.",
    },
    {
      question: "What are the storage conditions for ipamorelin?",
      answer:
        "Keep lyophilized vials at -20°C. Reconstituted solutions are typically stored at 4°C with limited freeze–thaw cycles according to your method validation.",
    },
    {
      question: "How is ipamorelin shipped?",
      answer:
        "Lyophilized ipamorelin ships with cold packs where required and discreet packaging. Tracking is emailed when the carrier label is created.",
    },
    {
      question: "Can I buy ipamorelin for personal use?",
      answer:
        "No. Sales are limited to Research Use Only procurement for qualified research professionals. The product is not for human consumption or veterinary use.",
    },
  ],
  tb500: [
    {
      question: "What is TB-500 in research catalogs?",
      answer:
        "TB-500 refers to a synthetic thymosin β4 fragment used in tissue-repair and cell-migration research models. Tetrava Labs lists it as Research Use Only with lot-linked analytical documentation when published.",
    },
    {
      question: "How does TB-500 differ from BPC-157 for lab procurement?",
      answer:
        "Both appear in tissue-repair research categories, but they are distinct sequences with different molecular identities. Select based on your assay design and documented CAS/sequence fields — not interchangeable substitutes without a bridging study.",
    },
    {
      question: "What COA data should I expect for TB-500?",
      answer:
        "Independent HPLC-MS analysis supports purity and identity. When a COA is published for your batch, retain HPLC summaries and batch numbers with your ELN records.",
    },
    {
      question: "How should TB-500 be reconstituted and stored?",
      answer:
        "Reconstitute lyophilized powder under sterile technique per your SOP. Store dry material at -20°C; keep reconstituted stocks at 4°C and avoid repeated freeze–thaw cycles.",
    },
    {
      question: "How is TB-500 shipped?",
      answer:
        "Shipments use temperature-controlled packaging where appropriate for lyophilized peptides. Tracking is emailed after dispatch; see Shipping for regional timelines.",
    },
    {
      question: "Is TB-500 approved for human use?",
      answer:
        "No. Tetrava Labs TB-500 is designated Research Use Only and must not be used for human or veterinary administration.",
    },
  ],
  "hgh-191aa": [
    {
      question: "What is HGH 191aa as a research reagent?",
      answer:
        "HGH 191aa refers to recombinant human growth hormone (somatropin) sequence material used in receptor, signaling, and analytical research contexts. Tetrava Labs supplies it under Research Use Only terms for qualified laboratories.",
    },
    {
      question: "How is HGH 191aa purity verified?",
      answer:
        "Lots are evaluated with independent third-party analytical methods appropriate to the catalog item. Review the lot-linked Certificate of Analysis when published for purity and identity confirmation.",
    },
    {
      question: "What IU strengths are available for research HGH 191aa?",
      answer:
        "Available IU strengths and pack options are listed in the purchase panel. Match strength selection to your assay design and inventory controls rather than informal unit conversion mid-study.",
    },
    {
      question: "How should HGH 191aa be stored?",
      answer:
        "Follow the storage guidance on this page and your institutional SOP. Lyophilized material is typically held cold for stability; reconstituted solutions require controlled refrigerated storage and limited freeze–thaw cycling.",
    },
    {
      question: "How is HGH 191aa shipped?",
      answer:
        "Orders ship with temperature-controlled packaging where required. Tracking is emailed when the shipment is labeled. International delivery windows are outlined on the Shipping page.",
    },
    {
      question:
        "Is research HGH 191aa the same as a pharmacy prescription product?",
      answer:
        "No. This listing is a Research Use Only catalog item for laboratory use. It is not a dispensed medication and is not intended for human therapeutic administration.",
    },
  ],

  // --- Next sales tier (curated) ---
  "aod-9604": [
    {
      question: "What is AOD-9604 studied for in research?",
      answer:
        "AOD-9604 is a modified fragment related to the C-terminal region of growth hormone, examined in metabolic and adipose-biology research models. Tetrava Labs supplies it as Research Use Only material for qualified laboratories.",
    },
    {
      question: "Does AOD-9604 include third-party purity testing?",
      answer:
        "Lots are verified by independent HPLC-MS analysis. Review the lot-linked Certificate of Analysis when published and reconcile batch numbers before comparative assays.",
    },
    {
      question: "How should AOD-9604 be reconstituted?",
      answer:
        "Reconstitute lyophilized powder under sterile technique with a diluent specified by your SOP. Document concentration and operator in your ELN. Laboratory preparation only — not dosing guidance.",
    },
    {
      question: "How should AOD-9604 be stored?",
      answer:
        "Store lyophilized vials at -20°C. After reconstitution, hold at 4°C with minimal freeze–thaw cycling per your validated method.",
    },
    {
      question: "How is AOD-9604 shipped?",
      answer:
        "Orders ship in cold-chain-aware packaging where required. Tracking is emailed after dispatch. See Shipping for regional windows.",
    },
    {
      question: "Is AOD-9604 for human use?",
      answer:
        "No. Catalog AOD-9604 is Research Use Only and must not be used for human or veterinary administration.",
    },
  ],
  "cjc-1295-without-dac": [
    {
      question: "What is CJC-1295 without DAC used for in research?",
      answer:
        "CJC-1295 without DAC (Mod GRF 1-29 analogues) is studied in growth-hormone axis and GHRH-receptor research models. Tetrava Labs lists it strictly as an RUO laboratory reagent.",
    },
    {
      question: "How does “without DAC” matter for lab procurement?",
      answer:
        "Without-DAC and with-DAC catalog families are distinct identities with different pharmacokinetic research framing. Select the handle that matches your protocol — do not treat them as interchangeable without a bridging study.",
    },
    {
      question: "What COA data should I expect for CJC-1295 without DAC?",
      answer:
        "Independent HPLC-MS supports purity and identity. File the published COA with your material ID and confirm the strength on the vial label.",
    },
    {
      question: "How should CJC-1295 without DAC be stored?",
      answer:
        "Keep lyophilized powder at -20°C. Reconstituted stocks are typically stored at 4°C with limited freeze–thaw cycles.",
    },
    {
      question: "How is CJC-1295 without DAC shipped?",
      answer:
        "Lyophilized vials ship with temperature-controlled packaging where required. Tracking is emailed when the shipment is labeled.",
    },
    {
      question: "Is CJC-1295 without DAC Research Use Only?",
      answer:
        "Yes. It is not approved for human consumption, compounding for clinical use, or veterinary administration.",
    },
  ],
  "cjc-1295-with-dac": [
    {
      question: "What is CJC-1295 with DAC in a research catalog?",
      answer:
        "CJC-1295 with DAC is a GHRH-analogue research reagent framed for longer-exposure growth-hormone axis models. Tetrava Labs supplies it under Research Use Only terms.",
    },
    {
      question: "How is CJC-1295 with DAC purity verified?",
      answer:
        "Third-party HPLC-MS testing supports lot identity and purity. Retain the COA with working stocks when published.",
    },
    {
      question: "How should CJC-1295 with DAC be reconstituted?",
      answer:
        "Use sterile technique and a protocol-appropriate diluent. Record preparation details in your ELN. Not a clinical dosing protocol.",
    },
    {
      question: "What are the storage conditions?",
      answer:
        "Lyophilized: -20°C. Reconstituted: typically 4°C with minimal freeze–thaw cycling per SOP.",
    },
    {
      question: "How is it shipped?",
      answer:
        "Cold-chain-aware packaging where required; discreet parcels; email tracking after labeling.",
    },
    {
      question: "Can CJC-1295 with DAC be used in humans?",
      answer:
        "No. This catalog item is Research Use Only for qualified laboratory professionals.",
    },
  ],
  cagrilintide: [
    {
      question: "What is cagrilintide studied for in research settings?",
      answer:
        "Cagrilintide is an amylin-analogue research peptide examined in metabolic and appetite-pathway models. Tetrava Labs offers it as RUO material only.",
    },
    {
      question: "How do I verify cagrilintide identity?",
      answer:
        "Review third-party HPLC-MS data on the lot COA when published, and match batch numbers to the sealed vial.",
    },
    {
      question: "Which strengths are available?",
      answer:
        "Strength and pack options appear in the purchase panel. Choose the configuration that matches assay cadence and retention policy.",
    },
    {
      question: "How should cagrilintide be stored?",
      answer:
        "Store lyophilized powder at -20°C; reconstituted solutions at 4°C with limited freeze–thaw cycles.",
    },
    {
      question: "How is cagrilintide shipped?",
      answer:
        "Temperature-controlled packaging where required, with tracking emailed after dispatch.",
    },
    {
      question: "Is cagrilintide approved for human use?",
      answer: "No. It is designated Research Use Only.",
    },
  ],
  "cagrilintide-semaglutide": [
    {
      question: "What is the cagrilintide + semaglutide blend for research?",
      answer:
        "This catalog blend combines amylin- and GLP-1-pathway research reagents for laboratories running multi-agonist metabolic designs. RUO only — not a clinical combination product.",
    },
    {
      question: "How should blend identity be documented?",
      answer:
        "Treat the blend COA and labeled composition as part of the experimental record. Confirm each component’s strength fields against your protocol before reconstitution.",
    },
    {
      question: "How is the blend reconstituted?",
      answer:
        "Follow sterile technique and your SOP for multi-component lyophilized reagents. Record diluent, concentration targets, and lot IDs in the ELN.",
    },
    {
      question: "Storage guidance?",
      answer:
        "Lyophilized blend vials: -20°C. After reconstitution, refrigerate at 4°C and minimize freeze–thaw cycles.",
    },
    {
      question: "Shipping?",
      answer:
        "Cold-chain-aware packaging where required; tracking emailed when labeled.",
    },
    {
      question: "Is this blend for human consumption?",
      answer: "No. Research Use Only for qualified laboratories.",
    },
  ],
  mazdutide: [
    {
      question: "What is mazdutide peptide?",
      answer:
        "Mazdutide is a synthetic peptide that activates both the GLP-1 receptor and the glucagon receptor, modeled on the gut hormone oxyntomodulin. It's also known by its development codes IBI362 and LY3305677, and by the brand name Xinermei in China, where it's an approved drug. Tetrava Labs supplies mazdutide as a Research Use Only laboratory reagent, not the approved drug product.",
    },
    {
      question: "What is mazdutide peptide used for in research?",
      answer:
        "Labs use mazdutide peptide to study dual GLP-1/glucagon receptor signaling, hepatic fat-oxidation pathways, and comparative incretin research against single-receptor agonists like semaglutide, or other dual and triple agonists like tirzepatide and retatrutide. Tetrava Labs supplies it with lot-linked documentation for qualified laboratory professionals. It's not for human or veterinary use.",
    },
    {
      question: "How does mazdutide compare to tirzepatide?",
      answer:
        "Mazdutide vs tirzepatide comes down to the second receptor each one pairs with GLP-1. Mazdutide adds glucagon receptor activity, which drives hepatic fat oxidation and energy expenditure. Tirzepatide adds GIP receptor activity, which improves insulin sensitivity. No trial has tested the two head-to-head; cross-trial data show comparable glycemic effects and a larger pooled weight-loss effect for tirzepatide.",
    },
    {
      question: "Is mazdutide better than tirzepatide?",
      answer:
        "No published trial has put mazdutide against tirzepatide directly, so \"better\" isn't something the current evidence can answer. Across separate trials and cross-trial meta-analyses, tirzepatide's pooled weight-loss effect has come out larger, while mazdutide has posted the only head-to-head win against semaglutide, a single-receptor GLP-1 drug, reported so far. They're not interchangeable research subjects.",
    },
    {
      question: "How does mazdutide compare to retatrutide?",
      answer:
        "Mazdutide vs retatrutide is a dual-agonist-versus-triple-agonist comparison. Both activate GLP-1 and glucagon receptors; retatrutide adds a third target, GIP. In a 2025 network meta-analysis, retatrutide's pooled weight-loss effect was more than double mazdutide's. Retatrutide remains investigational everywhere, while mazdutide holds two regulatory approvals in China.",
    },
    {
      question: "What benefits has mazdutide peptide research reported?",
      answer:
        "In completed Phase 3 trials, mazdutide has been associated with weight reductions of roughly 15% to 18.5% at higher doses over 48 to 60 weeks, plus improvements in blood pressure, lipids, and serum uric acid. A company-reported head-to-head trial found mazdutide outperformed semaglutide on combined glycemic-and-weight-loss response. These are clinical trial findings in human subjects. They are not claims about Tetrava's research reagent, which is sold strictly for laboratory use.",
    },
    {
      question: "What does mazdutide Reddit discussion usually look like?",
      answer:
        "Because mazdutide's retail availability is limited to China, most English-language Reddit threads about it are analytical: people tracking trial data, comparing it to tirzepatide and retatrutide, or asking about its glucagon-driven mechanism, rather than posting personal-use reports. Treat any anecdotal thread as a lead to verify, not as evidence.",
    },
    {
      question: "Where can you buy mazdutide for qualified research?",
      answer:
        "You can buy mazdutide peptide online from Tetrava Labs. Every order ships to qualified researchers with lot-linked COA documentation confirming identity and HPLC purity for the exact batch received, not a generic catalog claim.",
    },
    {
      question: "Is mazdutide Research Use Only, or is it an approved drug?",
      answer:
        "Both, depending on which product you mean. Mazdutide (brand name Xinermei) is an NMPA-approved drug in China for weight management and type 2 diabetes. It is not FDA-approved. Tetrava Labs' mazdutide listing is a separate, Research Use Only laboratory reagent. It isn't dispensed, prescribed, or described as a medication.",
    },
    {
      question: "How should mazdutide be reconstituted and stored?",
      answer:
        "Store lyophilized vials at -20°C and skip repeated freeze-thaw cycles. Reconstitute under sterile technique with a protocol-appropriate diluent right before use, then log diluent lot, reconstitution date, and operator in your ELN alongside the batch COA.",
    },
    {
      question: "How is mazdutide purity and identity verified?",
      answer:
        "Each lot is checked by independent third-party HPLC-MS analysis reporting both purity and identity. Match the COA batch number in the COA library to the vial you actually received before starting comparative research work.",
    },
  ],
  nad: [
    {
      question: "What is NAD+ used for in research catalogs?",
      answer:
        "NAD+ (nicotinamide adenine dinucleotide) research reagents are used in metabolic, redox, and cellular-energy pathway studies. Tetrava Labs lists NAD under Research Use Only.",
    },
    {
      question: "How do I confirm NAD lot quality?",
      answer:
        "Review the published Certificate of Analysis for the batch you receive and retain it with inventory records.",
    },
    {
      question: "Which NAD strengths are available?",
      answer:
        "Strength options are shown on this product page. Select based on assay design and institutional inventory controls.",
    },
    {
      question: "How should research NAD be stored?",
      answer:
        "Follow the storage guidance on this page. Protect lyophilized or liquid forms from unnecessary temperature excursions and light if your SOP requires it.",
    },
    {
      question: "How is NAD shipped?",
      answer:
        "Cold-chain-aware packaging where required; tracking emailed after labeling.",
    },
    {
      question: "Is catalog NAD a supplement for personal use?",
      answer: "No. This is a Research Use Only laboratory reagent.",
    },
  ],
  "bacteriostatic-water": [
    {
      question: "What is bacteriostatic water used for in the lab?",
      answer:
        "Bacteriostatic water is a research solvent commonly used to reconstitute lyophilized peptides under sterile laboratory protocols. RUO catalog item — not a medical product.",
    },
    {
      question: "Does bacteriostatic water have a COA?",
      answer:
        "When a lot document is published, it appears in the COA library and on the product page. Match batch identity to the bottle you received.",
    },
    {
      question: "How should bacteriostatic water be stored?",
      answer:
        "Store sealed per the product specifications, typically at controlled room temperature or as stated on the label/SOP. Record open dates when required.",
    },
    {
      question: "Can I use bacteriostatic water for injections in humans?",
      answer:
        "No. Tetrava Labs bacteriostatic water is sold for laboratory research use only.",
    },
    {
      question: "How is bacteriostatic water shipped?",
      answer:
        "Shipped with appropriate packaging for liquid lab supplies. Tracking is emailed after dispatch.",
    },
    {
      question: "Which volumes are available?",
      answer:
        "Available fill volumes are listed in the purchase options on this page.",
    },
  ],
  selank: [
    {
      question: "What is Selank studied for in research?",
      answer:
        "Selank is a synthetic tuftsin-analogue peptide examined in neuropeptide and stress-pathway research models. Supplied by Tetrava Labs as Research Use Only.",
    },
    {
      question: "How is Selank purity documented?",
      answer:
        "Third-party HPLC-MS supports lot purity and identity. Cross-check the COA batch with the vial label.",
    },
    {
      question: "How should Selank be reconstituted?",
      answer:
        "Reconstitute lyophilized material under sterile technique per your SOP. Document diluent and concentration in the ELN. Not clinical dosing advice.",
    },
    {
      question: "Storage conditions for Selank?",
      answer:
        "Lyophilized: -20°C. Reconstituted: typically 4°C with minimal freeze–thaw cycles.",
    },
    {
      question: "How is Selank shipped?",
      answer:
        "Temperature-controlled packaging where required; discreet parcels; email tracking.",
    },
    {
      question: "Is Selank for human use?",
      answer: "No. Research Use Only for qualified laboratories.",
    },
  ],
  semax: [
    {
      question: "What is Semax used for in laboratory research?",
      answer:
        "Semax is an ACTH(4-10) analogue studied in neuropeptide and cognitive-research models. Tetrava Labs provides it strictly as an RUO reagent.",
    },
    {
      question: "What COA information accompanies Semax?",
      answer:
        "Lot-linked HPLC-MS documentation is published when available. Retain analytical summaries with your material ID.",
    },
    {
      question: "How should Semax be handled after reconstitution?",
      answer:
        "Prepare under sterile conditions, store reconstituted stocks at 4°C, and follow institutional waste and PPE rules.",
    },
    {
      question: "How should lyophilized Semax be stored?",
      answer: "Keep sealed vials at -20°C for long-term stability.",
    },
    {
      question: "Shipping for Semax?",
      answer:
        "Cold-chain-aware packaging where required; tracking emailed after dispatch.",
    },
    {
      question: "Is Semax Research Use Only?",
      answer: "Yes. Not for human or veterinary administration.",
    },
  ],
  epithalon: [
    {
      question: "What is Epithalon (Epitalon) in research catalogs?",
      answer:
        "Epithalon is a synthetic tetrapeptide studied in longevity and pineal-related research models. Tetrava Labs lists it as Research Use Only.",
    },
    {
      question: "How is Epithalon purity verified?",
      answer:
        "Independent HPLC-MS analysis supports identity and purity claims for published lots.",
    },
    {
      question: "Reconstitution guidance for research use?",
      answer:
        "Use sterile technique and a protocol-appropriate diluent. Record preparation parameters in your ELN.",
    },
    {
      question: "Storage?",
      answer:
        "Lyophilized powder at -20°C; reconstituted solutions at 4°C with limited freeze–thaw cycling.",
    },
    {
      question: "How is Epithalon shipped?",
      answer:
        "Temperature-controlled packaging where required; email tracking when labeled.",
    },
    {
      question: "Can Epithalon be used clinically?",
      answer: "No. This catalog item is RUO only.",
    },
  ],
  "mots-c": [
    {
      question: "What is MOTS-c peptide?",
      answer:
        "MOTS-c is a 16-amino-acid peptide encoded inside the mitochondrial genome, not nuclear DNA, discovered by Lee and colleagues at USC in 2015. It activates AMPK, the cell's energy-sensing switch, by inhibiting the folate cycle and letting the metabolite AICAR build up. Tetrava Labs supplies it as a Research Use Only laboratory reagent, not a human or veterinary product.",
    },
    {
      question: "What is MOTS-c peptide used for in research?",
      answer:
        "Labs use MOTS-c to study AMPK-linked metabolic signaling, skeletal-muscle exercise adaptation, and insulin-sensitivity pathways in cell and animal models. It's frequently run alongside a folate-cycle or AICAR-pathway comparator to confirm the mechanism, and alongside other mitochondrial-research compounds like SS-31 in comparative designs.",
    },
    {
      question: "How does MOTS-c compare to SS-31?",
      answer:
        "MOTS-c vs SS-31 comes down to mechanism and evidence tier. MOTS-c is a signaling peptide that activates AMPK from inside the nucleus; SS-31 (elamipretide) is a synthetic tetrapeptide that binds cardiolipin to stabilize the electron transport chain directly. SS-31 has been through human Phase 3 trials, with an FDA-approved indication for Barth syndrome and a missed endpoint in a separate mitochondrial-myopathy trial. MOTS-c has mouse pharmacology data and small human observational studies, not a human trial program.",
    },
    {
      question: "What benefits has MOTS-c peptide research reported?",
      answer:
        "In mice, MOTS-c treatment has been associated with reversal of diet-induced obesity and age-related insulin resistance, and with roughly doubled treadmill endurance in middle-aged and old animals. In a small human study, a single bout of cycling raised endogenous MOTS-c protein about 11.9-fold in skeletal muscle. These are published findings in animal models and one human observational study, not claims about Tetrava's research reagent.",
    },
    {
      question: "What does MOTS-c Reddit discussion usually look like?",
      answer:
        "r/Peptides has an active MOTS-c thread culture built mostly around dosage questions and stacking it with SS-31 or other metabolic peptides. Most posts are anecdotal self-report rather than sourced to a study, though the Lee 2015 and Reynolds 2021 papers get cited secondhand fairly often.",
    },
    {
      question: "Is MOTS-c dosage discussion on Reddit reliable?",
      answer:
        "Treat it as a lead, not a source. The published dosing that exists is a mouse mg/kg figure from animal studies, and that doesn't convert to a human number by simple arithmetic. This page doesn't offer that conversion, and a forum post presenting one as settled fact usually isn't citing anything peer-reviewed.",
    },
    {
      question: "What's the best time to take MOTS-c in a research protocol?",
      answer:
        "There's no established human dosing schedule to answer that with, since MOTS-c isn't an approved product. What the literature describes is timing relative to exercise: in the human study, MOTS-c rose during and after a cycling bout and returned near baseline after four hours. Protocols involving exercise-adjacent sampling should anchor collection timepoints to the exercise bout itself, not a fixed clock time.",
    },
    {
      question: "Where can you buy MOTS-c for qualified research?",
      answer:
        "You can buy MOTS-c peptide online from Tetrava Labs. Every order ships to qualified researchers with lot-linked COA documentation confirming identity and HPLC purity for the exact batch received, not a generic catalog claim.",
    },
    {
      question: "Is MOTS-c Research Use Only?",
      answer:
        "Yes. MOTS-c has no FDA-approved human or veterinary indication. Tetrava Labs' listing is strictly a Research Use Only laboratory reagent, not for human or veterinary consumption.",
    },
    {
      question: "How should MOTS-c be reconstituted and stored?",
      answer:
        "Store lyophilized vials at -20°C and skip repeated freeze-thaw cycles. Reconstitute under sterile technique with a protocol-appropriate diluent right before use, then log diluent lot, reconstitution date, and operator in your ELN alongside the batch COA.",
    },
    {
      question: "How is MOTS-c purity and identity verified?",
      answer:
        "Each lot is checked by independent third-party HPLC-MS analysis reporting both purity and identity. Match the COA batch number in the COA library to the vial you actually received before starting comparative research work.",
    },
  ],
  "glow-bpc-157-tb500-ghk-cu": [
    {
      question: "What is the GLOW blend (BPC-157 + TB-500 + GHK-Cu)?",
      answer:
        "GLOW is a multi-component research blend combining tissue-repair and copper-peptide reagents for laboratories studying combination protocols. RUO only — not a therapeutic cocktail.",
    },
    {
      question: "How should blend composition be verified?",
      answer:
        "Use the lot COA and labeled component strengths as the source of truth. Record each component identity in the ELN before reconstitution.",
    },
    {
      question: "How is GLOW reconstituted?",
      answer:
        "Reconstitute under sterile technique per your multi-peptide SOP. Keep vehicle and concentration controls consistent across study arms.",
    },
    {
      question: "Storage for GLOW blend vials?",
      answer:
        "Store lyophilized blend at -20°C. After reconstitution, refrigerate at 4°C and avoid repeated freeze–thaw cycles.",
    },
    {
      question: "How is GLOW shipped?",
      answer:
        "Temperature-controlled packaging where required; discreet shipping; email tracking.",
    },
    {
      question: "Is the GLOW blend for human use?",
      answer: "No. Research Use Only for qualified laboratories.",
    },
  ],
  "bpc-157-tb500-blend": [
    {
      question: "What is the BPC-157 + TB-500 research blend?",
      answer:
        "A two-component tissue-repair research blend for laboratories evaluating combination peptide protocols. Distinct from single-SKU BPC-157 or TB-500 — document identity carefully.",
    },
    {
      question: "How do I read the COA for a blend?",
      answer:
        "Confirm the COA lists the expected components and batch. File analytical data with your material ID before comparative work.",
    },
    {
      question: "Reconstitution notes?",
      answer:
        "Sterile technique, SOP-defined diluent, and ELN documentation of concentration targets for each study arm.",
    },
    {
      question: "Storage?",
      answer:
        "Lyophilized at -20°C; reconstituted at 4°C with limited freeze–thaw cycling.",
    },
    {
      question: "Shipping?",
      answer:
        "Cold-chain-aware packaging where required; tracking emailed after labeling.",
    },
    {
      question: "Is this blend Research Use Only?",
      answer: "Yes. Not for human or veterinary administration.",
    },
  ],
  sermorelin: [
    {
      question: "Where can you buy sermorelin peptide for qualified research?",
      answer:
        "You can buy sermorelin peptide online from Tetrava Labs in 5mg and 10mg vials. Every order ships to qualified researchers with lot-linked COA documentation confirming identity and HPLC purity for the exact batch received, not a generic catalog claim.",
    },
    {
      question: "What makes a supplier the best place to buy sermorelin?",
      answer:
        "The best place to buy sermorelin publishes a lot-specific Certificate of Analysis, not just a purity percentage, confirms sequence and molecular-weight identity for GHRH(1-29)-NH2, documents cold-chain-aware storage and shipping, and gives you direct access to that documentation before and after purchase. Price alone says nothing about research-grade quality.",
    },
    {
      question:
        'What does "sermorelin for sale" mean on an RUO catalog like this one?',
      answer:
        'On this page, "sermorelin for sale" means a Research Use Only (RUO) laboratory reagent sold to qualified researchers and institutions for in vitro and in vivo study. It is not a prescription, not a compounded medication, and it is not sold or represented as fit for human or veterinary use.',
    },
    {
      question: "Is sermorelin peptide sold near me, or only online?",
      answer:
        'Tetrava Labs sells sermorelin peptide for sale strictly online, shipped from a single documented source rather than a local retail or pharmacy channel. If you are searching "sermorelin peptide near me," the question that actually matters is whether a batch has a matching lot-specific COA, not whether a vendor has a storefront near your zip code.',
    },
    {
      question:
        "What should you verify when reading sermorelin Reddit discussions?",
      answer:
        "Treat sermorelin Reddit threads as unverified, self-reported anecdotes, not clinical evidence. Check whether a poster references an actual third-party COA or HPLC-MS report, whether the vendor they name still lists that lot, and whether the effect they describe (sleep, recovery, dosing) is a subjective report rather than a controlled measurement. The threads can point you toward good questions. They are not a substitute for lot-specific documentation.",
    },
    {
      question:
        "How does sermorelin differ from CJC-1295, ipamorelin, and tesamorelin?",
      answer:
        "Sermorelin and CJC-1295 both target the GHRH receptor, but CJC-1295 is structurally modified for a longer plasma half-life. Ipamorelin targets the separate ghrelin receptor (GHS-R1a), which makes it mechanistically distinct rather than a substitute. Tesamorelin is a stabilized GHRH(1-44) analog and the only one of the four with an active FDA-approved indication. They share GH-axis relevance. They are not interchangeable as experimental controls.",
    },
    {
      question: "How is sermorelin purity and identity verified?",
      answer:
        "Each lot gets checked by independent third-party HPLC-MS analysis reporting both purity and sequence/mass identity consistent with GHRH(1-29)-NH2. Match the COA batch number in the COA library to the vial you actually received before starting comparative research work.",
    },
    {
      question: "How should sermorelin be reconstituted and stored?",
      answer:
        "Store lyophilized vials at -20°C and skip repeated freeze-thaw cycles. Reconstitute under sterile technique with a protocol-appropriate diluent right before use, then hold the reconstituted solution at 4°C and use it within your lab's defined window. Log diluent lot, reconstitution date, and operator in your ELN alongside the batch COA.",
    },
    {
      question:
        "What is sermorelin's regulatory history, and is it FDA-approved today?",
      answer:
        "Sermorelin acetate was FDA-approved under the brand name Geref for pediatric growth hormone deficiency, then the manufacturer voluntarily pulled it in 2008. A 2013 FDA Federal Register determination confirmed the withdrawal was not for safety or effectiveness reasons, but that finding is not a current marketing approval. Tetrava Labs' sermorelin listing is Research Use Only, and it is not sold, marketed, or dispensed as a medication.",
    },
  ],
  tesamorelin: [
    {
      question: "What is tesamorelin in a research context?",
      answer:
        "Tesamorelin is a GHRH analogue examined in growth-hormone axis and metabolic research models. Catalogued here as Research Use Only.",
    },
    {
      question: "COA documentation for tesamorelin?",
      answer:
        "Third-party HPLC-MS data is published per lot when available. Match batch numbers before locking experimental design.",
    },
    {
      question: "Laboratory handling after reconstitution?",
      answer:
        "Sterile preparation, refrigerated storage of working solutions, and limited freeze–thaw cycles per SOP.",
    },
    {
      question: "Lyophilized storage?",
      answer: "Keep sealed vials at -20°C.",
    },
    {
      question: "Shipping?",
      answer:
        "Cold-chain-aware packaging where required; tracking emailed when labeled.",
    },
    {
      question: "Human use?",
      answer: "Not permitted. Research Use Only.",
    },
  ],
  "igf-1-lr3": [
    {
      question: "What is IGF-1 LR3 used for in research?",
      answer:
        "IGF-1 LR3 is a long-arginine-3 insulin-like growth factor analogue studied in cell growth and signaling models. Supplied as RUO material only.",
    },
    {
      question: "How is IGF-1 LR3 purity confirmed?",
      answer:
        "Review lot-linked third-party analytical documentation when published and retain it with inventory records.",
    },
    {
      question: "Reconstitution guidance?",
      answer:
        "Follow sterile technique and your assay SOP for growth-factor reagents. Document vehicle and concentration carefully.",
    },
    {
      question: "Storage?",
      answer:
        "Lyophilized at -20°C; reconstituted stocks typically refrigerated with strict freeze–thaw control.",
    },
    {
      question: "Shipping?",
      answer:
        "Temperature-controlled packaging where required; email tracking after dispatch.",
    },
    {
      question: "Is IGF-1 LR3 for human use?",
      answer: "No. Research Use Only for qualified laboratories.",
    },
  ],
  kpv: [
    {
      question: "What is KPV studied for in research?",
      answer:
        "KPV is an alpha-MSH-derived tripeptide examined in inflammation and barrier-model research. Tetrava Labs lists it as Research Use Only.",
    },
    {
      question: "Purity and COA for KPV?",
      answer:
        "Lots are supported by independent HPLC-MS analysis. Cross-check the COA batch with the vial.",
    },
    {
      question: "How should KPV be reconstituted?",
      answer:
        "Sterile reconstitution per SOP; ELN documentation of concentration and diluent. Not dosing advice.",
    },
    {
      question: "Storage conditions?",
      answer:
        "Lyophilized at -20°C; reconstituted at 4°C with minimal freeze–thaw cycles.",
    },
    {
      question: "Shipping?",
      answer:
        "Cold-chain-aware packaging where required; tracking emailed after labeling.",
    },
    {
      question: "Is KPV Research Use Only?",
      answer: "Yes.",
    },
  ],
  "thymosin-alpha-1": [
    {
      question: "What is Thymosin Alpha-1 in research catalogs?",
      answer:
        "Thymosin Alpha-1 is a thymic peptide studied in immune-modulation research models. Offered here strictly as an RUO reagent.",
    },
    {
      question: "How is Thymosin Alpha-1 documented?",
      answer:
        "Lot COAs with HPLC-MS summaries are published when available. File them with your material ID.",
    },
    {
      question: "Reconstitution and handling?",
      answer:
        "Prepare under sterile technique per SOP. Record operator, diluent, and concentration in the ELN.",
    },
    {
      question: "Storage?",
      answer:
        "Lyophilized at -20°C; reconstituted typically at 4°C with limited freeze–thaw cycling.",
    },
    {
      question: "Shipping?",
      answer:
        "Temperature-controlled packaging where required; email tracking.",
    },
    {
      question: "Human therapeutic use?",
      answer: "Not allowed. Research Use Only.",
    },
  ],
  "5-amino-1mq": [
    {
      question: "What is 5-Amino-1MQ studied for?",
      answer:
        "5-Amino-1MQ is a small-molecule NNMT-pathway research tool used in metabolic laboratory models. Catalogued as Research Use Only.",
    },
    {
      question: "How is 5-Amino-1MQ purity verified?",
      answer:
        "Independent analytical testing supports lot identity and purity when a COA is published.",
    },
    {
      question: "How should 5-Amino-1MQ be prepared?",
      answer:
        "Follow your SOP for small-molecule research reagents (solvent choice, sterile filtration if required, and ELN documentation). Not human-use guidance.",
    },
    {
      question: "Storage?",
      answer:
        "Store per the product specifications — typically cold, dry, and sealed. Protect from unnecessary moisture.",
    },
    {
      question: "Shipping?",
      answer:
        "Shipped with appropriate packaging; tracking emailed after dispatch.",
    },
    {
      question: "Is 5-Amino-1MQ for human consumption?",
      answer: "No. Research Use Only.",
    },
  ],
  "ss-31": [
    {
      question: "What is SS-31 (Elamipretide) in research?",
      answer:
        "SS-31 is a mitochondria-targeting peptide studied in bioenergetics and oxidative-stress models. Tetrava Labs supplies it as RUO material.",
    },
    {
      question: "COA expectations for SS-31?",
      answer:
        "Third-party HPLC-MS documentation is published per lot when available. Match batch identity before assays.",
    },
    {
      question: "Reconstitution guidance?",
      answer:
        "Sterile technique and SOP-defined diluent; record concentration in the ELN. Not clinical dosing advice.",
    },
    {
      question: "Storage?",
      answer:
        "Lyophilized at -20°C; reconstituted at 4°C with minimal freeze–thaw cycles.",
    },
    {
      question: "Shipping?",
      answer:
        "Cold-chain-aware packaging where required; tracking emailed after labeling.",
    },
    {
      question: "Is SS-31 Research Use Only?",
      answer: "Yes. Not for human or veterinary administration.",
    },
  ],
};

/** Curated FAQs if present; otherwise unique auto FAQs from catalog context. */
export function getProductFaqs(
  parentHandle: string,
  context?: Omit<ProductFaqContext, "parentHandle">,
): FaqItem[] {
  const raw = parentHandle.trim().toLowerCase();
  const key = getCompoundParentHandle(raw) || raw;
  const curated = productFaqsByHandle[key];
  if (curated?.length) return curated;

  const auto = buildAutoProductFaqs({
    parentHandle: key,
    productName: context?.productName,
    category: context?.category,
    appearance: context?.appearance,
  });
  return auto.length ? auto : productFaqItems;
}
