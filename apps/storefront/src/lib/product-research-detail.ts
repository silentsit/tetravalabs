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
  mazdutide: {
    shortDescription: [
      "Mazdutide is a synthetic peptide that activates both the GLP-1 receptor and the glucagon receptor at once. It's modeled on oxyntomodulin, a gut hormone that does the same thing naturally, and it carries the development codes IBI362 and LY3305677 from its Eli Lilly and Innovent Biologics research programs.[1]",
      "Tetrava Labs sells mazdutide as a sterile, lyophilized reagent for laboratory research only, not the approved drug product sold elsewhere. Labs use it to study dual-agonist receptor signaling, hepatic fat metabolism, and comparative work against other incretin peptides such as [semaglutide](/buy-semaglutide-online), [tirzepatide](/buy-tirzepatide-online), and [retatrutide](/buy-retatrutide-online). The identity fields in the table above are cross-referenced against the PubChem compound record for mazdutide.[7] Every lot ships with third-party HPLC-verified identity and purity data. This compound is sold strictly for research use. It is not for human or veterinary consumption.",
    ],
    otherKnownTitles: [
      "IBI362",
      "LY3305677",
      "OXM3",
      "Xinermei (approved brand name, China)",
    ],
    sections: [
      {
        heading: "Mazdutide's dual GLP-1/glucagon mechanism",
        paragraphs: [
          "Mazdutide was discovered by Eli Lilly and licensed to Innovent Biologics for development in China.",
          "It works by activating two receptors at once: the GLP-1 receptor, which slows gastric emptying and drives glucose-dependent insulin secretion, and the glucagon receptor, which pushes the liver toward fat oxidation and raises energy expenditure.[1] That second receptor is what separates mazdutide from single-target GLP-1 drugs like semaglutide. Activating glucagon receptors on its own tends to raise blood sugar, so the GLP-1 side of the molecule has to offset that effect while still driving the appetite and gastric-emptying changes tied to weight loss.[1]",
          "Labs studying dual-agonist pharmacology often run mazdutide alongside [semaglutide](/buy-semaglutide-online) as a single-receptor comparator, since isolating which effect comes from which receptor is most of the analytical work.",
        ],
      },
      {
        heading: "Mazdutide vs tirzepatide",
        paragraphs: [
          "Mazdutide and tirzepatide are both once-weekly dual-receptor agonists, but they pair GLP-1 with different second receptors. Tirzepatide activates GLP-1 and GIP. Mazdutide activates GLP-1 and glucagon. GIP mainly improves insulin sensitivity; glucagon mainly drives hepatic fat oxidation and thermogenesis. The two molecules are solving a similar problem from different angles.[1]",
          "No trial has put mazdutide head-to-head against tirzepatide. A 2025 network meta-analysis pooling 24 trials and more than 9,000 participants found mazdutide and tirzepatide produced comparable HbA1c reductions in people with type 2 diabetes, while tirzepatide's pooled weight-loss effect came out larger.[5] Cross-trial comparisons like this carry the usual caveat: different trial populations, doses, and durations, not a controlled comparison in the same patients.",
        ],
      },
      {
        heading: "Mazdutide vs retatrutide",
        paragraphs: [
          "Retatrutide adds a third receptor, GIP, on top of the same GLP-1/glucagon pairing mazdutide uses. That makes it a triple agonist instead of a dual one. In the same 2025 network meta-analysis, retatrutide's pooled weight-loss effect (-11.91 kg) came out larger than mazdutide's (-5.31 kg).[5] The extra receptor target is the likely reason, though neither trial was designed to isolate it.",
          "Retatrutide remains investigational everywhere, still moving through Eli Lilly's TRIUMPH trial program. Mazdutide is further along administratively: it holds two NMPA approvals in China. No published trial has tested mazdutide against retatrutide directly, so any weight-loss comparison between the two is cross-trial, not head-to-head.",
        ],
      },
      {
        heading: "What clinical trials have measured for mazdutide",
        paragraphs: [
          "Two completed Phase 3 trials anchor most of the public data. GLORY-1 randomized adults in China to 4 mg or 6 mg mazdutide against placebo for 48 weeks; both doses produced clinically relevant weight loss and favorable changes across prespecified cardiometabolic measures, with gastrointestinal events as the most common side effect.[2]",
          "GLORY-2 tested a 9 mg dose against placebo for 60 weeks in adults with obesity. Mean body weight fell 18.5% in the mazdutide group versus 3.0% with placebo, and the trial also reported improvements in blood pressure, lipids, and serum uric acid.[3] In a head-to-head trial against semaglutide 1 mg presented at the 2026 American Diabetes Association Scientific Sessions, mazdutide 6 mg produced a larger HbA1c reduction and a higher rate of combined glycemic-and-weight-loss response; that result comes from a company-reported conference presentation, not yet a peer-reviewed publication.[4]",
          "Separately, exploratory work in a diabetic mouse model reported that mazdutide improved spatial-memory performance and myelin-integrity markers in the hippocampus. That's a mechanistic finding in animals, not evidence of a cognitive effect in humans.[6]",
        ],
      },
      {
        heading: "What is mazdutide peptide used for in research?",
        paragraphs: [
          "In the Tetrava Labs catalog, mazdutide sits in [GLP-1 Research](/category/glp-1-research), the same category as semaglutide, tirzepatide, and retatrutide. Labs studying this class typically design receptor-binding assays, cAMP second-messenger readouts, glucose-handling models, and hepatic lipid-metabolism endpoints.[1] A single-receptor GLP-1 comparator alongside mazdutide is usually part of that design, since it's the fastest way to isolate the glucagon-driven effects from the GLP-1 ones.",
          "The compound sits at the intersection of two signaling pathways. Comparative protocols benefit from writing the receptor targets, dose, and comparator compound into the study design up front, rather than treating every GLP-1-class peptide as one interchangeable category.",
        ],
      },
      {
        heading:
          "Regulatory status: China approval and Tetrava's Research Use Only listing",
        paragraphs: [
          "Mazdutide received its first regulatory approval from China's National Medical Products Administration (NMPA) in June 2025, for chronic weight management, under the brand name Xinermei. A second NMPA approval, for glycemic control in adults with type 2 diabetes, followed in September 2025.[1] Neither approval extends outside China.",
          "It is not FDA-approved, and no U.S. new drug application has been publicly disclosed. Tetrava Labs' mazdutide listing is a Research Use Only laboratory reagent, not the approved Chinese drug product: it is not dispensed, prescribed, or described as a medication, and this page makes no dosing or treatment claims.",
        ],
      },
      {
        heading: "Mazdutide on Reddit",
        paragraphs: [
          "Because retail access to mazdutide is limited to China, most English-language Reddit discussion, on r/Peptides and r/Semaglutide, reads as analytical rather than experiential: people comparing published trial numbers, tracking the TRIUMPH and GLORY trial programs, or asking how mazdutide's glucagon component differs from tirzepatide's GIP component.",
          "That's a different texture than the anecdote-heavy threads you see for peptides with wider informal availability. It still isn't clinical evidence. Treat any first-person mazdutide report with the same skepticism you'd apply to an unverified vendor claim, and check whether the person citing a number is quoting an actual trial or repeating a forum summary of one.",
        ],
      },
      {
        heading: "Buying mazdutide for research: what to verify",
        paragraphs: [
          "Vendor quality is checkable before you buy mazdutide from anyone. Before you treat a supplier as qualified, look at:",
        ],
        bullets: [
          "Lot identity: does the listing give a batch/lot number that matches the Certificate of Analysis shipped with the vial, or is the PDF generic or reused?",
          "COA/HPLC traceability: is the COA from an independent third-party lab, reporting purity by area-under-curve HPLC rather than an in-house claim?",
          "Identity confirmation: does the COA or an accompanying mass-spec report confirm the compound's identity, not just a purity percentage?",
          "Storage and chain of custody: was the product shipped and stored consistent with a lyophilized peptide, with cold-chain notes where they apply?",
          "Support: can you get the underlying COA/HPLC report and reach someone who knows the lot, or is documentation withheld?",
          "If a vendor cannot produce a lot-specific COA on request for a currently listed batch, do not treat them as a qualified research supplier. Price and marketing copy do not fix that.",
        ],
      },
      {
        heading: "Reconstitution, storage, and documentation",
        paragraphs: [
          "Tetrava Labs ships mazdutide as a lyophilized powder, which keeps it stable during transport. Store sealed vials at -20°C, skip repeated freeze-thaw cycles, and reconstitute under sterile technique with a protocol-appropriate diluent right before use.",
          "Once reconstituted, store working solutions per your laboratory SOP and log diluent lot, reconstitution date, and operator in your ELN, so preparation conditions stay auditable against the batch [Certificate of Analysis](/coa-library).",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "Shirley M. Mazdutide: first approval. Drugs. 2025;85(12):1621-1627.",
        url: "https://pubmed.ncbi.nlm.nih.gov/41028652/",
      },
      {
        id: 2,
        citation:
          "Ji L, Jiang H, Bi Y, et al. Once-weekly mazdutide in Chinese adults with obesity or overweight. N Engl J Med. 2025;392(22):2215-2225.",
        url: "https://doi.org/10.1056/NEJMoa2411528",
      },
      {
        id: 3,
        citation:
          "Ji L, Gao L, Jiang H, et al. Treatment with 9-mg mazdutide for weight reduction in Chinese adults with obesity: the GLORY-2 randomized clinical trial. JAMA. 2026;336(5):e268427.",
        url: "https://pubmed.ncbi.nlm.nih.gov/42251595/",
      },
      {
        id: 4,
        citation:
          "Innovent Biologics. Innovent presents results of the Phase 3 DREAMS-3 head-to-head trial of mazdutide versus semaglutide at the 2026 ADA Scientific Sessions [media release]. Jun 8, 2026.",
        url: "https://en.innoventbio.com/InvestorsAndMedia/PressReleaseDetail?key=604",
      },
      {
        id: 5,
        citation:
          "Liu S, Hu J, Zhao C, Liu H, He C. Comparative efficacy of incretin drugs on glycemic control, body weight, and blood pressure in adults with overweight or obesity and with/without type 2 diabetes: a systematic review and network meta-analysis. Front Endocrinol (Lausanne). 2025;16:1513641.",
        url: "https://doi.org/10.3389/fendo.2025.1513641",
      },
      {
        id: 6,
        citation:
          "Dong W, Bai J, Yuan Q, et al. Mazdutide, a dual agonist targeting GLP-1R and GCGR, mitigates diabetes-associated cognitive dysfunction: mechanistic insights from multi-omics analysis. eBioMedicine. 2025;117:105791.",
        url: "https://doi.org/10.1016/j.ebiom.2025.105791",
      },
      {
        id: 7,
        citation:
          "National Center for Biotechnology Information. PubChem Compound Summary for CID 167312357, Mazdutide.",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/167312357",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-08-16",
  },
  "mots-c": {
    shortDescription: [
      "MOTS-c is a 16-amino-acid peptide encoded inside the mitochondrial genome itself, not the cell's nuclear DNA. It comes from a short reading frame nested in the MT-RNR1 gene, the same gene that makes the mitochondrial 12S ribosomal RNA. The name is short for Mitochondrial Open Reading Frame of the 12S rRNA-c.[1]",
      "Tetrava Labs supplies MOTS-c as a sterile, lyophilized reagent for laboratory research only. Labs use it to study AMPK-linked metabolic signaling, skeletal-muscle exercise adaptation, and insulin-sensitivity pathways in cell and animal models. The identity fields in the table above are cross-referenced against the PubChem compound record for MOTS-c.[6] Every lot ships with third-party HPLC-verified identity and purity data. This compound is sold strictly for research use. It is not for human or veterinary consumption.",
    ],
    otherKnownTitles: [
      "Mitochondrial Open Reading Frame of the 12S rRNA-c",
      "Mitochondrial-derived peptide MOTS-c",
      "MOTS-c (human)",
    ],
    sections: [
      {
        heading: "MOTS-c's mitochondrial-encoded mechanism",
        paragraphs: [
          "Most peptides a research lab handles are transcribed from nuclear DNA. MOTS-c isn't. It's translated from a short open reading frame inside the mitochondrial 12S rRNA gene, a discovery Lee and colleagues at USC published in 2015.[1]",
          "Once made, MOTS-c inhibits the cytoplasmic folate cycle. That inhibition causes an intermediate metabolite, AICAR, to build up, and AICAR is a well-characterized activator of AMP-activated protein kinase (AMPK).[1] AMPK is the cell's energy-sensing switch. Once active, it pushes skeletal muscle toward glucose uptake and fatty-acid oxidation instead of storage.",
          "In that original study, MOTS-c treatment reversed high-fat-diet-induced obesity and age-related insulin resistance in mice, without reducing food intake.[1] Labs running [AMPK-linked metabolic assays](/category/metabolic-mitochondrial) often pair MOTS-c with a folate-cycle or AICAR-pathway comparator to confirm the mechanism holds in their own model.",
          "MOTS-c isn't the only peptide of its kind. Lee's 2015 paper points out that it belongs to a small family of mitochondrial-derived peptides that also includes humanin and a group of related humanin-like peptides, all translated from short reading frames inside mtDNA that had mostly gone unnoticed before MOTS-c's discovery.[1]",
        ],
      },
      {
        heading: "MOTS-c vs SS-31: two different mitochondrial targets",
        paragraphs: [
          "MOTS-c and [SS-31](/buy-ss-31-online) both get grouped under \"mitochondrial peptides,\" but they don't do the same job. MOTS-c is a signaling molecule: made inside the mitochondria, it travels to the nucleus and switches on metabolic gene programs through AMPK.[1][2] SS-31 (elamipretide) is a synthetic tetrapeptide that binds cardiolipin, a lipid in the inner mitochondrial membrane, and physically stabilizes the electron transport chain rather than sending a signal anywhere.",
          "The two also sit at very different points on the evidence ladder. SS-31 has been through human Phase 3 trials. It missed its primary endpoints in the MMPOWER-3 trial for primary mitochondrial myopathy,[4] but a separate Barth-syndrome program supported an FDA accelerated approval in September 2025 under the brand name Forzinity, based on knee-extensor muscle-strength data.[5] MOTS-c has no equivalent human trial program. What's published on MOTS-c is mouse pharmacology plus a handful of small human studies measuring endogenous MOTS-c levels around exercise.[2][3] Comparative protocols should treat that gap as a real difference in evidence tier, not a rounding error.",
        ],
      },
      {
        heading: "What research has measured for MOTS-c peptide benefits",
        paragraphs: [
          "MOTS-c is best documented as an exercise-linked signal. In a 2021 human trial, a single bout of stationary cycling raised MOTS-c protein about 11.9-fold in skeletal muscle, and roughly 1.5- to 1.6-fold in circulating plasma, before returning close to baseline after four hours of rest.[2]",
          "In mice from the same study, two weeks of daily MOTS-c injection (15 mg/kg) roughly doubled treadmill running time and more than doubled running distance in both middle-aged and old animals. A separate late-life cohort, started at 23.5 months and dosed intermittently three times a week, showed increased physical capacity and a trend toward longer lifespan.[2]",
          "A 2022 study looked at a different question: training-induced accumulation rather than an injected dose. MOTS-c protein built up in trained rodent muscle after four to eight weeks of voluntary running, and that buildup persisted through several weeks of detraining. In the same paper, a single 15 mg/kg dose given to untrained mice improved total running time by 12% and distance by 15% on an acute treadmill test.[3]",
          "None of this is human dosing data. It's animal pharmacology describing what the molecule does in a mouse model, at a mouse-scaled dose, plus a small human study measuring an endogenous response to exercise rather than an injected dose.",
        ],
      },
      {
        heading: "Timing MOTS-c in a research protocol",
        paragraphs: [
          "\"Best time to take MOTS-c\" isn't a question this page can answer, since MOTS-c isn't an approved product with a human dosing schedule. What the published research does describe is timing relative to an exercise challenge, not time of day.",
          "In the human cycling study, MOTS-c rose sharply during and immediately after the exercise bout and drifted back toward baseline by the four-hour mark.[2] That drop-off lines up with a short circulating half-life, though the 2021 paper measured levels at fixed timepoints rather than running a formal clearance study. In the mouse acute-performance study, the single dose was administered before the treadmill challenge, not on a fixed daily clock.[3] If a protocol involves exercise-adjacent sampling, build collection timepoints around the exercise bout itself. A design that fixes clock time without controlling for exercise proximity will likely add noise that has nothing to do with the compound.",
        ],
      },
      {
        heading: "MOTS-c peptide on Reddit",
        paragraphs: [
          "r/Peptides has an active MOTS-c thread culture, and dosage questions dominate it: how much to reconstitute, how often to inject, whether to stack it with SS-31 or other metabolic peptides. Most of that content is anecdotal self-report, not sourced to a trial.",
          "Reddit is a reasonable place to find the Lee 2015 and Reynolds 2021 papers cited secondhand. It's a weak place to find an accurate dose-response curve. If a thread states a specific number as fact, check whether it traces back to the mouse studies cited above. A mouse mg/kg dose doesn't translate to a human number by simple arithmetic, and this page doesn't offer that conversion.",
        ],
      },
      {
        heading: "Buying MOTS-c for research: what to verify",
        paragraphs: [
          "Vendor quality is checkable before you buy MOTS-c from anyone. Before you treat a supplier as qualified, look at:",
        ],
        bullets: [
          "Lot identity: does the listing give a batch/lot number that matches the Certificate of Analysis shipped with the vial, or is the PDF generic or reused?",
          "COA/HPLC traceability: is the COA from an independent third-party lab, reporting purity by area-under-curve HPLC rather than an in-house claim?",
          "Identity confirmation: does the COA or an accompanying mass-spec report confirm the compound's identity, not just a purity percentage?",
          "Storage and chain of custody: was the product shipped and stored consistent with a lyophilized peptide, with cold-chain notes where they apply?",
          "Support: can you get the underlying COA/HPLC report and reach someone who knows the lot, or is documentation withheld?",
          "If a vendor cannot produce a lot-specific COA on request for a currently listed batch, do not treat them as a qualified research supplier. Price and marketing copy do not fix that.",
        ],
      },
      {
        heading: "Reconstitution, storage, and documentation",
        paragraphs: [
          "Tetrava Labs ships MOTS-c as a lyophilized powder, which keeps it stable during transport. Store sealed vials at -20°C, skip repeated freeze-thaw cycles, and reconstitute under sterile technique with a protocol-appropriate diluent right before use.",
          "Once reconstituted, store working solutions per your laboratory SOP and log diluent lot, reconstitution date, and operator in your ELN, so preparation conditions stay auditable against the batch [Certificate of Analysis](/coa-library).",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "Lee C, Zeng J, Drew BG, et al. The mitochondrial-derived peptide MOTS-c promotes metabolic homeostasis and reduces obesity and insulin resistance. Cell Metab. 2015;21(3):443-454.",
        url: "https://pubmed.ncbi.nlm.nih.gov/25738459/",
      },
      {
        id: 2,
        citation:
          "Reynolds JC, Lai RW, Woodhead JST, et al. MOTS-c is an exercise-induced mitochondrial-encoded regulator of age-dependent physical decline and muscle homeostasis. Nat Commun. 2021;12:470.",
        url: "https://doi.org/10.1038/s41467-020-20790-0",
      },
      {
        id: 3,
        citation:
          "Hyatt JK. MOTS-c increases in skeletal muscle following long-term physical activity and improves acute exercise performance after a single dose. Physiol Rep. 2022;10(13):e15377.",
        url: "https://doi.org/10.14814/phy2.15377",
      },
      {
        id: 4,
        citation:
          "Karaa A, Bertini E, Carelli V, et al. Efficacy and safety of elamipretide in individuals with primary mitochondrial myopathy: the MMPOWER-3 randomized clinical trial. Neurology. 2023;101(3):e238-e252.",
        url: "https://pubmed.ncbi.nlm.nih.gov/37268435/",
      },
      {
        id: 5,
        citation:
          "U.S. Food and Drug Administration. FDA grants accelerated approval to first treatment for Barth syndrome [press release]. Sep 19, 2025.",
        url: "https://www.fda.gov/news-events/press-announcements/fda-grants-accelerated-approval-first-treatment-barth-syndrome",
      },
      {
        id: 6,
        citation:
          "National Center for Biotechnology Information. PubChem Compound Summary for CID 146675088, Mots-c.",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/146675088",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-08-16",
  },
  retatrutide: {
    shortDescription: [
      "Retatrutide is a synthetic peptide that activates three different metabolic receptors at once: GLP-1, GIP, and glucagon. Eli Lilly's development code for it is LY3437943. Most of the field calls it a \"triple agonist,\" and it's the furthest along in that class of anything currently in a Phase 3 trial.[1]",
      "Tetrava Labs sells retatrutide as a sterile, lyophilized reagent for laboratory research only. It is not the investigational drug being tested in Lilly's TRIUMPH trials, and it is not available anywhere as an approved medication. Labs use this listing to study triple-receptor signaling, comparative incretin pharmacology, and hepatic lipid metabolism in cell and animal models. The identity fields in the table above are cross-referenced against the PubChem compound record for retatrutide.[7] Every lot ships with third-party HPLC-verified identity and purity data. This compound is sold strictly for research use. It is not for human or veterinary consumption.",
    ],
    otherKnownTitles: ["LY3437943", "LY-3437943", "retatrutide [INN]"],
    sections: [
      {
        heading: "What retatrutide does",
        paragraphs: [
          "Retatrutide binds three metabolic receptors at the same time: GLP-1, GIP, and glucagon.[1] In trial and laboratory work, that combination is studied for insulin secretion, gastric emptying, hepatic fat oxidation, and energy expenditure.",
          "The peptide is built around a GLP-1 backbone, the same peptide scaffold behind semaglutide and tirzepatide, modified so it also binds and activates the GIP receptor and the glucagon receptor.[1] Three receptors, three separate jobs: GLP-1 slows gastric emptying and drives glucose-dependent insulin release, GIP improves insulin sensitivity and fat-cell signaling, and glucagon pushes the liver toward fat oxidation and raises resting energy expenditure.",
          "That third receptor, glucagon, is what separates retatrutide from GLP-1/GIP dual agonists like tirzepatide. Activating glucagon receptors alone tends to raise blood glucose, so the molecule has to lean on its GLP-1 and GIP activity to keep glycemic control intact while still getting the metabolic-rate boost that glucagon signaling provides.[1] A 2023 Phase 2 trial reported an 86% reduction in liver fat content at the highest dose, a magnitude larger than what's typically reported for GLP-1-only or dual-agonist compounds, and mechanistically consistent with the added glucagon-receptor activity.[2]",
          "Labs studying triple-agonist pharmacology typically run retatrutide alongside a single-receptor GLP-1 comparator and a dual-agonist comparator such as [tirzepatide](/buy-tirzepatide-online), since isolating which effect comes from which receptor is most of the analytical work in this compound class.",
        ],
      },
      {
        heading: "Retatrutide vs tirzepatide",
        paragraphs: [
          "Retatrutide and [tirzepatide](/buy-tirzepatide-online) share the same GLP-1/GIP foundation. Retatrutide adds a third receptor, glucagon, on top of it. No published trial has tested the two head-to-head. What exists is cross-trial comparison: in retatrutide's Phase 3 TRIUMPH-1 trial, the 12 mg dose produced 28.3% mean weight loss at 80 weeks;[3] tirzepatide's Phase 3 SURMOUNT-1 trial reported roughly 22.5% at 72 weeks in its highest-dose arm. Different trials, different populations, different durations, so that gap is suggestive, not conclusive.",
          "Tirzepatide has the regulatory head start. It's FDA-approved under the brand names Mounjaro and Zepbound. Retatrutide has none of that: it remains investigational, still moving through Lilly's Phase 3 TRIUMPH program, with no marketing application publicly accepted as of this writing. A 2025 NEJM trial, SURMOUNT-5, did run tirzepatide against semaglutide head-to-head and found tirzepatide's weight-loss effect larger,[4] which is the closest published data gets to ranking this drug class, and it still doesn't include retatrutide.",
        ],
      },
      {
        heading: "Retatrutide vs semaglutide (and Ozempic/Wegovy)",
        paragraphs: [
          "Semaglutide, sold under the brand names Ozempic and Wegovy, activates GLP-1 only. Retatrutide activates GLP-1, GIP, and glucagon. On paper that's a wider mechanism, and the trial numbers line up with that: semaglutide's Phase 3 STEP program topped out around 14.9% weight loss at 68 weeks, versus retatrutide's 28.3% at 80 weeks in TRIUMPH-1.[3] Again, these are separate trials run years apart on different populations, not a controlled comparison in the same patients.",
          "Semaglutide has the longer track record. It carries FDA approval, a cardiovascular-outcomes label from the SELECT trial, and years of real-world prescribing data behind it. Retatrutide has none of that yet. It's a data-rich investigational molecule, not an interchangeable substitute, and this page does not present it as one.",
        ],
      },
      {
        heading: "What clinical trials have measured for retatrutide",
        paragraphs: [
          "The Phase 2 trial that put retatrutide on the map, published in the New England Journal of Medicine in 2023, reported up to 24.2% weight loss at 48 weeks on the 12 mg dose, alongside the liver-fat and glycemic findings noted above.[2] Lilly's Phase 3 TRIUMPH program has since reported two trials. TRIUMPH-1, the main obesity trial (n=2,339), found 80-week weight loss of 19.0%, 25.9%, and 28.3% across the 4 mg, 9 mg, and 12 mg arms, versus 2.2% on placebo; a prespecified extension in participants with baseline BMI ≥35 reached 30.3% at 104 weeks on the 12 mg dose.[3] TRIUMPH-4, in adults with obesity and knee osteoarthritis, reported 28.7% weight loss at 68 weeks alongside a 4.5-point reduction in WOMAC pain score.[5]",
          "On the safety side, discontinuation due to adverse events in TRIUMPH-1 was lower at the 4 mg dose than at higher doses, and gastrointestinal events, nausea, diarrhea, constipation, are the most consistently reported side effects across every retatrutide trial published so far, matching the pattern seen with other incretin-receptor agonists.[2][3] None of the published trials describe an at-home or self-administered dosing schedule for lay use. The dose-escalation schema used in TRIUMPH-1 started participants at a low dose and stepped up on a fixed schedule under clinical-trial supervision, which is a controlled research protocol, not a set of instructions for individual use.[3]",
          "Two more TRIUMPH trials, in type 2 diabetes and obstructive sleep apnea, have also reported topline results, and additional readouts are expected through 2026 as Lilly's Phase 3 program completes.[6]",
        ],
      },
      {
        heading: "Is retatrutide safe? Side effects reported in trials",
        paragraphs: [
          "There is no FDA safety determination for retatrutide, because there is no FDA approval. The numbers that exist come from supervised clinical trials, not from informal use of research reagents.",
          "In the 2023 Phase 2 NEJM trial, gastrointestinal events were the most common: nausea, diarrhea, vomiting, and constipation. Most of those events were mild to moderate, most of them happened during dose escalation, and they were the usual reason participants discontinued.[2] Heart rate rose in a dose-dependent way, peaked around week 24, then declined.[2]",
          "Headache appeared in the trial supplement's less-common events table (Table S10), not in the paper's main safety table. Incidence was 0% on placebo, 11.4% in one 8 mg arm, 6.5% in the 12 mg arm, and 3.3% of all participants.[2] That is enough to say headache was recorded. It is not enough to call mild headaches a defining or expected effect, and it is not a finding about Tetrava's Research Use Only listing.",
        ],
      },
      {
        heading: "Is retatrutide FDA approved, and how do you get it?",
        paragraphs: [
          "No. Retatrutide is not FDA-approved, has no brand name, and is not legally available as a prescription medication anywhere. In July 2026 Lilly said it plans to submit a Biologics License Application in the first quarter of 2027.[8] A planned filing is not an approval, and no application has been publicly accepted by the FDA as of this writing.",
          "The only sanctioned way to receive retatrutide as a treatment is enrollment in one of Lilly's TRIUMPH trials. ClinicalTrials.gov lists current status and eligibility under identifiers including NCT05929066 (TRIUMPH-1) and NCT05931367 (TRIUMPH-4).",
          "\"Where to buy retatrutide\" and \"where to get retatrutide\" searches often mean a pharmacy or a gray-market vial for personal use. Tetrava Labs does not sell it for that. The listing on this page is a Research Use Only laboratory reagent for qualified lab procurement, not a consumer weight-loss product, and this page makes no treatment, dosing, or pricing claims tied to human use.",
        ],
      },
      {
        heading: "Retatrutide price, cost, and what a research listing actually reflects",
        paragraphs: [
          "\"Retatrutide price per month\" and \"retatrutide availability and cost\" are questions built for a prescription drug with a pharmacy price and an insurance formulary. Retatrutide doesn't have either of those yet, since it isn't approved. The number that does exist is the catalog price for the RUO research reagent on this page, shown in the purchase panel above, priced per vial for laboratory use, not as a monthly treatment cost.",
          "Unregulated online sellers marketing retatrutide with per-month pricing, dosing charts, or \"starter kit\" language are describing human use of an unapproved compound, not a laboratory reagent purchase. Evaluate any such listing the same way you'd evaluate an unverified supplement claim: does it publish a lot-specific Certificate of Analysis, or just a price and a promise?",
        ],
      },
      {
        heading: "Retatrutide on Reddit",
        paragraphs: [
          "Retatrutide has one of the more active peptide-research threads on Reddit, split roughly into two camps: people tracking the TRIUMPH trial readouts and cross-posting Lilly's press releases, and people discussing personal sourcing, pricing, and vendor comparisons for unregulated retatrutide products. The second category sits well outside what this page covers or endorses.",
          "\"Retatrutide dosing reddit\" and \"retatrutide side effects reddit\" threads mix real trial data with unverified self-reports. A number quoted on Reddit is only as good as its source. If a thread states a weight-loss percentage or a side-effect rate as fact, check whether it traces back to a named TRIUMPH trial (like the ones cited above) or to an anonymous forum post. Long-term-effects claims are especially prone to this: no published trial has followed retatrutide participants long enough to make a durable long-term-safety claim, TRIUMPH-1's longest reported window is 104 weeks, so any \"long term effects\" thread claiming otherwise is extrapolating past the data.",
        ],
      },
      {
        heading: "Buying retatrutide for research: what to verify",
        paragraphs: [
          "Retatrutide's popularity has pulled in a wide range of online sellers, some legitimate research suppliers, some marketing an unapproved compound for human use with no regulatory oversight. Before you treat any vendor, including Tetrava Labs, as a qualified research supplier, verify:",
        ],
        bullets: [
          "Lot identity: does the listing give a batch/lot number that matches the Certificate of Analysis shipped with the vial, or is the PDF generic or reused?",
          "COA/HPLC traceability: is the COA from an independent third-party lab, reporting purity by area-under-curve HPLC rather than an in-house claim?",
          "Identity confirmation: does the COA or an accompanying mass-spec report confirm the compound's identity, not just a purity percentage?",
          "Framing: does the listing describe a laboratory reagent, or does it market dosing schedules, monthly pricing, and human-use instructions for an unapproved compound?",
          "Storage and chain of custody: was the product shipped and stored consistent with a lyophilized peptide, with cold-chain notes where they apply?",
          "If a vendor cannot produce a lot-specific COA on request for a currently listed batch, do not treat them as a qualified research supplier. Price and marketing copy do not fix that.",
        ],
      },
      {
        heading: "How to reconstitute retatrutide in the lab",
        paragraphs: [
          "\"How much bac water for 10mg retatrutide\" is asking for a reconstitution recipe. This page does not publish one. Diluent volume is a laboratory protocol choice, written into the assay SOP, not a catalog constant attached to a 10 mg vial.",
          "Tetrava Labs ships retatrutide as a lyophilized powder. Store sealed vials at -20°C, skip repeated freeze-thaw cycles, and reconstitute under sterile technique with a protocol-appropriate diluent right before use. [Bacteriostatic water](/buy-bacteriostatic-water-online) is listed separately as a research solvent. It is not paired to any retatrutide SKU at a fixed milliliter amount.",
          "Once reconstituted, store working solutions per your laboratory SOP and log diluent lot, reconstitution date, concentration, and operator in your ELN, so preparation conditions stay auditable against the batch [Certificate of Analysis](/coa-library).",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "Coskun T, Urva S, Roell WC, et al. LY3437943, a novel triple glucagon, GIP, and GLP-1 receptor agonist for glycemic control and weight loss: from discovery to clinical proof of concept. Cell Metab. 2022;34(9):1234-1247.",
        url: "https://doi.org/10.1016/j.cmet.2022.07.013",
      },
      {
        id: 2,
        citation:
          "Jastreboff AM, Kaplan LM, Frias JP, et al. Triple-hormone-receptor agonist retatrutide for obesity: a Phase 2 trial. N Engl J Med. 2023;389(6):514-526.",
        url: "https://doi.org/10.1056/NEJMoa2301972",
      },
      {
        id: 3,
        citation:
          "Eli Lilly and Company. Lilly's triple agonist, retatrutide, delivered powerful weight loss in pivotal Phase 3 obesity trial (TRIUMPH-1) [press release]. May 21, 2026.",
        url: "https://www.prnewswire.com/news-releases/lillys-triple-agonist-retatrutide-delivered-powerful-weight-loss-in-pivotal-phase-3-obesity-trial-302778859.html",
      },
      {
        id: 4,
        citation:
          "Aronne LJ, Horn DB, le Roux CW, et al. Tirzepatide as compared with semaglutide for the treatment of obesity (SURMOUNT-5). N Engl J Med. 2025;393(1):26-36.",
        url: "https://doi.org/10.1056/NEJMoa2416394",
      },
      {
        id: 5,
        citation:
          "Eli Lilly and Company. Lilly's triple agonist, retatrutide, delivered weight loss along with substantial relief from osteoarthritis pain in first successful Phase 3 trial (TRIUMPH-4) [press release]. Dec 11, 2025.",
        url: "https://www.prnewswire.com/news-releases/lillys-triple-agonist-retatrutide-delivered-weight-loss-of-up-to-an-average-of-71-2-lbs-along-with-substantial-relief-from-osteoarthritis-pain-in-first-successful-phase-3-trial-302638804.html",
      },
      {
        id: 6,
        citation:
          "Eli Lilly and Company. Lilly's triple agonist, retatrutide, drove substantial improvements in weight, A1C, knee osteoarthritis pain, and obstructive sleep apnea [press release]. Jun 6, 2026.",
        url: "https://investor.lilly.com/node/54396/pdf",
      },
      {
        id: 7,
        citation:
          "National Center for Biotechnology Information. PubChem Compound Summary for CID 171390338, Retatrutide.",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/171390338",
      },
      {
        id: 8,
        citation:
          "Eli Lilly and Company. Lilly's triple agonist, retatrutide, successful in two additional Phase 3 obesity trials [press release]. Jul 23, 2026.",
        url: "https://www.prnewswire.com/news-releases/lillys-triple-agonist-retatrutide-successful-in-two-additional-phase-3-obesity-trials-delivering-significant-improvements-in-weight-and-a1c-302832674.html",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-08-17",
  },
};

export function getProductResearchDetail(
  parentHandle: string,
): ProductResearchDetail | null {
  return PRODUCT_RESEARCH_DETAIL[parentHandle] || null;
}
