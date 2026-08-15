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
  /** ISO date this research detail was last substantively edited (for dateModified schema). */
  updatedAt?: string;
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
          "Tetrava Labs ships BPC-157 as a lyophilized powder for stability during transport. Store sealed vials at -20°C, avoid repeated freeze-thaw cycles, and reconstitute under sterile technique with a protocol-appropriate diluent immediately before use. For compound context and handling notes, see [BPC-157 vs TB-500](/blog/bpc-157-vs-tb-500).",
          "Once reconstituted, store working solutions at 4°C and use within the window defined by your laboratory SOP. Record diluent lot, reconstitution date, and operator in your ELN so preparation conditions remain auditable alongside the batch [Certificate of Analysis](/coa-library).",
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
    authorId: "editorial-team",
    updatedAt: "2026-08-13",
  },
  sermorelin: {
    shortDescription: [
      "Sermorelin is the common name for GHRH(1-29)-NH2, a synthetic 29-amino-acid peptide with a C-terminal amide. It covers the amino-terminal stretch of the naturally occurring 44-residue human growth hormone-releasing hormone, GHRH.[1]",
      "Tetrava Labs sells sermorelin as a sterile, lyophilized reagent for lab work on growth-hormone-axis signaling, receptor pharmacology, and peptide-stability assays, in vitro and in vivo. Researchers who buy sermorelin peptide here get formula, weight, and sequence data checked against the PubChem record for sermorelin.[7] Each lot ships with third-party HPLC identity and purity data. This is a research use only listing. Not for human or veterinary consumption.",
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
        heading: "Sequence identity",
        paragraphs: [
          "Sermorelin is the first 29 residues of native human GHRH, with a C-terminal amide swapped in for the free acid. That amide change raises stability in vitro and leaves the receptor-binding region untouched.[1] Guide to Pharmacology lists the sequence as Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-Gln, matching the identity fields in the table above.",
          "This listing is the free peptide, not the acetate salt used in the old Geref formulation, so molecular weight and formula will not match an acetate-salt COA. It is not full-length GHRH(1-44) either, and it is not somatropin, human growth hormone itself.",
        ],
      },
      {
        heading: "GHRH receptor signaling and pulsatile GH release",
        paragraphs: [
          "Sermorelin binds the growth-hormone-releasing hormone receptor, GHRHR, on pituitary somatotrophs. GHRHR is a G-protein-coupled receptor, and sermorelin mimics endogenous GHRH there to trigger growth hormone (GH) release.[7] In healthy human subjects, both intravenous and intranasal dosing produced dose-dependent GH release. IV dosing hit peak GH within the first hour, and GH stayed elevated for roughly three hours after.[2]",
          "Endogenous GH secretion is pulsatile, not a flat line, so a single time-point GH sample is a source of variance on its own. The same study found no suppression of nocturnal GH pulsatility after repeated intranasal dosing. Assay design has to account for circadian rhythm and pulse-interval effects, or the numbers will not mean much.[2]",
        ],
      },
      {
        heading: "Why the 29-residue fragment is short-lived: DPP-IV cleavage",
        paragraphs: [
          "The N-terminal Tyr-Ala bond in GHRH(1-29) is the main cleavage site for plasma dipeptidyl peptidase IV, DPP-IV. DPP-IV truncates the peptide to GHRH(3-29), which is largely inactive. A secondary trypsin-like cut at positions 12-13 accounts for a smaller share of total degradation.[1] That is why unmodified GHRH(1-29) analogs run short plasma half-lives in kinetic studies.",
          "Swap the position-2 L-Ala for D-Ala, as some longer-acting GHRH analogs do, and the DPP-IV step gets blocked. Controlled infusion studies showed a longer plasma half-life and a lower metabolic clearance rate than unmodified GHRH(1-29)-NH2.[3] Running a pharmacokinetic or stability protocol? Write down protease inhibitors, processing speed, sampling times, and analog identity next to the batch [Certificate of Analysis](/coa-library). Skip that step and degradation-rate comparisons turn into noise.",
          "GHRH(1-29) and its metabolites can be picked up in plasma by immunoaffinity purification plus high-resolution LC-MS/MS, a method that tells intact peptide apart from GHRH(3-29).[4] Use it to confirm integrity in a research sample. A purity percentage on a COA does not measure the same thing.",
        ],
      },
      {
        heading: "Regulatory history and what this listing is",
        paragraphs: [
          "Sermorelin acetate was FDA-approved as Geref, for diagnosing and treating pediatric growth hormone deficiency. The manufacturer pulled it from the U.S. market in 2008. After a citizen petition, FDA published a March 2013 Federal Register notice stating that both Geref (sermorelin acetate) injection products were not withdrawn for safety or effectiveness reasons. That is a procedural finding, not a current marketing approval.[6]",
          "Geref trials mean the peptide carries clinical-trial-level human pharmacology data. Tetrava's sermorelin is still sold only as a research use only laboratory reagent: it is not dispensed, prescribed, or described as a medication, and this page makes no dosing, treatment, or anti-aging claims.",
        ],
      },
      {
        heading: "Sermorelin vs CJC-1295, ipamorelin, and tesamorelin",
        paragraphs: [
          "Labs often file sermorelin next to CJC-1295, ipamorelin, and tesamorelin, since all four touch the GH axis. They are not interchangeable controls, though.",
        ],
        bullets: [
          "[CJC-1295](/cjc-1295-without-dac) is a modified GHRH(1-29) analog built, with or without a Drug Affinity Complex (DAC), for a longer plasma half-life. Same receptor class, longer action: not a different mechanism.",
          "[Ipamorelin](/buy-ipamorelin-online) is a pentapeptide ghrelin-receptor (GHS-R1a) agonist, a different receptor from GHRHR entirely. Pairing the two probes a synergistic GH-secretagogue path, not an additive one.[5]",
          "[Tesamorelin](/buy-tesamorelin-online) is a stabilized GHRH(1-44) analog with a trans-3-hexenoic acid N-terminal modification, and the only GHRH analog with an active FDA-approved indication (HIV-associated lipodystrophy). Sermorelin's history is discontinued-but-not-unsafe, a different regulatory status entirely.[5][6]",
          "Receptor, half-life, and regulatory status all differ. Swap one for another mid-protocol without re-checking dose-response and sampling intervals, and the comparative GH-axis data gets confounded.",
        ],
      },
      {
        heading: "Sermorelin on Reddit",
        paragraphs: [
          "People searching \"sermorelin reddit\" usually land on r/Peptides or r/Sermorelin. The threads cluster around subjective sleep or recovery reports, informal vendor purity or dosing comparisons, and stacking with other GH-axis peptides.",
          "None of that is clinical evidence. Self-reported outcomes are unblinded and uncontrolled, and diet, training, and other compounds muddy the picture. Informal purity talk is not third-party HPLC-MS. Stacking anecdotes describe someone's personal practice, not a validated protocol. Treat the threads as a source of questions worth asking, like which COA a poster names or which analytical method a claim rests on, then go check the lot paperwork yourself.",
        ],
      },
      {
        heading: "Buying sermorelin for research: what to verify",
        paragraphs: [
          "Vendor quality is checkable before you buy sermorelin peptide from anyone. Before you treat a supplier as qualified, look at:",
        ],
        bullets: [
          "Lot identity: does the listing give a batch/lot number that matches the Certificate of Analysis shipped with the vial, or is the PDF generic or old?",
          "COA/HPLC traceability: is the COA from an independent third-party lab, and does it report purity by area-under-curve HPLC rather than an in-house claim?",
          "Sequence and mass: does the COA (or an accompanying mass-spec report) confirm amino-acid sequence identity and molecular weight consistent with GHRH(1-29)-NH2? A purity percentage without those fields is incomplete.",
          "Storage and chain of custody: was the product shipped and stored in a way that matches a lyophilized peptide, with cold-chain notes where they apply?",
          "Support: can you get the underlying COA/HPLC report and reach someone who knows the lot, or is documentation withheld?",
          "If a vendor cannot produce a lot-specific COA on request for a currently listed batch, do not treat them as a qualified research supplier. Price and marketing copy do not fix that.",
        ],
      },
      {
        heading: "\"Sermorelin peptide near me\": why location is the wrong filter",
        paragraphs: [
          "Searching \"sermorelin peptide near me\" will not get you far. This is a lab reagent sold online to qualified researchers and institutions, not something stocked on a pharmacy shelf or sold out of a local storefront.",
          "Tetrava Labs ships sermorelin for sale from a single documented source, and an order placed across town gets the same lot paperwork as one placed across the country. A nearby address does not make a supplier more qualified. A matching, lot-specific COA does.",
        ],
      },
      {
        heading: "5 mg and 10 mg lot documentation",
        paragraphs: [
          "Tetrava Labs lists sermorelin in 5 mg and 10 mg vials, plus volume-tiered packs for labs running multi-vial protocols. The best place to buy sermorelin for a given protocol comes down to which strength and pack size fit your dosing math, not price alone. The current documented lot runs 99% purity by HPLC; cross-check the COA on your order against the [COA library](/coa-library), since lot numbers rotate as new batches get qualified and older stock sells through.",
          "Identity fields, CAS number, molecular formula, molecular weight, and sequence, for both strengths sit in the specifications table above. They come from the same lot records used to generate each batch COA, not from generic reference tables. Choose 5 mg versus 10 mg, and single-vial versus multi-vial, against that paperwork.",
        ],
      },
      {
        heading: "Reconstitution, storage, and documentation",
        paragraphs: [
          "Tetrava Labs ships sermorelin as a lyophilized powder, which keeps it stable in transit. Store sealed vials at -20°C, and skip the freeze-thaw cycles. Reconstitute under sterile technique with a protocol-appropriate diluent right before use.",
          "Sermorelin gets cleaved by DPP-IV in biological matrices.[3] For stability or pharmacokinetic protocols, log diluent lot, reconstitution date, storage temperature, and sampling time points in the ELN. Keep those preparation records auditable against the batch [Certificate of Analysis](/coa-library) and the [Growth Hormone Axis](/category/growth-hormone-axis) category's other GHRH- and GHRP-class reagents.",
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
    authorId: "editorial-team",
    updatedAt: "2026-08-14",
  },
};

export function getProductResearchDetail(
  parentHandle: string,
): ProductResearchDetail | null {
  return PRODUCT_RESEARCH_DETAIL[parentHandle] || null;
}
