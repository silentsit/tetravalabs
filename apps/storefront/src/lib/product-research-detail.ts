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
      "BPC-157 is short for Body Protection Compound-157. It's a synthetic pentadecapeptide, 15 amino acids, built from a partial and stabilized sequence of a gastroprotective protein first isolated from human gastric juice.[1]",
      "Tetrava Labs supplies BPC-157 as a sterile, lyophilized reagent for laboratory research only. Labs use it to study [tissue-repair signaling](/category/tissue-repair), angiogenesis, and gastrointestinal mucosal-protection models in cell and animal systems. The molecular formula, weight, and sequence listed below are cross-referenced against the PubChem compound record for BPC-157.[10] Every lot ships with third-party HPLC-verified identity and purity data. This compound is sold strictly for research use. It is not for human or veterinary consumption.",
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
        heading: "BPC-157 and the increased expression of VEGFR2",
        paragraphs: [
          "Chick chorioallantoic membrane and endothelial tube-formation assays show that BPC-157 increases vessel density and speeds up blood-flow recovery in the ischemic hindlimb muscle of rats.[2] The same study reported higher expression of vascular endothelial growth factor receptor 2 (VEGFR2), plus time-dependent activation of the VEGFR2-Akt-eNOS signaling cascade. That cascade is tied to nitric-oxide-mediated endothelial function.[2]",
          "Labs modeling angiogenesis in tissue-repair protocols often reference this pathway. It comes up when designing VEGFR2 or nitric-oxide-synthase readouts, and when picking endothelial cell lines for comparative screening.",
        ],
      },
      {
        heading: "BPC-157 speeds up fibroblast migration",
        paragraphs: [
          "In cultured rat Achilles tendon fibroblasts, BPC-157 sped up ex vivo tendon-explant outgrowth, increased cell survival under oxidative (H2O2) stress, and increased fibroblast migration in transwell assays in a dose-dependent way.[3] The same study tied that migratory effect to higher phosphorylation of focal adhesion kinase (FAK) and paxillin, two proteins involved in cytoskeletal reorganization and cell adhesion, with no matching change in total protein levels.[3]",
          "Researchers cite this mechanism in [comparative tendon-repair study designs](/category/tissue-repair) alongside growth-factor controls like bFGF or EGF. BPC-157 is also commonly paired with [TB-500](/buy-tb-500-online) in combined tissue-repair protocols, worth knowing when you structure a dose-response migration assay.",
        ],
      },
      {
        heading: "BPC-157 increases GHR mRNA and protein",
        paragraphs: [
          "A cDNA microarray screen of BPC-157-treated tendon fibroblasts flagged growth hormone receptor (GHR) as one of the most strongly up-regulated genes.[4] Follow-up assays found dose- and time-dependent increases in GHR mRNA and protein. Adding exogenous growth hormone to BPC-157-treated cultures also activated the Janus kinase 2 (JAK2) pathway downstream, a combination tied to increased fibroblast proliferation.[4]",
          "Researchers studying GHR-JAK2 crosstalk in tendon models may find this pairing useful for designing co-treatment or sequential-exposure protocols.",
        ],
      },
      {
        heading:
          "BPC-157 and quadriceps myotendinous junction recovery",
        paragraphs: [
          "Researchers surgically dissected the quadriceps myotendinous junction in rats, an injury that does not heal on its own. Intraperitoneal and oral BPC-157 regimens were tied to full functional recovery, reversed the progressive muscle atrophy, and resolved the defect structurally by postoperative day 42.[5]",
          "A 2025 systematic review of 36 studies, 35 preclinical and 1 clinical, concluded that BPC-157 modulates growth hormone receptor expression along with angiogenic and inflammatory-cytokine pathways across muscle, tendon, ligament, and bone injury models in animal research.[8] The same review was direct about the gap: the evidence base is still dominated by preclinical, level IV-V study designs.",
        ],
      },
      {
        heading: "BPC-157 and gastrointestinal mucosal protection research",
        paragraphs: [
          "BPC-157 was first characterized in work on gastric-juice-derived cytoprotective compounds. Most of the foundational literature centers on gastrointestinal ulcer, fistula, and mucosal-injury models in rats.[1] Review papers describe consistent protective findings across these GI-injury models, tied in part to modulation of the nitric-oxide system and interaction with several neurotransmitter pathways. The exact upstream mechanism still isn't fully worked out.[1]",
        ],
      },
      {
        heading: "BPC-157 oral vs injection",
        paragraphs: [
          "Most synthetic peptides longer than 8 to 10 amino acids lose most of their bioactivity when given orally. Gastric acid and digestive proteases break down the peptide backbone before much of it survives into systemic circulation. BPC-157 is a documented exception. Because the sequence is a stabilized fragment of a native human gastric-juice protein, review literature reports it stays structurally intact in human gastric juice for more than 24 hours in vitro.[1][12] That stability is unusual among peptide research compounds, and it's the mechanistic reason researchers study BPC-157 through oral gavage or drinking-water protocols alongside injectable routes.",
          "Direct within-study comparisons of the two routes are rare. One 2008 rat colocutaneous-fistula study is a useful reference point: researchers dosed BPC-157 either continuously in drinking water or once daily by intraperitoneal injection, at matched doses of 10 micrograms per kilogram or 10 nanograms per kilogram, then assessed fistula closure macroscopically, microscopically, biomechanically, and functionally over a 28-day follow-up.[11] Both routes healed the colonic and skin defects to a comparable degree. A separate rat model of the surgically dissected quadriceps myotendinous junction found the same pattern for a systemic musculoskeletal endpoint: intraperitoneal and oral regimens were both tied to full functional recovery.[5] Neither study measured comparative bioavailability, though, and no controlled human pharmacokinetic study has quantified how much intact peptide reaches systemic circulation after an oral dose. Comparable outcomes in these specific rodent protocols shouldn't be read as interchangeable across every endpoint, species, or dose.",
          "In practical terms, oral or intragastric dosing fits BPC-157's original GI-tract research context best, since it reaches the luminal mucosa directly and avoids the injection-site trauma that can confound skin- or gut-healing designs. Injection (IP, SC, or IM) stays the default choice in the receptor- and growth-factor-signaling studies cited above, because it bypasses the GI tract entirely and delivers a known, individually controlled dose. That oral stability is compound-specific, too: it hasn't been documented for [TB-500](/buy-tb-500-online), which Tetrava also supplies for combined [tissue-repair protocols](/category/tissue-repair). Route choice should follow the protocol, not the other way around. Tetrava Labs supplies BPC-157 as both a lyophilized vial for injectable research solutions and as [BPC-157 capsules](/buy-bpc-157-capsules-online) for oral-route protocols.",
        ],
      },
      {
        heading: "BPC-157 vs TB-500",
        paragraphs: [
          "Researchers often mention BPC-157 and TB-500 in the same breath, but they aren't the same kind of research subject. BPC-157 is one defined 15-amino-acid sequence with a molecular weight near 1,419 daltons. Material sold as TB-500 is different: mass-spectrometry analysis identified it as the N-terminal acetylated 17-23 fragment of thymosin beta-4 (Ac-LKKTETQ), weighing about 888 daltons, not the full 4,963-dalton protein the name implies.[13]",
          "That distinction matters for anyone designing a comparative protocol. Data collected under the label thymosin beta-4 in older literature usually refers to the full-length protein, not the short fragment identified in TB-500 vials, so the two datasets shouldn't be treated as interchangeable.[13] Both compounds also carry the same regulatory status: the FDA placed BPC-157 and the thymosin beta-4 fragment on its Category 2 significant-safety-risk bulk drug substance list in 2023, and both remain Research Use Only.[14] Tetrava Labs supplies BPC-157 and [TB-500](/buy-tb-500-online) as separate research reagents, each with its own lot-specific COA. For a longer side-by-side, see [BPC-157 vs TB-500](/blog/bpc-157-vs-tb-500).",
        ],
      },
      {
        heading: "Central nervous system and traumatic brain injury models",
        paragraphs: [
          "One published study evaluated intraperitoneal BPC-157 in a mouse falling-weight traumatic brain injury (TBI) model.[6] Treated mice had lower 24-hour post-injury mortality and less severe hemorrhage and edema on gross and histological assessment. Outcomes improved further when the peptide was given prophylactically, before the injury.[6] That's still the only direct TBI dataset in the literature. Extrapolating beyond this single study, in a single species, calls for caution.",
        ],
      },
      {
        heading:
          "BPC-157 as it stands: preclinical weight vs human data",
        paragraphs: [
          "A common misconception treats the large rodent and cell-culture literature on BPC-157 as proof of human efficacy. Current systematic and narrative reviews say plainly that it isn't:",
        ],
        bullets: [
          "BPC-157 has no FDA approval, or approval from any comparable regulator, for human therapeutic use. Major anti-doping authorities prohibit it in professional sports.[8]",
          "Human data are limited to a small number of pilot-level, non-blinded studies. One retrospective case series looked at intra-articular injection for chronic knee pain: 14 of 16 patients reported relief beyond six months.[7]",
          "A 2025 systematic review found only one clinical-level study among 36 papers total, and no published in-human safety data, despite favorable preclinical toxicology.[8]",
          "A 2025 narrative review reached the same conclusion. It called BPC-157 investigational and asked for well-designed human trials before drawing clinical conclusions from animal data.[9]",
        ],
      },
      {
        heading:
          "Laboratory handling: reconstitution, storage, and documentation",
        paragraphs: [
          "Tetrava Labs ships BPC-157 as a lyophilized powder, which keeps it stable during transport. Store sealed vials at -20°C, skip repeated freeze-thaw cycles, and reconstitute under sterile technique with a protocol-appropriate diluent right before use. For more on how this compound compares to a related peptide, see [BPC-157 vs TB-500](/blog/bpc-157-vs-tb-500).",
          "Once reconstituted, store working solutions at 4°C and use them within the window your laboratory SOP defines. Record the diluent lot, reconstitution date, and operator in your ELN, so preparation conditions stay auditable alongside the batch [Certificate of Analysis](/coa-library).",
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
      {
        id: 13,
        citation:
          "Esposito S, Deventer K, Goeman J, Van der Eycken J, Van Eenoo P. Synthesis and characterization of the N-terminal acetylated 17-23 fragment of thymosin beta 4 identified in TB-500, a product suspected to possess doping potential. Drug Test Anal. 2012;4(9):733-738.",
        url: "https://doi.org/10.1002/dta.1402",
      },
      {
        id: 14,
        citation:
          "U.S. Food and Drug Administration. Certain Bulk Drug Substances for Use in Compounding That May Present Significant Safety Risks. 2023.",
        url: "https://www.fda.gov/drugs/human-drug-compounding",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-08-15",
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
