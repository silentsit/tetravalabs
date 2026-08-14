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
      "BPC-157, or Body Protection Compound-157, is a synthetic pentadecapeptide of 15 amino acids. It is a partial, stabilized sequence of a gastroprotective protein first isolated from human gastric juice.[1]",
      "Tetrava Labs supplies BPC-157 as a sterile, lyophilized reagent for in vitro and in vivo laboratory research into [tissue-repair signaling](/category/tissue-repair), angiogenesis, and gastrointestinal mucosal-protection models. Formula, weight, and sequence below are checked against the PubChem record for BPC-157.[10] Each lot ships with third-party HPLC identity and purity data. Sold for research use only. Not for human or veterinary consumption.",
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
        heading: "BPC-157 and VEGFR2 expression",
        paragraphs: [
          "Chick chorioallantoic membrane and endothelial tube-formation assays showed that BPC-157 increased vessel density and sped blood-flow recovery in ischemic hindlimb muscle of rats.[2] The same paper reported higher vascular endothelial growth factor receptor 2 (VEGFR2) expression and time-dependent activation of VEGFR2-Akt-eNOS signaling, which is tied to nitric-oxide-mediated endothelial function.[2]",
          "If you are running a VEGFR2 or nitric-oxide-synthase readout in endothelial cells, this is the usual citation.",
        ],
      },
      {
        heading: "BPC-157 and fibroblast migration",
        paragraphs: [
          "In cultured rat Achilles tendon fibroblasts, BPC-157 sped ex vivo tendon-explant outgrowth, raised cell survival under oxidative (H2O2) stress, and increased fibroblast migration in transwell assays in a dose-dependent way.[3] The migratory effect tracked with higher phosphorylation of focal adhesion kinase (FAK) and paxillin, proteins involved in cytoskeletal reorganization and cell adhesion. Total protein levels did not change.[3]",
          "Tendon-repair designs often put BPC-157 next to bFGF or EGF as growth-factor controls. Combined [tissue-repair protocols](/category/tissue-repair) also run it with [TB-500](/buy-tb-500-online).",
        ],
      },
      {
        heading: "BPC-157 increases GHR mRNA and protein",
        paragraphs: [
          "A cDNA microarray of BPC-157-treated tendon fibroblasts listed growth hormone receptor (GHR) among the most strongly up-regulated genes.[4] Follow-up assays showed dose- and time-dependent rises in GHR mRNA and protein. When the authors then added exogenous growth hormone to those pretreated cultures, the JAK2 pathway activated and fibroblast proliferation went up.[4]",
        ],
      },
      {
        heading: "Quadriceps myotendinous junction recovery in rats",
        paragraphs: [
          "Japjec et al. surgically cut the quadriceps myotendinous junction in rats, an injury that does not heal on its own. Intraperitoneal and oral BPC-157 regimens were both tied to full functional recovery, reversal of progressive muscle atrophy, and structural closure of the defect by postoperative day 42.[5]",
          "A 2025 systematic review of 36 studies (35 preclinical, 1 clinical) reported that BPC-157 changes growth hormone receptor expression plus angiogenic and inflammatory-cytokine pathways in animal muscle, tendon, ligament, and bone injury models. The authors also said the evidence base is still mostly preclinical (level IV-V).[8]",
        ],
      },
      {
        heading: "Gastrointestinal mucosal protection research",
        paragraphs: [
          "BPC-157 was first described in work on cytoprotective compounds from gastric juice. A lot of the early papers are rat ulcer, fistula, and mucosal-injury models.[1] Reviews report protective findings across those GI-injury models, in part through the nitric-oxide system and several neurotransmitter pathways. The upstream mechanism is still not fully worked out.[1]",
        ],
      },
      {
        heading: "BPC-157 oral vs injection",
        paragraphs: [
          "Most synthetic peptides longer than 8–10 amino acids lose most of their activity when given by mouth. Gastric acid and digestive proteases break down the backbone before much intact peptide reaches circulation. BPC-157 is a documented exception. The sequence is a stabilized fragment of a native human gastric-juice protein, and review papers report it stays structurally intact in human gastric juice for more than 24 hours in vitro.[1][12] That is why oral gavage and drinking-water protocols show up next to injectable routes in this literature.",
          "Head-to-head route comparisons inside a single study are rare. One 2008 rat colocutaneous-fistula paper is the cleanest example: BPC-157 was given either continuously in drinking water or once daily by intraperitoneal injection at matched doses (10 µg/kg or 10 ng/kg). Fistula closure was scored macroscopically, microscopically, biomechanically, and functionally over 28 days.[11] Both routes sped healing of the colonic and skin defects to a similar degree. The dissected-quadriceps model above showed the same pattern for a musculoskeletal endpoint: intraperitoneal and oral regimens were both tied to full functional recovery.[5]",
          "Neither study measured comparative bioavailability. No controlled human pharmacokinetic study has quantified how much intact peptide reaches circulation after oral dosing. Comparable outcomes in those two rodent protocols do not mean the routes are interchangeable across endpoints, species, or doses.",
          "Oral and intragastric dosing fits BPC-157's original GI-tract context: the peptide hits the luminal mucosa directly, and you avoid injection-site trauma that can confound skin- or gut-healing designs. Injection (IP/SC/IM) is still the default in the receptor and growth-factor papers cited above, because it skips the GI tract and delivers a known, individually controlled dose. That oral stability has not been documented for TB-500, which Tetrava also sells for combined [tissue-repair protocols](/category/tissue-repair). Pick the route that matches the protocol. Tetrava Labs sells BPC-157 as a lyophilized vial for injectable research solutions and as [BPC-157 capsules](/buy-bpc-157-capsules-online) for oral-route protocols.",
        ],
      },
      {
        heading: "Central nervous system and traumatic brain injury models",
        paragraphs: [
          "One published study gave intraperitoneal BPC-157 in a mouse falling-weight traumatic brain injury (TBI) model.[6] Treated mice had lower 24-hour post-injury mortality and less severe hemorrhage and edema on gross and histological exam. Outcomes were better when the peptide was given before injury.[6] That is still the only direct TBI dataset we found. Do not stretch it past one study and one species.",
        ],
      },
      {
        heading: "Preclinical evidence vs human data",
        paragraphs: [
          "A common misconception is that the large rodent and cell-culture literature on BPC-157 equals demonstrated human efficacy. The reviews do not support that.",
        ],
        bullets: [
          "BPC-157 is not approved by the FDA or any comparable regulator for human therapeutic use, and it is prohibited by major anti-doping authorities in professional sports.[8]",
          "Human data are limited to a handful of pilot-level, non-blinded studies. One retrospective case series of intra-articular injection for chronic knee pain reported that 14 of 16 patients had relief beyond six months.[7]",
          "A 2025 systematic review found only one clinical-level study among 36 included papers, and no published in-human safety data, even though preclinical toxicology looked favorable.[8]",
          "A 2025 narrative review called BPC-157 investigational and asked for well-designed human trials before anyone extrapolates from animal data into the clinic.[9]",
        ],
      },
      {
        heading: "Reconstitution, storage, and documentation",
        paragraphs: [
          "Tetrava Labs ships BPC-157 as a lyophilized powder so it stays stable in transit. Store sealed vials at -20°C. Do not freeze-thaw them over and over. Reconstitute under sterile technique with a protocol-appropriate diluent right before use. For compound context and handling notes, see [BPC-157 vs TB-500](/blog/bpc-157-vs-tb-500).",
          "Once reconstituted, keep working solutions at 4°C and use them inside the window in your laboratory SOP. Record diluent lot, reconstitution date, and operator in the ELN so prep conditions stay auditable next to the batch [Certificate of Analysis](/coa-library).",
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
    updatedAt: "2026-08-14",
  },
  sermorelin: {
    shortDescription: [
      "Sermorelin is the common name for GHRH(1-29)-NH2, a synthetic 29-amino-acid peptide with a C-terminal amide. It matches the amino-terminal stretch of the naturally occurring 44-residue human growth hormone-releasing hormone (GHRH).[1]",
      "Tetrava Labs supplies sermorelin as a sterile, lyophilized reagent for in vitro and in vivo laboratory research into growth-hormone-axis signaling, receptor pharmacology, and peptide-stability assays. Formula, weight, and sequence below are checked against the PubChem record for sermorelin.[7] Each lot ships with third-party HPLC identity and purity data. Sold for research use only. Not for human or veterinary consumption.",
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
          "Sermorelin is the first 29 residues of native human GHRH, with a C-terminal amide in place of the free acid. That amide change raises in vitro stability and leaves the receptor-binding region alone.[1] Guide to Pharmacology lists the sequence as Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-Gln, which matches the identity fields in the table below.",
          "This listing is the free peptide, not the acetate salt used in the old Geref formulation. Molecular weight and formula will not match an acetate-salt COA. It is also not full-length GHRH(1-44), and it is not somatropin (human growth hormone).",
        ],
      },
      {
        heading: "GHRH receptor signaling and pulsatile GH release",
        paragraphs: [
          "Sermorelin binds the growth-hormone-releasing hormone receptor (GHRHR) on pituitary somatotrophs, a G-protein-coupled receptor, and mimics endogenous GHRH to stimulate growth hormone (GH) release.[7] In healthy human subjects, intravenous and intranasal administration both produced dose-dependent GH release. Intravenous dosing produced peak GH within the first hour, and GH stayed elevated for about three hours after the dose.[2]",
          "Endogenous GH secretion is pulsatile, not a flat line. Single time-point GH sampling is a source of variance. The same study found no suppression of nocturnal GH pulsatility after repeated intranasal dosing, so assay design has to account for circadian and pulse-interval effects.[2]",
        ],
      },
      {
        heading: "Why the 29-residue fragment is short-lived: DPP-IV cleavage",
        paragraphs: [
          "The N-terminal Tyr-Ala bond in GHRH(1-29) is the main cleavage site for plasma dipeptidyl peptidase IV (DPP-IV). DPP-IV truncates the peptide to GHRH(3-29), which is largely inactive. A secondary trypsin-like cut at positions 12–13 accounts for a smaller share of total degradation.[1] That is why unmodified GHRH(1-29) analogs have short plasma half-lives in kinetic studies.",
          "Swapping D-Ala for the position-2 L-Ala, as some longer-acting GHRH analogs do, blocks the DPP-IV step. Controlled infusion studies showed a longer plasma half-life and a lower metabolic clearance rate than unmodified GHRH(1-29)-NH2.[3] If you are running a pharmacokinetic or stability protocol, write down protease inhibitors, processing speed, sampling times, and analog identity next to the batch [Certificate of Analysis](/coa-library). Otherwise degradation-rate comparisons are noise.",
          "GHRH(1-29) and its metabolites can be detected in plasma by immunoaffinity purification plus high-resolution LC-MS/MS. That method can tell intact peptide from GHRH(3-29).[4] Use it when you need to confirm integrity in a research sample. A purity percentage on a COA is not the same measurement.",
        ],
      },
      {
        heading: "Regulatory history and what this listing is",
        paragraphs: [
          "Sermorelin acetate was FDA-approved as Geref for the diagnosis and treatment of pediatric growth hormone deficiency. The manufacturer pulled it from the U.S. market in 2008. After a citizen petition, FDA published a March 2013 Federal Register notice that both Geref (sermorelin acetate) injection products were not withdrawn for safety or effectiveness reasons. That is a procedural finding. It is not a current marketing approval.[6]",
          "Geref trials mean the peptide has clinical-trial-level human pharmacology data. Tetrava's sermorelin is still sold only as a Research Use Only laboratory reagent. It is not dispensed, prescribed, or described as a medication. This page does not make dosing, treatment, or anti-aging claims.",
        ],
      },
      {
        heading: "Sermorelin vs CJC-1295, ipamorelin, and tesamorelin",
        paragraphs: [
          "Labs often file sermorelin next to CJC-1295, ipamorelin, and tesamorelin because all four touch the GH axis. They are not interchangeable controls.",
        ],
        bullets: [
          "[CJC-1295](/cjc-1295-without-dac) is a modified GHRH(1-29) analog built (with or without a Drug Affinity Complex, DAC) for a longer plasma half-life. Same receptor class, longer action, not a different mechanism.",
          "[Ipamorelin](/buy-ipamorelin-online) is a pentapeptide ghrelin-receptor (GHS-R1a) agonist. That is a different receptor from GHRHR. Combining the two probes a synergistic GH-secretagogue path, not an additive one.[5]",
          "[Tesamorelin](/buy-tesamorelin-online) is a stabilized GHRH(1-44) analog with a trans-3-hexenoic acid N-terminal modification. It is the only GHRH analog with an active FDA-approved indication (HIV-associated lipodystrophy). Sermorelin's history is discontinued-but-not-unsafe, which is a different regulatory status.[5][6]",
          "Receptor, half-life, and regulatory status all differ. Swapping one for another mid-protocol without re-checking dose-response and sampling intervals will confound comparative GH-axis data.",
        ],
      },
      {
        heading: "Sermorelin on Reddit",
        paragraphs: [
          "People searching \"sermorelin reddit\" usually land on r/Peptides or r/Sermorelin. The threads cluster around subjective sleep or recovery reports, informal vendor purity or dosing comparisons, and stacking with other GH-axis peptides.",
          "None of that is clinical evidence. Self-reported outcomes are unblinded and uncontrolled, and diet, training, and other compounds get in the way. Informal purity talk is not third-party HPLC-MS. Stacking anecdotes describe personal practice, not a validated protocol. Treat the threads as a source of hypotheses: which COA a poster names, which analytical method a claim rests on. Then check the lot paperwork.",
        ],
      },
      {
        heading: "Buying sermorelin for research: what to verify",
        paragraphs: [
          "Vendor quality is checkable. Before you treat a supplier as qualified, look at:",
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
        heading: "5 mg and 10 mg lot documentation",
        paragraphs: [
          "Tetrava Labs lists sermorelin in 5 mg and 10 mg vials, plus volume-tiered packs for labs running multi-vial protocols. The current documented lot is reported at 99% purity by HPLC. Cross-check the COA on your order against the [COA library](/coa-library). Lot numbers rotate as new batches are qualified and older stock sells through.",
          "Identity fields (CAS number, molecular formula, molecular weight, and sequence) for both strengths sit in the specifications table above. They come from the same lot records used to generate each batch COA, not from generic reference tables. Choose 5 mg vs 10 mg, and single-vial vs multi-vial, against that paperwork.",
        ],
      },
      {
        heading: "Reconstitution, storage, and documentation",
        paragraphs: [
          "Tetrava Labs ships sermorelin as a lyophilized powder so it stays stable in transit. Store sealed vials at -20°C. Do not freeze-thaw them over and over. Reconstitute under sterile technique with a protocol-appropriate diluent right before use.",
          "Sermorelin is cleaved by DPP-IV in biological matrices.[3] For stability or pharmacokinetic protocols, record diluent lot, reconstitution date, storage temperature, and sampling time points in the ELN. Keep preparation records auditable against the batch [Certificate of Analysis](/coa-library) and the [Growth Hormone Axis](/category/growth-hormone-axis) category's other GHRH- and GHRP-class reagents.",
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
