import "server-only";

import type { AuthorId } from "@/lib/authors";

export type ResearchSection = {
  heading: string;
  paragraphs: string[];
  /** Optional bullet list rendered after the paragraphs (for myth-busting / evidence summaries). */
  bullets?: string[];
};

export type ResearchReference = {
  id: number;
  citation: string;
  url?: string;
};

export type ProductResearchDetail = {
  /** Short description paragraph(s) shown above the analytical data table. */
  shortDescription: string[];
  /** Known synonyms / development codes, shown alongside Molecular Formula / Weight / Sequence. */
  otherKnownTitles?: string[];
  /** "[Product Name] Peptide Research" subsections. */
  sections: ResearchSection[];
  /** Numbered references, cited in section paragraphs as literal "[n]" tokens. */
  references: ResearchReference[];
  /** Byline shown as the Author Profile block beneath the references. */
  authorId: AuthorId;
};

/**
 * Curated, citation-backed long-form research content for the Description tab.
 * Only products with an entry here render the full Biotech-Peptides-style
 * sequence (short description → identity data → Research → References →
 * Author Profile). Other products fall back to the generic overview copy.
 */
const PRODUCT_RESEARCH_DETAIL: Record<string, ProductResearchDetail> = {
  "bpc-157": {
    shortDescription: [
      "BPC-157, or Body Protection Compound-157, is a synthetic pentadecapeptide research compound composed of 15 amino acids. It corresponds to a partial, stabilized sequence of a gastroprotective protein originally isolated from human gastric juice.[1]",
      "Tetrava Labs supplies BPC-157 as a sterile, lyophilized reagent intended exclusively for in vitro and in vivo laboratory research into [tissue-repair signaling](/category/tissue-repair), angiogenesis, and gastrointestinal mucosal-protection models. The molecular formula, weight, and sequence listed below are cross-referenced against the PubChem compound record for BPC-157.[10] Every lot ships with third-party HPLC-verified identity and purity data — this compound is sold strictly for research use and is not for human or veterinary consumption.",
    ],
    otherKnownTitles: [
      "Body Protection Compound-157",
      "Pentadecapeptide BPC 157",
      "PL-14736",
      "PL-10",
      "Bepecin",
      "BPC 15",
    ],
    sections: [
      {
        heading: "BPC-157 and the Increased Expression of VEGFR2",
        paragraphs: [
          "Chick chorioallantoic membrane and endothelial tube-formation assays indicate that BPC-157 increases vessel density and accelerates blood-flow recovery in the ischemic hindlimb muscle of rats.[2] Histological and cell-culture analyses from the same study reported increased expression of vascular endothelial growth factor receptor 2 (VEGFR2) and time-dependent activation of the VEGFR2-Akt-eNOS signaling cascade — a pathway associated with nitric-oxide-mediated endothelial function.[2]",
          "Laboratories modeling angiogenesis in tissue-repair protocols frequently reference this pathway when designing VEGFR2 expression or nitric-oxide-synthase readouts, and when selecting endothelial cell lines for comparative screening.",
        ],
      },
      {
        heading: "BPC-157 Enhances Fibroblast Migration",
        paragraphs: [
          "In cultured rat Achilles tendon fibroblasts, BPC-157 was reported to accelerate ex vivo tendon-explant outgrowth, increase cell survival under oxidative (H2O2) stress, and dose-dependently enhance fibroblast migration in transwell assays.[3] The same study attributed the migratory effect to increased phosphorylation of focal adhesion kinase (FAK) and paxillin — proteins associated with cytoskeletal reorganization and cell adhesion — without a corresponding change in total protein levels.[3]",
          "This mechanism is commonly cited in [comparative tendon-repair study designs](/category/tissue-repair) alongside growth-factor controls such as bFGF or EGF, and BPC-157 is frequently stacked with [TB-500](/buy-tb-500-online) in combined tissue-repair protocols — a useful reference point when structuring dose-response migration assays.",
        ],
      },
      {
        heading: "BPC-157 Increases GHR mRNA and Protein",
        paragraphs: [
          "A cDNA microarray screen of BPC-157-treated tendon fibroblasts identified growth hormone receptor (GHR) as one of the most strongly up-regulated genes.[4] Follow-up assays reported dose- and time-dependent increases in GHR mRNA and protein, with downstream activation of the Janus kinase 2 (JAK2) pathway when exogenous growth hormone was added to BPC-157-treated cultures — a combination associated with increased fibroblast proliferation.[4]",
          "Researchers studying GHR-JAK2 crosstalk in tendon models may find this pairing informative when designing co-treatment or sequential-exposure protocols.",
        ],
      },
      {
        heading:
          "BPC-157 Associated with Fully Recovered Quadriceps Myotendinous Junction",
        paragraphs: [
          "In a rat model of surgically dissected quadriceps myotendinous junction — an injury that does not heal spontaneously — intraperitoneal and oral BPC-157 regimens were associated with full functional recovery, reversal of progressive muscle atrophy, and structural resolution of the defect by postoperative day 42.[5]",
          "A 2025 systematic review of 36 studies (35 preclinical, 1 clinical) concluded that BPC-157 modulates growth hormone receptor expression along with angiogenic and inflammatory-cytokine pathways across muscle, tendon, ligament, and bone injury models in animal research, while explicitly noting that the evidence base remains dominated by preclinical (level IV-V) study designs.[8]",
        ],
      },
      {
        heading: "BPC-157 and Gastrointestinal Mucosal Protection Research",
        paragraphs: [
          "BPC-157 was first characterized in work on gastric-juice-derived cytoprotective compounds, and much of the foundational literature centers on gastrointestinal ulcer, fistula, and mucosal-injury models in rats.[1] Review literature describes consistent protective findings across GI-injury models, attributed in part to modulation of the nitric-oxide system and interactions with several neurotransmitter pathways, though the precise upstream mechanism has not been fully resolved.[1]",
        ],
      },
      {
        heading: "BPC-157 Oral vs Injection",
        paragraphs: [
          "Most synthetic peptides longer than 8–10 amino acids lose the majority of their bioactivity when given orally, since gastric acid and digestive proteases degrade the peptide backbone before meaningful amounts survive into systemic circulation. BPC-157 is a documented exception: because the sequence is a stabilized fragment of a native human gastric-juice protein, review literature reports it remains structurally intact in human gastric juice for more than 24 hours in vitro — a stability profile that is unusual among peptide research compounds and is the mechanistic basis researchers cite for studying BPC-157 via oral gavage or drinking-water protocols alongside injectable routes.[1][12]",
          'Direct within-study comparisons of the two routes are rare, which makes one 2008 rat colocutaneous-fistula study a useful reference point: researchers dosed BPC-157 either continuously in drinking water or once-daily by intraperitoneal injection at matched doses (10 µg/kg or 10 ng/kg), then assessed fistula closure macroscopically, microscopically, biomechanically, and functionally over a 28-day follow-up.[11] Both routes accelerated healing of the colonic and skin defects to a comparable degree, and a separate rat model of surgically dissected quadriceps myotendinous junction reported the same pattern for a systemic musculoskeletal endpoint — intraperitoneal and oral regimens were both associated with full functional recovery.[5] Neither study measured comparative bioavailability, and no controlled human pharmacokinetic study has quantified how much intact peptide reaches systemic circulation after oral dosing, so "comparable outcomes in these specific rodent protocols" should not be read as "interchangeable across all endpoints, species, or doses."',
          "In practical terms, oral/intragastric dosing is best matched to BPC-157's original GI-tract research context, since it reaches the luminal mucosa directly and avoids the injection-site trauma that can confound skin- or gut-healing designs, while injection (IP/SC/IM) remains the default in the receptor- and growth-factor-signaling studies cited above because it bypasses the GI tract entirely and delivers a known, individually controlled dose. That oral stability is also compound-specific — it has not been documented for TB-500, which Tetrava also supplies for combined [tissue-repair protocols](/category/tissue-repair) — so route choice should follow the protocol, not the other way around. Tetrava Labs supplies BPC-157 as both a lyophilized vial for injectable research solutions and as [BPC-157 capsules](/buy-bpc-157-capsules-online) for oral-route protocols.",
        ],
      },
      {
        heading: "Central Nervous System and Traumatic Brain Injury Models",
        paragraphs: [
          "A single published study evaluated intraperitoneal BPC-157 in a mouse falling-weight traumatic brain injury (TBI) model.[6] Treated mice showed reduced 24-hour post-injury mortality and less severe hemorrhagic and edema findings on gross and histological assessment, with improved outcomes when the peptide was administered prophylactically before injury.[6] This remains the only direct TBI dataset identified in the literature, so extrapolation beyond this single-study, single-species model should be treated cautiously.",
        ],
      },
      {
        heading:
          "BPC-157 as It Currently Stands: Preclinical Weight vs Human Data",
        paragraphs: [
          "A common misconception is that the extensive rodent and cell-culture literature on BPC-157 is equivalent to demonstrated human efficacy. Current systematic and narrative reviews are explicit that this is not the case:",
        ],
        bullets: [
          "BPC-157 is not approved by the FDA or any comparable regulator for human therapeutic use, and it is prohibited by major anti-doping authorities in professional sports.[8]",
          "Human data are limited to a small number of pilot-level, non-blinded studies — including a retrospective case series of intra-articular injection for chronic knee pain, in which 14 of 16 patients reported relief beyond six months.[7]",
          "A 2025 systematic review identified only one clinical-level study among 36 total included papers, and found no published in-human safety data despite favorable preclinical toxicology.[8]",
          "A 2025 narrative review reached the same conclusion, describing BPC-157 as investigational and calling for well-designed human trials before any clinical extrapolation from animal data.[9]",
        ],
      },
      {
        heading:
          "Laboratory Handling: Reconstitution, Storage, and Documentation",
        paragraphs: [
          "Tetrava Labs ships BPC-157 as a lyophilized powder for stability during transport. Store sealed vials at -20°C, avoid repeated freeze-thaw cycles, and reconstitute under sterile technique with a protocol-appropriate diluent immediately before use. For dilution ratios and step-by-step math, see our [BPC-157 handling protocol](/blog/bpc-157-handling-protocol) and general [peptide reconstitution calculations](/blog/peptide-reconstitution-calculations) guide.",
          "Once reconstituted, store working solutions at 4°C and use within the window defined by your laboratory SOP. Record diluent lot, reconstitution date, and operator in your ELN so preparation conditions remain auditable alongside the batch [Certificate of Analysis](/coa-library) — see [how to read COA and HPLC reports](/blog/how-to-read-coa-and-hplc-reports) for interpretation guidance.",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "Sikiric P, Seiwerth S, Rucman R, et al. Stable gastric pentadecapeptide BPC 157: novel therapy in gastrointestinal tract. Curr Pharm Des. 2011;17(16):1612-1632.",
        url: "https://pubmed.ncbi.nlm.nih.gov/21548867/",
      },
      {
        id: 2,
        citation:
          "Hsieh MJ, Liu HT, Wang CN, et al. Therapeutic potential of pro-angiogenic BPC157 is associated with VEGFR2 activation and up-regulation. J Mol Med (Berl). 2017;95(3):323-333.",
        url: "https://pubmed.ncbi.nlm.nih.gov/27889809/",
      },
      {
        id: 3,
        citation:
          "Chang CH, Tsai WC, Lin MS, Hsu YH, Pang JH. The promoting effect of pentadecapeptide BPC 157 on tendon healing involves tendon outgrowth, cell survival, and cell migration. J Appl Physiol. 2011;110(3):774-780.",
        url: "https://pubmed.ncbi.nlm.nih.gov/21030672/",
      },
      {
        id: 4,
        citation:
          "Chang CH, Tsai WC, Hsu YH, Pang JH. Pentadecapeptide BPC 157 enhances the growth hormone receptor expression in tendon fibroblasts. Molecules. 2014;19(11):19066-19077.",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6271067/",
      },
      {
        id: 5,
        citation:
          "Japjec M, Horvat Pavlov K, Petrovic A, et al. Stable gastric pentadecapeptide BPC 157 as a therapy for the disable myotendinous junctions in rats. Biomedicines. 2021;9(11):1547.",
        url: "https://pubmed.ncbi.nlm.nih.gov/34829776/",
      },
      {
        id: 6,
        citation:
          "Tudor M, Jandric I, Marovic A, et al. Traumatic brain injury in mice and pentadecapeptide BPC 157 effect. Regul Pept. 2010;160(1-3):26-32.",
        url: "https://pubmed.ncbi.nlm.nih.gov/19931318/",
      },
      {
        id: 7,
        citation:
          "Lee E, Padgett B. Intra-articular injection of BPC 157 for multiple types of knee pain. Altern Ther Health Med. 2021;27(4):8-13.",
        url: "https://pubmed.ncbi.nlm.nih.gov/34324435/",
      },
      {
        id: 8,
        citation:
          "Vasireddi N, Hahamyan H, Salata MJ, et al. Emerging use of BPC-157 in orthopaedic sports medicine: a systematic review. HSS J. 2025;21(4):485-495.",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12313605/",
      },
      {
        id: 9,
        citation:
          "McGuire FP, Martinez R, Lenz A, et al. Regeneration or risk? A narrative review of BPC-157 for musculoskeletal healing. Curr Rev Musculoskelet Med. 2025;18:611-619.",
        url: "https://doi.org/10.1007/s12178-025-09990-7",
      },
      {
        id: 10,
        citation:
          "National Center for Biotechnology Information. PubChem Compound Summary for CID 9941957, BPC-157.",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/9941957",
      },
      {
        id: 11,
        citation:
          "Klicek R, Sever M, Radic B, et al. Pentadecapeptide BPC 157, in clinical trials as a therapy for inflammatory bowel disease (PL14736), is effective in the healing of colocutaneous fistulas in rats: role of the nitric oxide-system. J Pharmacol Sci. 2008;108(1):7-17.",
        url: "https://doi.org/10.1254/jphs.FP0072161",
      },
      {
        id: 12,
        citation:
          "Seiwerth S, Milavic M, Vukojevic J, et al. Stable gastric pentadecapeptide BPC 157 and wound healing. Front Pharmacol. 2021;12:627533.",
        url: "https://doi.org/10.3389/fphar.2021.627533",
      },
    ],
    authorId: "sharma",
  },
  sermorelin: {
    shortDescription: [
      "Sermorelin is the common name for GHRH(1-29)-NH2 — a synthetic, C-terminally amidated 29-amino-acid peptide that reproduces the amino-terminal segment of the naturally occurring 44-residue human growth hormone-releasing hormone (GHRH).[1] It is not growth hormone itself, and it is not interchangeable with unrelated GH-secretagogue analogs such as CJC-1295, ipamorelin, or tesamorelin — each of those binds a different receptor site or carries different structural modifications and belongs in a separate experimental arm rather than as a drop-in substitute.",
      "Tetrava Labs supplies sermorelin as a sterile, lyophilized reagent intended exclusively for in vitro and in vivo laboratory research into growth-hormone-axis signaling, receptor pharmacology, and peptide-stability assay design. The molecular formula, weight, and sequence listed below are cross-referenced against the PubChem compound record for sermorelin.[7] Every lot ships with third-party HPLC-verified identity and purity data — this compound is sold strictly for research use and is not for human or veterinary consumption.",
    ],
    otherKnownTitles: [
      "GHRH(1-29)-NH2",
      "GRF(1-29)",
      "GRF 1-29",
      "Sermorelin Acetate",
      "Geref (discontinued brand name)",
    ],
    sections: [
      {
        heading: "Sermorelin (GHRH 1-29): Sequence Identity and What It Is Not",
        paragraphs: [
          "Structurally, sermorelin is the first 29 residues of native human GHRH with a C-terminal amide substituted for the free acid — a modification that improves in vitro stability without changing the receptor-binding region.[1] Guide to Pharmacology lists the peptide sequence as Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-Gln, which matches the identity fields in the specifications table below.",
          "It is worth being precise about what this listing is not: it is not full-length GHRH(1-44), not human growth hormone (somatropin), and not a finished pharmaceutical product. Tetrava's catalog entry corresponds to the free peptide (sermorelin), not the acetate salt used in the historical Geref formulation — a distinction that matters when comparing molecular weight or formula figures across sources.",
        ],
      },
      {
        heading: "GHRH Receptor Signaling and the Pulsatile GH-Axis Mechanism",
        paragraphs: [
          "Sermorelin binds the growth-hormone-releasing hormone receptor (GHRHR), a pituitary somatotroph G-protein-coupled receptor, mimicking the action of endogenous GHRH to stimulate growth hormone (GH) release.[7] In healthy human subjects, both intravenous and intranasal administration produced dose-dependent GH release, with intravenous dosing eliciting peak GH concentrations within the first hour and elevated GH levels sustained for roughly three hours post-dose.[2]",
          "Because endogenous GH secretion is pulsatile rather than continuous, researchers designing GHRHR-response assays should treat single time-point GH sampling as a source of variance: the same study found no suppression of nocturnal GH pulsatility even after repeated intranasal dosing, indicating that assay design should account for circadian and pulse-interval effects rather than relying on isolated GH-concentration snapshots.[2]",
        ],
      },
      {
        heading:
          "Why the 29-Amino-Acid Fragment Matters: DPP-IV Degradation and Experimental Design",
        paragraphs: [
          "The N-terminal Tyr-Ala bond in GHRH(1-29) is the primary cleavage site for plasma dipeptidyl peptidase IV (DPP-IV), which rapidly truncates the peptide to the largely inactive GHRH(3-29) fragment; a secondary, trypsin-like cleavage at the 12–13 position contributes a smaller share of total degradation.[1] This dual-pathway breakdown is the reason unmodified GHRH(1-29) analogs show short plasma half-lives in kinetic studies.",
          "Substituting D-Ala for the position-2 L-Ala — as in some longer-acting GHRH analogs — blocks the DPP-IV cleavage step and measurably extends plasma half-life and reduces metabolic clearance rate compared with unmodified GHRH(1-29)-NH2 in controlled infusion studies.[3] For laboratories designing pharmacokinetic or stability protocols, this means sample handling (protease inhibitors, rapid processing, and defined time points) and analog selection both need to be documented alongside the batch [Certificate of Analysis](/coa-library) to make degradation-rate comparisons meaningful.",
          "Analytical detection of GHRH(1-29) and its metabolites in plasma is achievable by immunoaffinity purification coupled with high-resolution LC-MS/MS, a method validated for distinguishing intact peptide from its GHRH(3-29) breakdown product — a useful reference point when selecting an assay to confirm peptide integrity in a research sample rather than relying on purity data alone.[4]",
        ],
      },
      {
        heading: "Regulatory History and Evidence Boundaries",
        paragraphs: [
          "Sermorelin acetate was FDA-approved under the brand name Geref for the diagnosis and treatment of pediatric growth hormone deficiency, then voluntarily discontinued from the U.S. market by its manufacturer in 2008. Following a citizen petition, the FDA issued a formal March 2013 Federal Register determination that both Geref (Sermorelin Acetate) injection products were not withdrawn from sale for reasons of safety or effectiveness — a procedural finding, not a current marketing approval.[6]",
          "That history establishes that sermorelin's core pharmacology has clinical-trial-level human data behind it, but it does not change this listing's status. Tetrava's sermorelin is sold exclusively as a Research Use Only (RUO) laboratory reagent — it is not dispensed, prescribed, or represented as a medication, and no dosing, treatment, or anti-aging claim is made or implied on this page.",
        ],
      },
      {
        heading:
          "Sermorelin vs CJC-1295, Ipamorelin, and Tesamorelin: A Comparison Framework",
        paragraphs: [
          "Researchers frequently group sermorelin with CJC-1295, ipamorelin, and tesamorelin because all four influence the GH axis, but they are not interchangeable controls in an experimental design:",
        ],
        bullets: [
          "[CJC-1295](/cjc-1295-without-dac) — a modified GHRH(1-29) analog engineered (with or without a Drug Affinity Complex, DAC) for extended plasma half-life; a longer-acting GHRHR agonist, not a different mechanism.",
          "[Ipamorelin](/buy-ipamorelin-online) — a pentapeptide ghrelin-receptor (GHS-R1a) agonist, mechanistically distinct from GHRHR agonists like sermorelin; combining the two probes a synergistic rather than additive GH-secretagogue pathway.[5]",
          "[Tesamorelin](/buy-tesamorelin-online) — a stabilized GHRH(1-44) analog with a trans-3-hexenoic acid N-terminal modification, the only GHRH analog with an active, currently FDA-approved indication (HIV-associated lipodystrophy) — a materially different regulatory status than sermorelin's discontinued-but-not-unsafe history.[5][6]",
          "Because these compounds differ in receptor target, half-life, and regulatory status, substituting one for another mid-protocol without re-validating dose-response and sampling-interval assumptions will confound comparative GH-axis data.",
        ],
      },
      {
        heading: "Sermorelin Reddit: How to Assess Community Claims",
        paragraphs: [
          'Peptide-research forums, including r/Peptides and r/Sermorelin threads, are a common first stop for people searching "sermorelin reddit." Recurring claim types in that community generally fall into three buckets: (1) subjective sleep-quality or recovery reports, (2) informal self-sourced purity or dosing comparisons between vendors, and (3) stacking protocols combining sermorelin with other GH-axis peptides.',
          "None of these should be treated as clinical evidence. Self-reported outcomes are unblinded, uncontrolled, and confounded by diet, training, and concurrent supplement use; informal purity comparisons are not equivalent to third-party HPLC-MS testing; and stacking anecdotes describe personal practice, not validated protocols. Treat Reddit threads as a source of hypotheses worth investigating in a properly controlled study — such as which vendors' COAs a poster references, or which analytical method a claim relies on — not as a substitute for lot-specific documentation.",
        ],
      },
      {
        heading:
          "Best Place to Buy Sermorelin for Research: A Verification Checklist",
        paragraphs: [
          '"Best place to buy sermorelin" is a subjective question, but it has objective inputs. Before treating any vendor as qualified for research procurement, verify:',
        ],
        bullets: [
          "Lot identity — does the listing specify a batch/lot number that matches the Certificate of Analysis (COA) shipped with the vial, rather than a generic or outdated document?",
          "COA/HPLC traceability — is the COA issued by an independent third-party lab, and does it report purity by area-under-curve HPLC (not just a vendor's internal claim)?",
          "Sequence and mass match — does the COA (or an accompanying mass-spec report) confirm amino-acid sequence identity and molecular weight consistent with GHRH(1-29)-NH2, not just a purity percentage?",
          "Storage and chain of custody — was the product shipped and stored in a manner consistent with a lyophilized peptide's stability requirements, with documentation of cold-chain handling where applicable?",
          "Support and documentation access — can you request the underlying COA/HPLC report and reach a knowledgeable contact before or after purchase, or is documentation withheld?",
          "A vendor that cannot produce a lot-specific COA on request for a currently listed batch should not be treated as a qualified research supplier, regardless of price or marketing claims.",
        ],
      },
      {
        heading: "Tetrava's Sermorelin Catalog: 5mg and 10mg Lot Documentation",
        paragraphs: [
          "Tetrava Labs lists sermorelin in 5mg and 10mg per-vial options, with volume-tiered pack sizes for labs running multi-vial protocols. The current documented lot is reported at 99% purity by HPLC — always cross-check the COA attached to your specific order against the [COA library](/coa-library), since lot numbers rotate as new batches are qualified and older stock sells through.",
          "Identity fields (CAS number, molecular formula, molecular weight, and sequence) for both strengths are listed in the specifications table above and are drawn from the same lot records used to generate each batch's COA — not from generic reference data. This is a deliberate design choice: pack-planning decisions (choosing 5mg vs 10mg vials, and single-vial vs multi-vial packs) should be made against verifiable, lot-linked documentation rather than marketing copy.",
        ],
      },
      {
        heading:
          "Laboratory Handling: Reconstitution, Storage, and Documentation",
        paragraphs: [
          "Tetrava Labs ships sermorelin as a lyophilized powder for stability during transport. Store sealed vials at -20°C, avoid repeated freeze-thaw cycles, and reconstitute under sterile technique with a protocol-appropriate diluent immediately before use — see our [peptide reconstitution calculations](/blog/peptide-reconstitution-calculations) guide for dilution math.",
          "Given sermorelin's DPP-IV-driven degradation profile in biological matrices,[3] researchers running stability or pharmacokinetic protocols should record diluent lot, reconstitution date, storage temperature, and sampling time points in their ELN. Pair this with [how to read COA and HPLC reports](/blog/how-to-read-coa-and-hplc-reports) for interpreting purity data and [documenting batch IDs in lab notebooks](/blog/documenting-batch-ids-lab-notebooks) for keeping preparation records auditable against the [Growth Hormone Axis](/category/growth-hormone-axis) category's other GHRH- and GHRP-class reagents.",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "Frohman LA, Downs TR, Heimer EP, Felix AM. Dipeptidylpeptidase IV and trypsin-like enzymatic degradation of human growth hormone-releasing hormone in plasma. J Clin Invest. 1989;83(5):1533-1540.",
        url: "https://pubmed.ncbi.nlm.nih.gov/2565342/",
      },
      {
        id: 2,
        citation:
          "Wilton P, Chardet Y, Danielson K, Widlund L, Gunnarsson R. Pharmacokinetics of growth hormone-releasing hormone(1-29)-NH2 and stimulation of growth hormone secretion in healthy subjects after intravenous or intranasal administration. Acta Paediatr Suppl. 1993;388:10-15.",
        url: "https://pubmed.ncbi.nlm.nih.gov/8329825/",
      },
      {
        id: 3,
        citation:
          "Soule S, King JA, Millar RP. Incorporation of D-Ala2 in growth hormone-releasing hormone-(1-29)-NH2 increases the half-life and decreases metabolic clearance in normal men. J Clin Endocrinol Metab. 1994;79(4):1208-1211.",
        url: "https://pubmed.ncbi.nlm.nih.gov/7962295/",
      },
      {
        id: 4,
        citation:
          "Knoop A, Thomas A, Fichant E, Delahaut P, Schänzer W, Thevis M. Qualitative identification of growth hormone-releasing hormones in human plasma by means of immunoaffinity purification and LC-HRMS/MS. Anal Bioanal Chem. 2016;408(12):3145-3153.",
        url: "https://pubmed.ncbi.nlm.nih.gov/26879649/",
      },
      {
        id: 5,
        citation:
          "Ishida J, Saitoh M, Ebner N, Springer J, Anker SD, von Haehling S. Growth hormone secretagogues: history, mechanism of action, and clinical development. JCSM Rapid Commun. 2020;3(1):25-37.",
        url: "https://doi.org/10.1002/rco2.9",
      },
      {
        id: 6,
        citation:
          "U.S. Food and Drug Administration. Determination that GEREF (Sermorelin Acetate) Injection, 0.5 mg base/vial and 1.0 mg base/vial, and GEREF (Sermorelin Acetate) Injection, 0.05 mg base/amp, were not withdrawn from sale for reasons of safety or effectiveness. Fed Regist. 2013;78(42):14095-14096.",
        url: "https://www.federalregister.gov/documents/2013/03/04/2013-04827/determination-that-geref-sermorelin-acetate-injection-05-milligrams-basevial-and-10-milligrams",
      },
      {
        id: 7,
        citation:
          "National Center for Biotechnology Information. PubChem Compound Summary for CID 16132413, Sermorelin.",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/Sermorelin",
      },
    ],
    authorId: "sharma",
  },
};

export function getProductResearchDetail(
  parentHandle: string,
): ProductResearchDetail | null {
  return PRODUCT_RESEARCH_DETAIL[parentHandle] || null;
}
