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
  /** Calendar date (`YYYY-MM-DD`) this research detail was last edited. Schema layer expands this to ISO 8601 with timezone. */
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
  "aod-9604": {
    shortDescription: [
      "AOD-9604 is a synthetic 16-amino-acid peptide built from the C-terminal end of human growth hormone, the stretch researchers commonly label hGH fragment 176-191. An extra tyrosine residue is added at the N-terminus for stability, which is why the catalog identity below lists it as Tyr-hGH(177-191); the two numbering conventions describe the same molecule.[1][7]",
      "Tetrava Labs supplies AOD-9604 as a sterile, lyophilized reagent for laboratory research on adipocyte lipolysis, lipogenesis, and comparative growth-hormone-fragment pharmacology. It is not the same product as native hGH, and it carries none of the growth-hormone-receptor activity that full-length hGH does.[4] Every lot ships with third-party HPLC-verified identity and purity data. Buy AOD-9604 online here for research use only; it is not for human or veterinary consumption.",
    ],
    otherKnownTitles: [
      "Anti-Obesity Drug 9604",
      "hGH Fragment 176-191",
      "hGH Fragment 177-191",
      "Tyr-hGH(177-191)",
      "AOD9604",
      "MP-104",
    ],
    sections: [
      {
        heading: "AOD-9604: isolating one domain of a 191-amino-acid hormone",
        paragraphs: [
          "Human growth hormone is a 191-amino-acid protein with several separate functional regions packed into one chain. One region near the amino terminus drives insulin-like, growth-promoting signaling. A different region, the carboxy terminus around residues 177-191, was flagged in early work as a lipid-mobilizing domain on its own, independent of the growth-promoting region.[1]",
          "Biochemist Frank M. Ng and colleagues at Monash University in Melbourne synthesized that C-terminal sequence directly and tested it against fat metabolism in the early 1990s, reporting that the isolated fragment reproduced hGH's antilipogenic activity in rat adipose tissue.[1] Metabolic Pharmaceuticals Ltd. later added the stabilizing tyrosine residue and advanced the resulting molecule, AOD-9604, into a multi-year obesity drug development program.",
        ],
      },
      {
        heading: "AOD-9604 mechanism of action: lipolysis without the growth signal",
        paragraphs: [
          "In obese mice, chronic AOD-9604 treatment cut cumulative body-weight gain and adipose-tissue mass, tracking closely with the effect of full-length hGH in the same model.[2] A related oral-dosing study in obese Zucker rats found that 500 micrograms per kilogram per day for 19 days reduced body-weight gain by more than half relative to untreated controls, with no adverse change in insulin sensitivity on metabolic testing.[3]",
          "The receptor story is the part that matters for anyone comparing this fragment to hGH itself. Full activation of the growth hormone receptor needs one hGH molecule to bridge two receptor molecules, using two separate binding sites on the hormone. AOD-9604 only covers part of one of those sites, so it can't trigger that dimerization.[5] Competition-binding assays confirmed AOD-9604 doesn't compete with hGH for the receptor, and a BaF3 cell-proliferation assay found no proliferative effect at any tested dose, even at concentrations far above what a lipolysis assay would use.[4]",
          "A chronic-treatment study in obese mice and beta-3-adrenergic-receptor knockout mice added another layer: both hGH and AOD-9604 raised beta-3-AR RNA expression in fat cells, and that receptor turned out to be necessary for the chronic weight and lipolysis response, since beta-3-AR knockout mice lost the chronic effect entirely. An acute fat-oxidation effect persisted even in the knockout animals, though, pointing to more than one pathway feeding into the same outcome.[4]",
        ],
      },
      {
        heading: "Human trials: six studies, about 900 subjects, one Phase 2b that missed its endpoint",
        paragraphs: [
          "Between 2001 and 2006, Metabolic Pharmaceuticals ran six randomized, double-blind, placebo-controlled trials of AOD-9604 in roughly 900 adult subjects, most of them clinically obese. The first two studies dosed the peptide intravenously; the remaining four used oral capsules or tablets.[6]",
          "A 12-week, 300-subject dose-ranging study (five oral doses from 1 to 30 mg daily) found that the 1 mg/day group lost an average of 2.6 kg, compared with 0.8 kg on placebo.[6][8] That looked promising enough to fund a bigger trial. The follow-up was a 24-week, double-blind, placebo-controlled study that randomized 502 obese adults to 0.25, 0.5, or 1 mg AOD-9604 daily or placebo.[6] It missed. Weight loss at 24 weeks did not reach statistical significance against placebo at any dose.[8] Metabolic Pharmaceuticals discontinued the obesity development program in 2007, and AOD-9604 has not advanced through a later-phase human obesity trial since.[8]",
        ],
      },
      {
        heading: "AOD-9604 oral vs injectable: what the trial record actually shows",
        paragraphs: [
          "Tetrava Labs' AOD-9604 catalog listing is a lyophilized vial, reconstituted under sterile technique for injectable-route laboratory research. That is worth separating clearly from the human trial record, because four of the six Metabolic Pharmaceuticals studies, including both long-term efficacy trials, dosed AOD-9604 as an oral capsule or tablet rather than an injection.[6] Oral bioavailability data for peptides this size is unusual, and most of the human evidence on AOD-9604 exists because of it.",
          "No published human trial has tested a nasal-spray formulation of AOD-9604. If a search turns up an AOD-9604 nasal spray for sale, that formulation doesn't trace back to the six registered trials summarized here, and Tetrava Labs doesn't stock one.",
        ],
      },
      {
        heading: "Reported side effects and safety signals in human trials",
        paragraphs: [
          "Headache was the single most common adverse event across the AOD-9604 trials, reported by roughly 70% of subjects in one single-dose obese-volunteer study, mild or moderate in nearly every case.[6] Gastrointestinal effects, diarrhea, flatulence, and nausea, showed up more often at the highest oral dose tested (54 mg) than at the lower doses used in the long-term efficacy trials. Nothing rose to a withdrawal. No study reported a treatment-related withdrawal or a serious adverse event judged possibly related to AOD-9604.[6]",
          "Because AOD-9604 is a fragment of hGH, the trials paid particular attention to the side effects tied to full-length hGH: elevated IGF-1, glucose intolerance, and antibody formation. None of the six studies found a statistically significant change in IGF-1 levels versus placebo, oral glucose tolerance testing showed no meaningful shift in glucose handling, and no anti-AOD-9604 antibodies turned up in any subject tested at any timepoint, including after 24 weeks of daily dosing.[6] That is trial-reported tolerability data from supervised, monitored studies. It isn't a safety guarantee for unsupervised use, and Tetrava Labs' RUO listing is a laboratory reagent, not the dosed clinical product.",
        ],
      },
      {
        heading: "Regulatory status: not FDA-approved, program discontinued in 2007",
        paragraphs: [
          "AOD-9604 has no FDA approval. None from any comparable regulator either, for weight loss or any other therapeutic indication. Review literature documents the 24-week Phase 2b trial as the reason the obesity program was discontinued in 2007.[8] Tetrava Labs' catalog listing has no connection to that discontinued drug-development program. It is sold strictly as a Research Use Only laboratory reagent for qualified researchers studying the fragment's pharmacology.",
        ],
      },
      {
        heading: "Laboratory handling: reconstitution, storage, and documentation",
        paragraphs: [
          "AOD-9604 ships as a lyophilized powder, which keeps it stable in transport. Store sealed vials at -20°C, avoid repeated freeze-thaw cycles, and reconstitute under sterile technique with a protocol-appropriate diluent immediately before use.",
          "After reconstitution, hold working solutions at 4°C and use them within the window your laboratory SOP sets. Record the diluent lot, reconstitution date, and operator in your ELN so preparation conditions line up with the lot [Certificate of Analysis](/coa-library). This is laboratory preparation guidance only, not dosing instruction.",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "Wu Z, Ng FM. Antilipogenic action of synthetic C-terminal sequence 177-191 of human growth hormone. Biochem Mol Biol Int. 1993;30(1):187-196.",
        url: "https://pubmed.ncbi.nlm.nih.gov/8358331/",
      },
      {
        id: 2,
        citation:
          "Natera SH, Jiang WJ, Ng FM. Reduction of cumulative body weight gain and adipose tissue mass in obese mice: response to chronic treatment with synthetic hGH 177-191 peptide. Biochem Mol Biol Int. 1994;33(5):1011-1021.",
        url: "https://pubmed.ncbi.nlm.nih.gov/7987248/",
      },
      {
        id: 3,
        citation:
          "Ng FM, Sun J, Sharma L, Libinaka R, Jiang WJ, Gianello R. Metabolic studies of a synthetic lipolytic domain (AOD9604) of human growth hormone. Horm Res. 2000;53(6):274-278.",
        url: "https://pubmed.ncbi.nlm.nih.gov/11146367/",
      },
      {
        id: 4,
        citation:
          "Heffernan M, Summers RJ, Thorburn A, Ogru E, Gianello R, Jiang WJ, Ng FM. The effects of human GH and its lipolytic fragment (AOD9604) on lipid metabolism following chronic treatment in obese mice and beta(3)-AR knock-out mice. Endocrinology. 2001;142(12):5182-5189.",
        url: "https://pubmed.ncbi.nlm.nih.gov/11713213/",
      },
      {
        id: 5,
        citation:
          "Cunningham BC, Ultsch M, De Vos AM, Mulkerrin MG, Clauser KR, Wells JA. Dimerization of the extracellular domain of the human growth hormone receptor by a single hormone molecule. Science. 1991;254(5033):821-825.",
        url: "https://pubmed.ncbi.nlm.nih.gov/1948064/",
      },
      {
        id: 6,
        citation:
          "Stier H, Vos E, Kenley D. Safety and tolerability of the hexadecapeptide AOD9604 in humans. J Endocrinol Metab. 2013;3(1-2):7-15.",
        url: "https://doi.org/10.4021/jem157w",
      },
      {
        id: 7,
        citation:
          "National Center for Biotechnology Information. PubChem Compound Summary for CID 71300630, AOD-9604.",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/71300630",
      },
      {
        id: 8,
        citation:
          "Misra M. Obesity pharmacotherapy: current perspectives and future directions. Curr Cardiol Rev. 2013;9(1):33-54.",
        url: "https://pubmed.ncbi.nlm.nih.gov/23092275/",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-08-18",
  },
  nad: {
    shortDescription: [
      "NAD+ is short for nicotinamide adenine dinucleotide. Despite the \"NAD peptide\" label search engines keep surfacing, it isn't a peptide. A peptide is a chain of amino acids linked by peptide bonds. NAD+ has neither: it's a dinucleotide, two nucleotides (one built on adenine, one on nicotinamide) joined end to end by a pyrophosphate bridge.[1][2] NAD+ cycles between an oxidized state and a reduced state, NADH, and every living cell runs on that cycle to move electrons through metabolism.",
      "Tetrava Labs supplies NAD+ as a sterile, lyophilized reagent for laboratory research on redox biochemistry, sirtuin and PARP enzymology, and mitochondrial-aging models. It isn't the same category of molecule as the amino-acid peptides elsewhere in this catalog, and it carries no clinical claim for anti-aging, energy, or cognitive benefit. Every lot ships with third-party HPLC-verified identity and purity data. Buy NAD+ online here for research use only; it is not for human or veterinary consumption.",
    ],
    otherKnownTitles: [
      "NAD",
      "Nicotinamide Adenine Dinucleotide",
      "Coenzyme I",
      "Nadide",
      "β-NAD",
      "Diphosphopyridine Nucleotide (DPN)",
    ],
    sections: [
      {
        heading: "NAD+ is a coenzyme, not a peptide: what the molecule actually is",
        paragraphs: [
          "Search volume around \"NAD peptide\" is high enough that the label has stuck, but the chemistry doesn't support it. NAD+ has no amino acid backbone and no peptide bond anywhere in its structure. It's a dinucleotide: an adenine-based nucleotide and a nicotinamide-based nucleotide, each built on a ribose sugar and a phosphate group, linked by a shared pyrophosphate bridge.[1][2] PubChem lists it under CID 5892, molecular formula C21H27N7O14P2, alongside the older name nadide.[1]",
          "Tetrava Labs does carry genuine peptides discussed in the same longevity and mitochondrial-research conversations as NAD+. [MOTS-c](/buy-mots-c-online) is one: a 16-amino-acid, mitochondrially encoded signaling peptide with an actual sequence and peptide bonds. NAD+ and MOTS-c turn up in the same research literature because both sit inside mitochondrial and metabolic-aging biology, not because they're the same class of molecule.",
        ],
      },
      {
        heading:
          "Why NAD+ matters in cellular research: electron carrier, enzyme substrate, and DNA-repair fuel",
        paragraphs: [
          "NAD+/NADH is the electron-carrying pair that keeps glycolysis, the citric acid cycle, and oxidative phosphorylation moving, cycling between oxidized and reduced states as it shuttles electrons toward ATP production.[2] That redox role alone would make NAD+ worth studying. It isn't the whole story.",
          "NAD+ also gets consumed, not just recycled, by three enzyme families driving a lot of current aging research: the sirtuins (SIRT1 through SIRT7), which use NAD+ to strip acetyl groups off histones and other proteins; the PARPs, which burn NAD+ to build poly-ADP-ribose chains during DNA repair; and CD38, an immune-cell enzyme that degrades NAD+ into calcium-signaling metabolites.[2] Sirtuins and PARPs compete for the same limited NAD+ pool. A cell under heavy DNA-damage load can starve its sirtuin activity of substrate, which is the mechanism researchers use to connect oxidative stress to aging phenotypes.[2]",
        ],
      },
      {
        heading:
          "NAD+, AMPK, and mitochondrial biogenesis: what a 2009 skeletal-muscle study found",
        paragraphs: [
          "A separate line of research ties NAD+ to exercise physiology through AMPK, the cell's fuel-sensing enzyme. A 2009 study in mouse skeletal muscle found that AMPK activation raises cellular NAD+ levels, which in turn boosts SIRT1 activity. SIRT1 then deacetylates PGC-1α, FOXO1, and FOXO3a, three transcription factors that switch on mitochondrial biogenesis and oxidative-metabolism genes.[3] That's the mechanistic chain researchers point to when they connect NAD+ to exercise adaptation and mitochondrial density, not a single \"NAD+ raises energy\" claim.",
          "It's a mouse skeletal-muscle model, not a human trial, and it says nothing about whether an exogenous NAD+ reagent reproduces the same intracellular AMPK-SIRT1 signaling. Labs studying this pathway typically need an AMPK activator (AICAR or metformin are common choices in the literature) alongside NAD+ and SIRT1 readouts to isolate where in the chain an effect originates.[3]",
        ],
      },
      {
        heading: "NAD+ decline with age: what the human tissue data shows",
        paragraphs: [
          "A 2012 study measured NAD+, PARP activity, and SIRT1 activity directly in human pelvic skin samples from 49 subjects ranging from newborn to age 77.[4] NAD+ levels correlated negatively with age in both sexes. PARP activity rose with age and tracked inversely with tissue NAD+ levels, most strongly in males.[4] The authors' interpretation: age-related oxidative DNA damage drives PARP into overdrive, and the resulting NAD+ consumption may be part of what limits energy production and DNA repair capacity as tissue ages.[4]",
          "That's a correlational human-tissue dataset, not a controlled intervention trial. It supports the hypothesis that preserving NAD+ pools matters for cellular aging, but it doesn't establish that supplementing NAD+ from outside the cell reverses any of it. A comparative aging model should treat NAD+ depletion as one variable among several, with PARP and sirtuin activity measured directly rather than assumed.",
        ],
      },
      {
        heading:
          "Precursor supplementation vs. the intact dinucleotide: what human trials have tested",
        paragraphs: [
          "Most of the controlled human evidence on raising NAD+ levels doesn't test the intact dinucleotide. It tests precursors, smaller molecules like nicotinamide mononucleotide (NMN) and nicotinamide riboside (NR), that cells convert into NAD+ through the salvage pathway.[2] A 2021 randomized, placebo-controlled trial gave 25 postmenopausal women with prediabetes either 250 mg of oral NMN daily or placebo for 10 weeks. The NMN group showed increased NAD+ in blood cells and improved skeletal-muscle insulin signaling, with no NMN-attributed adverse events reported.[5]",
          "NAD+ is a large, charged molecule that doesn't cross cell membranes as readily as its smaller precursors, which is part of why the precursor route dominates the published human trial record.[2] That gap in the literature is exactly why \"how much NAD peptide should I take\" and similar dosing questions don't have a published answer. The best-controlled human data measures a different, smaller molecule than the one in this vial.",
        ],
      },
      {
        heading: "Intravenous NAD+: what the tolerability studies actually found",
        paragraphs: [
          "Wellness clinics market NAD+ by IV infusion or injection for energy, recovery, and anti-aging claims. The tolerability data tells a rougher story than the marketing does. A 2026 retrospective study comparing commercial NAD+ IV against NR IV infusions found that every NAD+ IV participant reported moderate-to-severe abdominal cramping, nausea, vomiting, elevated heart rate, throat pain, and chest pressure during the infusion, all of which resolved once the infusion stopped.[6] Average NAD+ IV infusion time ran 97 minutes, more than double the NR IV group's 37 minutes, largely because clinicians had to slow the drip rate to manage those reactions.[6]",
          "A separate 2024 randomized pilot study comparing acute NAD+ IV, NR IV, and oral NR found a measurable increase in white blood cell count and neutrophils in the NAD+ IV arm, consistent with an inflammatory response. NR IV raised blood NAD+ levels faster and higher than NAD+ IV did at the three-hour mark.[7] Neither study is large enough to settle safety questions, and both call for more systematic research given how widely IV NAD+ is already marketed.[6][7] Nothing in that literature describes a validated dosing chart, calculator, or injection-site protocol. This page doesn't publish one either.",
        ],
      },
      {
        heading: "NAD+ serum, patches, and other delivery formats sold outside a lab",
        paragraphs: [
          "\"NAD+ serum\" and \"NAD+ patch\" are marketing terms from the skincare and wellness industries, not chemistry terms with a shared research definition behind them. Nothing in the literature reviewed for this page tests a topical serum or transdermal patch route for NAD+.",
          "That gap tracks with what's already known about the molecule: NAD+ is large and charged, the same membrane-permeability problem that pushes controlled human trials toward smaller precursors instead of the intact dinucleotide.[2] Tetrava Labs doesn't sell a topical serum or a patch. This catalog listing is a lyophilized vial for laboratory reconstitution, nothing else.",
        ],
      },
      {
        heading:
          "Regulatory status: not FDA-approved, excluded from the 503A compounding list",
        paragraphs: [
          "NAD+ has no FDA-approved indication in any form. In a September 2019 proposed rule, FDA reviewed NAD among 26 nominated substances and proposed not to add it to the Section 503A Bulks List, the list that lets compounding pharmacies use a bulk substance without an individual patient prescription tied to an approved drug.[8] Injectable NAD+ sold by clinics is compounded medication, prepared under FDA's interim compounding enforcement policy rather than as an approved drug product. Oral NMN and NR are marketed as dietary supplements under a completely different regulatory framework.[2][8]",
          "FDA has separately reminded compounders that food-grade NAD+ isn't suitable for sterile injectable use, since food-grade material isn't manufactured or tested to the sterility and endotoxin standards an IV product requires.[9] Tetrava Labs' catalog listing is a Research Use Only laboratory reagent. It is not a compounded injectable, an IV product, or a dietary supplement.",
        ],
      },
      {
        heading: "Laboratory handling: reconstitution, storage, and documentation",
        paragraphs: [
          "NAD+ ships as a lyophilized powder, which keeps it stable in transport and storage. Store sealed vials at -20°C, away from light, and avoid repeated freeze-thaw cycling; NAD+ degrades under both heat and prolonged light exposure in solution.[2] Reconstitute under sterile technique with a protocol-appropriate diluent immediately before use.",
          "After reconstitution, hold working solutions at 4°C, minimize freeze-thaw cycles, and use them within the window your laboratory SOP sets. Because NAD+/NADH ratios are the actual readout in most redox assays, record diluent lot, reconstitution date, and time-to-assay in your ELN so preparation timing doesn't confound the ratio you're measuring. Keep those preparation notes matched to the batch [Certificate of Analysis](/coa-library).",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "National Center for Biotechnology Information. PubChem Compound Summary for CID 5892, Nadide (NAD+).",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/5892",
      },
      {
        id: 2,
        citation:
          "Srivastava S. Emerging therapeutic roles for NAD+ metabolism in mitochondrial and age-related disorders. Clin Transl Med. 2016;5:25.",
        url: "https://pubmed.ncbi.nlm.nih.gov/27465020/",
      },
      {
        id: 3,
        citation:
          "Cantó C, Gerhart-Hines Z, Feige JN, Lagouge M, Noriega L, Milne JC, Elliott PJ, Puigserver P, Auwerx J. AMPK regulates energy expenditure by modulating NAD+ metabolism and SIRT1 activity. Nature. 2009;458(7241):1056-1060.",
        url: "https://pubmed.ncbi.nlm.nih.gov/19262508/",
      },
      {
        id: 4,
        citation:
          "Massudi H, Grant R, Braidy N, Guest J, Farnsworth B, Guillemin GJ. Age-Associated Changes In Oxidative Stress and NAD+ Metabolism In Human Tissue. PLoS ONE. 2012;7(7):e42357.",
        url: "https://pubmed.ncbi.nlm.nih.gov/22848760/",
      },
      {
        id: 5,
        citation:
          "Yoshino M, Yoshino J, Kayser BD, Patti GJ, Franczyk MP, Mills KF, Sindelar M, Pietka T, Patterson BW, Imai SI, Klein S. Nicotinamide mononucleotide increases muscle insulin sensitivity in prediabetic women. Science. 2021;372(6547):1224-1229.",
        url: "https://pubmed.ncbi.nlm.nih.gov/33888596/",
      },
      {
        id: 6,
        citation:
          "Reyna K, Heinzen G, Patel N, Ritter M, Siojo A, Legere H, Pojednic R. Intravenous infusion of nicotinamide adenine dinucleotide (NAD+) versus nicotinamide riboside (NR): a retrospective tolerability pilot study in a real-world setting. Front Aging. 2026;7:1652582.",
        url: "https://doi.org/10.3389/fragi.2026.1652582",
      },
      {
        id: 7,
        citation:
          "Hawkins J, Idoine R, Kwon J, Shao A, Dunne E, Hawkins E, Dawson K, Nkrumah-Elie Y. Randomized, placebo-controlled, pilot clinical study evaluating acute Niagen+ IV and NAD+ IV in healthy adults. medRxiv preprint. 2024.",
        url: "https://doi.org/10.1101/2024.06.06.24308565",
      },
      {
        id: 8,
        citation:
          "U.S. Food and Drug Administration. Bulk Drug Substances for Compounding Under Section 503A of the FD&C Act; Proposed Rule. Fed Regist. 2019;84(172):46628 (Docket No. FDA-2018-N-4845).",
        url: "https://www.govinfo.gov/content/pkg/FR-2019-09-05/html/2019-18951.htm",
      },
      {
        id: 9,
        citation:
          "U.S. Food and Drug Administration. FDA reminds compounders to use ingredients suitable for sterile compounding.",
        url: "https://www.fda.gov/drugs/human-drug-compounding/fda-reminds-compounders-use-ingredients-suitable-sterile-compounding",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-08-18",
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
          "Sermorelin is the first 29 residues of native human GHRH, with a C-terminal amide swapped in for the free acid. That amide change raises stability in vitro and leaves the receptor-binding region untouched.[1] Guide to Pharmacology lists the sequence as Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-Gln, matching the identity fields in the Specifications tab.",
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
          "Identity fields, CAS number, molecular formula, molecular weight, and sequence, for both strengths sit in the Specifications tab. They come from the same lot records used to generate each batch COA, not from generic reference tables. Choose 5 mg versus 10 mg, and single-vial versus multi-vial, against that paperwork.",
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
      "Tetrava Labs sells mazdutide as a sterile, lyophilized reagent for laboratory research only, not the approved drug product sold elsewhere. Labs use it to study dual-agonist receptor signaling, hepatic fat metabolism, and comparative work against other incretin peptides such as [semaglutide](/buy-semaglutide-online), [tirzepatide](/buy-tirzepatide-online), and [retatrutide](/buy-retatrutide-online). The identity fields in the Specifications tab are cross-referenced against the PubChem compound record for mazdutide.[7] Every lot ships with third-party HPLC-verified identity and purity data. This compound is sold strictly for research use. It is not for human or veterinary consumption.",
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
      "Tetrava Labs supplies MOTS-c as a sterile, lyophilized reagent for laboratory research only. Labs use it to study AMPK-linked metabolic signaling, skeletal-muscle exercise adaptation, and insulin-sensitivity pathways in cell and animal models. The identity fields in the Specifications tab are cross-referenced against the PubChem compound record for MOTS-c.[6] Every lot ships with third-party HPLC-verified identity and purity data. This compound is sold strictly for research use. It is not for human or veterinary consumption.",
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
      "Tetrava Labs sells retatrutide as a sterile, lyophilized reagent for laboratory research only. It is not the investigational drug being tested in Lilly's TRIUMPH trials, and it is not available anywhere as an approved medication. Labs use this listing to study triple-receptor signaling, comparative incretin pharmacology, and hepatic lipid metabolism in cell and animal models. The identity fields in the Specifications tab are cross-referenced against the PubChem compound record for retatrutide.[7] Every lot ships with third-party HPLC-verified identity and purity data. This compound is sold strictly for research use. It is not for human or veterinary consumption.",
    ],
    otherKnownTitles: ["LY3437943", "LY-3437943", "retatrutide [INN]"],
    sections: [
      {
        heading: "What retatrutide does",
        paragraphs: [
          "Retatrutide binds three metabolic receptors at the same time: GLP-1, GIP, and glucagon.[1] In trial and laboratory work, that combination is studied for insulin secretion, gastric emptying, hepatic fat oxidation, and energy expenditure.",
          "The peptide is built around a GLP-1 backbone, the same peptide scaffold behind semaglutide and tirzepatide, modified so it also binds and activates the GIP receptor and the glucagon receptor.[1] GLP-1 slows gastric emptying and drives glucose-dependent insulin release. GIP improves insulin sensitivity and fat-cell signaling. Glucagon pushes the liver toward fat oxidation and raises resting energy expenditure.",
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
          "Headache appeared in the trial supplement's less-common events table (Table S10), not in the paper's main safety table. Incidence was 0% on placebo, 11.4% in one 8 mg arm, 6.5% in the 12 mg arm, and 3.3% of all participants.[2] That table is not a safety claim about Tetrava's Research Use Only listing.",
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
  selank: {
    shortDescription: [
      "Selank is a synthetic heptapeptide, seven amino acids, built from the natural immunomodulatory peptide tuftsin (Thr-Lys-Pro-Arg) with a Pro-Gly-Pro tail added to the end. That tail is the same stability trick used on Semax, designed at the same Moscow laboratory. The full sequence is Thr-Lys-Pro-Arg-Pro-Gly-Pro, a free carboxylic acid at the C-terminus, molecular formula C33H57N11O9, and it's catalogued in PubChem under CID 11765600.[1]",
      "Tetrava Labs supplies Selank as a sterile, lyophilized reagent, 5 mg or 10 mg vials, for laboratory research into GABAergic signaling, enkephalin metabolism, and stress-response models. It's a different molecule from N-Acetyl Selank Amidate, a separately modified analog some vendors sell, and Tetrava doesn't carry that variant. Every lot ships with third-party HPLC-verified identity and purity data. Buy Selank online here for research use only; it is not for human or veterinary consumption.",
    ],
    otherKnownTitles: [
      "TP-7",
      "Selank Acetate",
      "Tuftsin-PGP",
      "Thr-Lys-Pro-Arg-Pro-Gly-Pro",
    ],
    sections: [
      {
        heading:
          "What Selank is: a tuftsin-derived heptapeptide, not the modified amidate analog",
        paragraphs: [
          "Tuftsin is a naturally occurring immunomodulatory tetrapeptide, a four-residue fragment cleaved from the heavy chain of immunoglobulin G. Selank extends that Thr-Lys-Pro-Arg core with a Pro-Gly-Pro tail, the same C-terminal stabilization strategy researchers at Russia's Institute of Molecular Genetics used when they designed Semax from a different parent molecule.[2] The resulting heptapeptide keeps a free carboxylic acid at the C-terminus.",
          "Search results and some catalog listings surface a second compound, N-Acetyl Selank Amidate, alongside Selank itself, often sold in a 30 mg vial rather than Selank's usual 5 mg or 10 mg. That's a distinct, chemically modified molecule: an acetyl group added to the N-terminus and an amide in place of the C-terminal acid. Vendors market it as more stable. There's no peer-reviewed human or animal study in the literature reviewed for this page that tests the amidated analog directly. Tetrava Labs' catalog lists unmodified Selank only, in 5 mg and 10 mg lyophilized vials, and doesn't carry the 30 mg amidate SKU.",
        ],
      },
      {
        heading: "How Selank is thought to work: enkephalinase inhibition",
        paragraphs: [
          "The most-cited mechanistic study measured how fast the body clears leu-enkephalin, an endogenous opioid peptide, from blood plasma. Patients with generalized anxiety disorder had a shorter enkephalin half-life and lower enkephalinase-inhibiting activity in their blood than healthy controls. Selank, added in vitro, dose-dependently blocked the enzymes that degrade enkephalin, with an IC50 of about 15 micromolar, and outperformed the reference peptidase inhibitors bacitracin and puromycin at that job.[3]",
          "The proposed chain of causation: less enzymatic breakdown means enkephalin circulates longer, which extends its own signaling at opioid receptors tied to mood and stress response. That's an in vitro enzyme assay plus a correlational patient-blood finding, not a receptor-binding study on Selank itself. Researchers modeling this pathway typically need a direct enkephalinase activity assay to isolate where in the chain an effect originates. An anxiety-scale outcome alone won't do that.",
        ],
      },
      {
        heading: "Selank and GABAergic gene expression: a 2016 rodent study",
        paragraphs: [
          "A separate line of research looks at gene expression rather than enzyme kinetics. A 2016 study administered Selank to rats and measured expression changes across a panel of genes involved in GABAergic neurotransmission, the same inhibitory signaling system that classical benzodiazepines target through allosteric modulation of GABA-A receptors.[4] The paper reported measurable shifts in that gene panel following Selank administration, which the authors used to argue for a GABAergic component to Selank's anxiolytic profile, alongside the enkephalinase mechanism.",
          "It's a gene-expression readout in whole rat brain tissue, not a radioligand-binding assay showing Selank sitting on the GABA-A receptor itself. A comparative pharmacology model should treat the GABAergic and opioid-system mechanisms as two separate, partially supported hypotheses rather than a single settled pathway.",
        ],
      },
      {
        heading: "Selank and BDNF: a 2008 intranasal rat hippocampus study",
        paragraphs: [
          "A 2008 study gave rats Selank intranasally and measured brain-derived neurotrophic factor (BDNF) expression in the hippocampus afterward.[5] BDNF supports neuron survival and synaptic plasticity, and it's a common readout in stress and neuroplasticity research because chronic stress tends to suppress it. The study reported that intranasal Selank changed hippocampal BDNF expression in vivo.",
          "That's an intranasal rat study, a delivery route Tetrava Labs doesn't sell a finished product for. It says nothing about oral, subcutaneous, or in vitro BDNF effects, and it doesn't establish a dose-response curve for the reagent form sold here.",
        ],
      },
      {
        heading:
          "The foundational human trial: Selank against a benzodiazepine for generalized anxiety",
        paragraphs: [
          "The trial most often cited for Selank's anxiolytic claim is a 2008 Russian study, indexed on PubMed as a randomized controlled trial, that enrolled 62 patients with generalized anxiety disorder or neurasthenia.[6] Thirty received Selank and 32 received medazepam, a benzodiazepine, with outcomes tracked on the Hamilton, Zung, and Clinical Global Impression scales alongside blood enkephalin activity. The two treatments produced comparable anxiolytic effects on those scales. Selank also showed antiasthenic and psychostimulant effects that the paper's English abstract does not report for the medazepam arm, and patients with the lowest baseline enkephalin activity showed the strongest response.",
          "This is the single controlled human trial underpinning most of what gets repeated online about Selank and anxiety. It's a single-country, single-language-publication study without a placebo arm described in the abstract, and it has not been independently replicated in a Western, FDA-reviewed trial. Treat it as the evidentiary basis for Russia's 2009 drug registration, not as FDA-level proof for a research-chemical vial.",
        ],
      },
      {
        heading: "Selank vs. Semax: same lab, different parent peptide",
        paragraphs: [
          "Selank and Semax share a birthplace, Russia's Institute of Molecular Genetics working with the Zakusov Institute of Pharmacology, and both carry the same Pro-Gly-Pro stability tail. That's where the resemblance ends. Semax is built from a fragment of adrenocorticotropic hormone, ACTH(4-10), and the published research around it centers on cerebral ischemia, stroke recovery, and neurotrophic signaling.[2] Selank is built from tuftsin and the published research centers on anxiolysis, enkephalin metabolism, and immune signaling.",
          "\"Semax and Selank\" gets searched as a pair because researchers studying stress and cognition sometimes look at both, not because a combined-use trial exists. No published study reviewed for this page tests Selank and Semax administered together, so there's no dosing or interaction data to cite for that combination. Tetrava Labs carries [Semax](/buy-semax-online) and Selank as separate Research Use Only catalog listings.",
        ],
      },
      {
        heading: "Buying Selank for research: what to verify before you order",
        paragraphs: [
          "Vendor quality is checkable before you buy Selank from anyone. Before treating a supplier as qualified, look at:",
        ],
        bullets: [
          "Lot identity: does the listing give a batch or lot number that matches the Certificate of Analysis shipped with the vial, or is the PDF generic or reused across products?",
          "COA/HPLC traceability: is the COA from an independent third-party lab, reporting purity by area-under-curve HPLC rather than an in-house claim?",
          "Identity confirmation: does the COA or an accompanying mass-spec report confirm Selank's sequence and molecular weight, not just a purity percentage?",
          "Product clarity: does the listing say plainly whether the vial is unmodified Selank or the separately modified N-Acetyl Selank Amidate, and at what strength?",
          "Shipping compliance: does the seller disclose which destinations it won't ship to, rather than leaving that out until checkout?",
        ],
      },
      {
        heading: "Selank on forums and Reddit: anecdote versus evidence",
        paragraphs: [
          "Selank comes up regularly in peptide and nootropic forums, usually as first-person reports of mood or focus changes rather than measured data. That's the opposite texture from the published literature above, which is almost entirely Russian clinical and animal research with no comparable body of Western self-report studies behind it.",
          "A forum thread can point you toward a question worth checking, a vendor worth researching, or a side effect worth reading up on. It isn't a substitute for a lot-specific COA or a peer-reviewed citation, and a poster's subjective account of \"how long it took to work\" carries no more weight than any other uncontrolled, unblinded report.",
        ],
      },
      {
        heading: "Selank and immune signaling: the tuftsin connection",
        paragraphs: [
          "Tuftsin's original research context is immunology, not anxiety. As a natural immunomodulatory peptide, it's studied for effects on phagocyte activity and cytokine signaling, and some of that interest carried over into Selank research. A 2021 study measured cytokine levels under a social-stress model and reported that Selank shifted the measured cytokine profile relative to untreated stressed controls.[7]",
          "That's a rodent stress-model cytokine panel, not a human immunology trial, and it's a thinner evidence base than the enkephalinase or GABAergic-gene-expression work above. It's worth knowing about mainly because it explains why Selank research sits at the intersection of neuropeptide and immunopeptide literature instead of squarely in one field.",
        ],
      },
      {
        heading:
          "Regulatory status: registered in Russia, no FDA approval, and no PCAC review",
        paragraphs: [
          "Russia's Ministry of Health registered Selank in 2009 as a 0.15% intranasal solution for generalized anxiety disorder and neurasthenia, manufactured by a specific Russian registrant.[6] The FDA has never approved Selank in any form, and it carries no U.S. drug registration.",
          "In July 2026, the FDA's Pharmacy Compounding Advisory Committee reviewed seven peptide-related bulk drug substances nominated for the Section 503A Bulks List, the list that lets compounding pharmacies use a substance without a substance-specific approved drug behind it. Semax was one of the seven; Selank was not.[8] That distinction matters for anyone assuming the two peptides share a regulatory track: Semax has an open FDA rulemaking record building toward possible compounding access, and Selank currently doesn't have an equivalent docket. Tetrava Labs' catalog listing is a Research Use Only laboratory reagent regardless of how that rulemaking resolves.",
        ],
      },
      {
        heading: "Laboratory handling: reconstitution, storage, and documentation",
        paragraphs: [
          "Selank ships as a lyophilized powder, stable at -20°C away from light. Reconstitute under sterile technique with a protocol-appropriate diluent immediately before use, and avoid repeated freeze-thaw cycling once in solution.",
          "Hold reconstituted working solutions at 4°C and use them within the window your laboratory SOP sets. Record diluent lot, reconstitution date, and concentration in your ELN, and match those notes to the batch [Certificate of Analysis](/coa-library) so identity and purity data stay traceable to the exact vial used in an assay.",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "National Center for Biotechnology Information. PubChem Compound Summary for CID 11765600, Selank.",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/11765600",
      },
      {
        id: 2,
        citation:
          "Kolomin T, Shadrina M, Slominsky P, et al. A new generation of drugs: synthetic peptides based on natural regulatory peptides. Nat Sci. 2013;5(4A):72-91.",
        url: "https://doi.org/10.4236/ns.2013.54A011",
      },
      {
        id: 3,
        citation:
          "Zozulya AA, Kost NV, Sokolov OYu, Gabaeva MV, Grivennikov IA, Andreeva LN, Zolotarev YA, Ivanov SV, Andryushchenko AV, Myasoedov NF, Smulevich AB. The inhibitory effect of Selank on enkephalin-degrading enzymes as a possible mechanism of its anxiolytic activity. Bull Exp Biol Med. 2001;131(4):315-317.",
        url: "https://pubmed.ncbi.nlm.nih.gov/11550013/",
      },
      {
        id: 4,
        citation:
          "Volkova A, Shadrina M, Kolomin T, Andreeva L, Limborska S, Myasoedov N, Slominsky P. Selank administration affects the expression of some genes involved in GABAergic neurotransmission. Front Pharmacol. 2016;7:31.",
        url: "https://pubmed.ncbi.nlm.nih.gov/26924987/",
      },
      {
        id: 5,
        citation:
          "Inozemtseva LS, Karpenko EA, Dolotov OV, Levitskaya NG, Kamensky AA, Andreeva LA, Grivennikov IA. Intranasal administration of the peptide Selank regulates BDNF expression in the rat hippocampus in vivo. Dokl Biol Sci. 2008;421:241-243.",
        url: "https://pubmed.ncbi.nlm.nih.gov/18841804/",
      },
      {
        id: 6,
        citation:
          "Zozulia AA, Neznamov GG, Siuniakov TS, et al. Efficacy and possible mechanisms of action of a new peptide anxiolytic Selank in the therapy of generalized anxiety disorders and neurasthenia. Zh Nevrol Psikhiatr Im S S Korsakova. 2008;108(4):38-48.",
        url: "https://pubmed.ncbi.nlm.nih.gov/18454096/",
      },
      {
        id: 7,
        citation:
          "The influence of Selank on the level of cytokines under the conditions of social stress. Curr Rev Clin Exp Pharmacol. 2021;16(2):162-167.",
        url: "https://pubmed.ncbi.nlm.nih.gov/32621722/",
      },
      {
        id: 8,
        citation:
          "U.S. Food and Drug Administration. Pharmacy Compounding Advisory Committee; Notice of Meeting; Establishment of a Public Docket; Request for Comments--Bulk Drug Substances Nominated for Inclusion on the Section 503A Bulk Drug Substances List. Fed Regist. 2026;91(73):20465 (Docket No. FDA-2025-N-6895).",
        url: "https://www.govinfo.gov/content/pkg/FR-2026-04-16/html/2026-07361.htm",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-08-18",
  },
  semax: {
    shortDescription: [
      "Semax is a synthetic heptapeptide, seven amino acids, built from a fragment of adrenocorticotropic hormone, ACTH(4-7), with the same Pro-Gly-Pro stabilizing tail used on its lab-mate Selank. The full sequence is Met-Glu-His-Phe-Pro-Gly-Pro, molecular formula C37H51N9O10S, molecular weight 813.93, cross-referenced against the PubChem compound record for CAS 80714-61-0.[1]",
      "Tetrava Labs supplies Semax as a sterile, lyophilized reagent, 5 mg or 10 mg vials, for laboratory research into neurotrophin signaling, cerebral ischemia models, and cognitive-performance assays. It's a different molecule from N-Acetyl Semax Amidate, a separately modified analog sold under other names, including Tetrava's own [Adamax](/buy-adamax-online) listing. Every lot ships with third-party HPLC-verified identity and purity data. Buy Semax online here for research use only; it is not for human or veterinary consumption.",
    ],
    otherKnownTitles: [
      "ACTH(4-10) Analogue",
      "Semaks",
      "Met-Glu-His-Phe-Pro-Gly-Pro",
    ],
    sections: [
      {
        heading:
          "What Semax is: an ACTH fragment stabilized with a Pro-Gly-Pro tail",
        paragraphs: [
          "Adrenocorticotropic hormone, ACTH, is best known for triggering cortisol release, but a small internal fragment of the molecule, residues 4 through 10, carries nootropic and neurotrophic activity without the hormone's adrenal effects. Researchers at Russia's Institute of Molecular Genetics isolated that fragment, trimmed it to residues 4 through 7 (Met-Glu-His-Phe), and extended the C-terminus with the same Pro-Gly-Pro tripeptide they later reused on Selank, a design choice that slows breakdown by carboxypeptidases.[2] The result is Semax, a free carboxylic acid at the C-terminus.",
          "Search results and some catalog listings surface a second family of compounds alongside plain Semax: N-Acetyl Semax and N-Acetyl Semax Amidate, which add an acetyl group to the N-terminus, an amide in place of the C-terminal acid, or both. Vendors market these as more potent or longer-acting. Tetrava Labs' catalog lists unmodified Semax in 5 mg and 10 mg lyophilized vials under this listing, and carries a separately specified acetylated analog under its own [Adamax](/buy-adamax-online) product page rather than folding it into this one. Check that page directly for Adamax's own identity data and strength; this page describes native Semax only.",
        ],
      },
      {
        heading: "Adamax vs. Semax: two separate Tetrava Labs listings",
        paragraphs: [
          "\"Adamax vs Semax\" gets searched because the names sound related, and the confusion runs deeper than branding. Some vendors use \"Adamax\" for an adamantane-modified peptide built for extra lipophilicity, while others use it as a trade name for an N-acetylated, C-terminally amidated Semax analog. Tetrava Labs' Adamax listing is the latter category: a chemically modified relative of Semax, not the identical molecule at a different concentration.",
          "That's the practical answer to \"where to buy Semax amidate\" and \"where to buy Semax amidate 30mg\": Tetrava doesn't sell a SKU called \"Semax amidate,\" and doesn't stock a 30 mg vial of any Semax-family compound. Its acetylated analog ships as Adamax, in the strength listed on that product's own page. Don't assume Adamax carries Semax's dosing curve or research literature. They're related by design lineage, not by identical chemistry.",
        ],
      },
      {
        heading: "How Semax is thought to work: BDNF and NGF gene expression",
        paragraphs: [
          "The most-cited mechanistic thread traces Semax's effects to neurotrophin gene expression rather than a single receptor-binding event. A study comparing gene-expression timing across rat hippocampus, frontal cortex, and retina found that Semax shifted both brain-derived neurotrophic factor (BDNF) and nerve growth factor (NGF) mRNA on measurably different schedules depending on the tissue, with the hippocampus showing the earliest response.[3] BDNF supports neuron survival and synaptic plasticity; NGF supports the cholinergic neurons tied to attention and memory. Both are common readouts in neuroplasticity research because they're depressed by chronic stress and injury.",
          "That's a gene-expression and mRNA-timing study, not a binding assay identifying which receptor Semax engages first. Researchers modeling this pathway typically pair a BDNF/NGF ELISA or qPCR panel with a separate mechanism-of-entry assay, since tissue-specific timing differences like the ones reported here suggest more than one downstream trigger.",
        ],
      },
      {
        heading:
          "How Semax breaks down: a degradation pathway, not a published half-life",
        paragraphs: [
          "\"How long does Semax last\" doesn't have a clean answer in the literature. No study reviewed for this page publishes a serum half-life for intact Semax the way a drug label would. What's published instead is a breakdown map. A 2006 study using isotopically labeled Semax found that rat basal forebrain plasma membranes and cell cultures degrade the peptide mainly by clipping the Met-Glu pair off the N-terminus and the Gly-Pro pair off the C-terminus, leaving pentapeptide fragments as the dominant byproduct. Glial and neuronal cells produced slightly different fragment patterns from the same starting peptide.[10]",
          "That's a tissue-culture degradation study. It maps where Semax gets cut once it reaches brain tissue, not how many minutes a given concentration survives in a vial, a syringe, or a nasal spray.",
        ],
      },
      {
        heading: "Semax and cerebral ischemia: the animal evidence base",
        paragraphs: [
          "A 2006 rat study using photochemically induced cortical infarction found that intranasal Semax reduced infarct volume and improved performance on a passive-avoidance memory task compared with untreated controls.[4] Two more recent transcriptome-level studies extended that finding. A 2020 RNA-sequencing analysis of rat brains after transient middle cerebral artery occlusion found Semax suppressed inflammation-related gene expression while activating neurotransmission-related genes; the paper counted 394 differentially expressed genes relative to saline controls.[5] A 2021 follow-up measured actual protein levels instead of transcripts. It found Semax raised active CREB, a transcription factor tied to neuronal recovery, and lowered MMP-9, c-Fos, and active JNK, three proteins tied to inflammation and cell death, in the same ischemia-reperfusion model.[6]",
          "Three studies, three levels of resolution: whole-animal outcome, gene transcripts, measured protein. All three are rodent, intranasal-or-systemic dosing studies. None establishes a human oral, subcutaneous, or in vitro dose-response curve for the reagent form sold here.",
        ],
      },
      {
        heading:
          "The Gusev 2018 clinical trial: Semax across different stages of ischemic stroke",
        paragraphs: [
          "The human data most often cited for Semax's stroke-recovery claim comes from a 2018 Russian clinical trial led by neurologist Evgeny Gusev, published in the Korsakov Journal of Neurology and Psychiatry, that evaluated Semax's efficacy in patients treated at different stages of ischemic stroke.[7] It's indexed on PubMed as a clinical trial.",
          "That's Russian-language, single-health-system evidence. It hasn't been replicated in an independent, FDA-reviewed Western trial. Treat it as the evidentiary basis for a foreign drug registration, not as proof standing behind a Research Use Only vial.",
        ],
      },
      {
        heading: "Semax and optic-nerve disease: a second human trial line",
        paragraphs: [
          "Stroke isn't the only condition Semax has a controlled human trial behind it. A 2000 study in Vestnik Oftalmologii tested Semax against vascular, toxic-allergic, and inflammatory optic-nerve disease, including partial optic-nerve atrophy, across three patient groups: intranasal drops, endonasal electrophoresis, and an untreated control.[11] Both delivery routes were tied to improved visual acuity, a wider visual field, better electrical conductivity through the optic nerve, and improved color vision relative to the control group.",
          "This trial sits outside the stroke literature that dominates Semax's reputation, and it's easy to miss if a search only turns up the ischemia studies. It's still one Russian trial without independent Western replication, the same limitation attached to the stroke data above.",
        ],
      },
      {
        heading: "Semax vs. Selank: same lab, different parent peptide",
        paragraphs: [
          "Semax and Selank were both designed at Russia's Institute of Molecular Genetics working with the Zakusov Institute of Pharmacology, and both carry the identical Pro-Gly-Pro stability tail.[2] That's where the resemblance ends chemically. Semax is built from a fragment of ACTH and its published research centers on cerebral ischemia, stroke recovery, and neurotrophic gene expression. Selank is built from tuftsin, an immune-signaling tetrapeptide, and its published research centers on enkephalin metabolism, GABAergic gene expression, and anxiety models.",
          "\"Semax and Selank\" gets searched as a pair, sometimes stacked as a nasal spray combination, because researchers studying stress and cognition sometimes look at both compounds side by side. No published study reviewed for this page tests Semax and Selank administered together, so there's no combined dosage chart, dosing protocol, or interaction data to cite. Tetrava Labs carries Semax and [Selank](/buy-selank-online) as separate Research Use Only catalog listings, each with its own identity data and citations.",
        ],
      },
      {
        heading: "Buying Semax for research: what to verify before you order",
        paragraphs: [
          "Vendor quality is checkable before you buy Semax from anyone, whether you're comparing a specific listing against the best place to buy Semax nasal spray or just trying to confirm a peptide clinic's claims. Before treating a supplier as qualified, look at:",
        ],
        bullets: [
          "Lot identity: does the listing give a batch or lot number that matches the Certificate of Analysis shipped with the vial, or is the PDF generic or reused across products?",
          "COA/HPLC traceability: is the COA from an independent third-party lab, reporting purity by area-under-curve HPLC rather than an in-house claim?",
          "Identity confirmation: does the COA or an accompanying mass-spec report confirm Semax's sequence and molecular weight, not just a purity percentage?",
          "Product clarity: does the listing say plainly whether the vial is unmodified Semax or a separately modified analog like Adamax, and at what strength?",
          "Shipping compliance: does the seller disclose which destinations it won't ship to, rather than leaving that out until checkout?",
        ],
      },
      {
        heading:
          "Semax nasal spray and lab preparation: what this listing does and doesn't cover",
        paragraphs: [
          "Semax's Russian clinical history uses an intranasal solution, which is why search traffic clusters around \"Semax nasal spray,\" reconstitution volumes, and questions about how much to use. Tetrava Labs doesn't provide human dosing, injection volumes, or nasal-spray-formulation instructions for Semax, and this page won't walk through how to make or use one. That's a compounding and administration question outside what an RUO catalog listing covers.",
          "For laboratory use, reconstitute the lyophilized vial under sterile technique with a diluent your protocol specifies, and record diluent lot, concentration, and reconstitution date in your ELN. Match those notes to the batch [Certificate of Analysis](/coa-library) so identity and purity data stay traceable to the exact vial used in an assay. This is preparation guidance for research settings only, not administration instructions.",
        ],
      },
      {
        heading: "Semax on forums and Reddit: anecdote versus evidence",
        paragraphs: [
          "Semax comes up regularly on r/nootropics and similar forums, usually as first-person reports about focus, mood, or how quickly someone noticed an effect. That's a different kind of information than the animal and clinical literature cited above, and it can't be reconciled with it directly, since forum posters aren't running blinded, controlled protocols with a measured endpoint.",
          "A Reddit thread can flag a vendor worth checking or a side effect worth reading up on. It's not a substitute for a lot-specific COA or a peer-reviewed citation, and a poster's account of how long Semax lasted for them carries no more evidentiary weight than any other uncontrolled report.",
        ],
      },
      {
        heading:
          "Is Semax legal in the US? Registered in Russia, reviewed by the FDA's compounding committee",
        paragraphs: [
          "Russia's Ministry of Health first registered Semax in 1994 as a low-concentration intranasal solution for cognitive disorders and optic-nerve disease, with a separate registration following for the acute ischemic stroke indication.[8] It has since been carried on Russia's list of vital and essential drugs. The FDA has never approved Semax in any form, and it carries no U.S. drug registration; nothing about the Russian registration changes that.",
          "In July 2026, the FDA's Pharmacy Compounding Advisory Committee reviewed seven peptide-related bulk drug substances nominated for the Section 503A Bulks List, the list that lets compounding pharmacies use a substance without a substance-specific approved drug behind it. Semax was one of the seven reviewed.[9] That's an open rulemaking docket, not an approval, and it doesn't make Semax legal for human use outside a licensed compounding pathway if one is eventually established. Tetrava Labs' catalog listing is a Research Use Only laboratory reagent regardless of how that rulemaking resolves.",
        ],
      },
      {
        heading: "Laboratory handling: reconstitution, storage, and documentation",
        paragraphs: [
          "Semax ships as a lyophilized powder, stable at -20°C away from light. Reconstitute under sterile technique with a protocol-appropriate diluent immediately before use, and avoid repeated freeze-thaw cycling once in solution.",
          "Hold reconstituted working solutions at 4°C and use them within the window your laboratory SOP sets. Record diluent lot, reconstitution date, and concentration in your ELN, and match those notes to the batch Certificate of Analysis so identity and purity data stay traceable to the exact vial used in an assay.",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "National Center for Biotechnology Information. PubChem Compound Summary for CID 9811102, Semax.",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/9811102",
      },
      {
        id: 2,
        citation:
          "Kolomin T, Shadrina M, Slominsky P, et al. A new generation of drugs: synthetic peptides based on natural regulatory peptides. Nat Sci. 2013;5(4A):72-91.",
        url: "https://doi.org/10.4236/ns.2013.54A011",
      },
      {
        id: 3,
        citation:
          "Shadrina M, Kolomin T, Agapova T, Agniullin Y, Shram S, Slominsky P, Lymborska S, Myasoedov N. Comparison of the temporary dynamics of NGF and BDNF gene expression in rat hippocampus, frontal cortex, and retina under Semax action. J Mol Neurosci. 2010;41(1):30-35.",
        url: "https://pubmed.ncbi.nlm.nih.gov/19662538/",
      },
      {
        id: 4,
        citation:
          "Romanova GA, Silachev DN, Shakova FM, Kvashennikova YN, Viktorov IV, Shram SI, Myasoedov NF. Neuroprotective and antiamnesic effects of Semax during experimental ischemic infarction of the cerebral cortex. Bull Exp Biol Med. 2006;142(6):663-666.",
        url: "https://pubmed.ncbi.nlm.nih.gov/17603664/",
      },
      {
        id: 5,
        citation:
          "Filippenkov IB, Stavchansky VV, Denisova AE, Yuzhakov VV, Sevan'kaeva LE, Sudarkina OY, Dmitrieva VG, Gubsky LV, Myasoedov NF, Limborska SA, Dergunova LV. Novel Insights into the Protective Properties of ACTH(4-7)PGP (Semax) Peptide at the Transcriptome Level Following Cerebral Ischaemia-Reperfusion in Rats. Genes (Basel). 2020;11(6):681.",
        url: "https://pubmed.ncbi.nlm.nih.gov/32580520/",
      },
      {
        id: 6,
        citation:
          "Sudarkina OY, Filippenkov IB, Stavchansky VV, Denisova AE, Yuzhakov VV, Sevan'kaeva LE, Valieva LV, Remizova JA, Dmitrieva VG, Gubsky LV, Myasoedov NF, Limborska SA, Dergunova LV. Brain Protein Expression Profile Confirms the Protective Effect of the ACTH(4-7)PGP Peptide (Semax) in a Rat Model of Cerebral Ischemia-Reperfusion. Int J Mol Sci. 2021;22(12):6179.",
        url: "https://pubmed.ncbi.nlm.nih.gov/34201112/",
      },
      {
        id: 7,
        citation:
          "Gusev EI, Martynov MY, Kostenko EV, Petrova LV, Bobyreva SN. The efficacy of semax in the treatment of patients at different stages of ischemic stroke. Zh Nevrol Psikhiatr Im S S Korsakova. 2018;118(3 Vyp 2):61-68.",
        url: "https://pubmed.ncbi.nlm.nih.gov/29798983/",
      },
      {
        id: 8,
        citation:
          "Federal Service for Surveillance in Healthcare (Roszdravnadzor), Russian Federation. State Registry of Medicines: Semax, registration No. 94/294/18, registered 20.12.1994.",
        url: "https://www.pharmcontrol.ru/registry/drugs/120688/",
      },
      {
        id: 9,
        citation:
          "U.S. Food and Drug Administration. Pharmacy Compounding Advisory Committee; Notice of Meeting; Establishment of a Public Docket; Request for Comments--Bulk Drug Substances Nominated for Inclusion on the Section 503A Bulk Drug Substances List. Fed Regist. 2026;91(73):20465 (Docket No. FDA-2025-N-6895).",
        url: "https://www.govinfo.gov/content/pkg/FR-2026-04-16/html/2026-07361.htm",
      },
      {
        id: 10,
        citation:
          "Zolotarev YA, Dolotov OV, Inozemtseva LS, Dadayan AK, Dorokhova EM, Andreeva LA, Alfeeva LY, Grivennikov IA, Myasoedov NF. Degradation of the ACTH(4-10) analog Semax in the presence of rat basal forebrain cell cultures and plasma membranes. Amino Acids. 2006;30(4):403-408.",
        url: "https://pubmed.ncbi.nlm.nih.gov/16773243/",
      },
      {
        id: 11,
        citation:
          "Polunin GS, Nurieva SM, Baiandin DL, Sheremet NL, Andreeva LA. Evaluation of therapeutic effect of new Russian drug semax in optic nerve disease. Vestn Oftalmol. 2000;116(1):15-18.",
        url: "https://pubmed.ncbi.nlm.nih.gov/10741256/",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-08-18",
  },
};

export function getProductResearchDetail(
  parentHandle: string,
): ProductResearchDetail | null {
  return PRODUCT_RESEARCH_DETAIL[parentHandle] || null;
}
