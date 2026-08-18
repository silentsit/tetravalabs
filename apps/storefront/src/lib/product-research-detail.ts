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
  tirzepatide: {
    shortDescription: [
      "Tirzepatide is a 39-amino-acid synthetic peptide built from the native GIP sequence and modified so one molecule activates both the GIP receptor and the GLP-1 receptor.[1] The best-known brand names are Mounjaro and Zepbound, both Lilly products, but those approved pens are not the same thing as a lyophilized research vial bought through a peptide catalog.[4][5]",
      "Tetrava Labs sells tirzepatide as a sterile, lyophilized reagent for laboratory work on dual-incretin signaling, receptor pharmacology, and comparative metabolic models. Labs often use tirzepatide as the reference dual agonist when comparing newer compounds against [semaglutide](/buy-semaglutide-online) or [retatrutide](/buy-retatrutide-online). The identity fields in the Specifications tab are cross-checked against the PubChem compound record for tirzepatide.[1] Every lot ships with third-party HPLC-verified identity and purity data. This compound is sold strictly for research use. It is not for human or veterinary consumption.",
    ],
    otherKnownTitles: ["LY3298176", "LY-3298176", "Mounjaro", "Zepbound"],
    sections: [
      {
        heading: "What tirzepatide is",
        paragraphs: [
          "PubChem lists tirzepatide as a 39-amino-acid linear peptide conjugated to a C20 fatty diacid moiety.[1] That lipid tail is why the molecule behaves differently from a short, unmodified peptide in storage and assay design. It is not a simple copy of endogenous GLP-1, and it is not a small molecule dressed up as one.",
          "Search traffic also mixes together three different things under one name: Lilly's approved drug products, compounded prescription products made in pharmacies, and Research Use Only bulk material sold to laboratories. They are not the same supply chain. This page is the third one: a documented RUO reagent in a lyophilized vial, not a branded pen and not a compounded prescription product.[4][5]",
        ],
      },
      {
        heading: "How tirzepatide works",
        paragraphs: [
          "Tirzepatide activates two incretin receptors at once, GIP and GLP-1.[1] That is the whole reason the molecule matters. A GLP-1 agonist already slows gastric emptying and drives glucose-dependent insulin secretion. Adding GIP changes the signal mix again, which is why tirzepatide is usually discussed as a dual agonist rather than just \"another GLP-1.\"",
          "In the lab, that dual-receptor profile makes tirzepatide a useful comparator. If a study is trying to separate GLP-1-only activity from dual-incretin activity, [semaglutide](/buy-semaglutide-online) is the obvious single-receptor reference and tirzepatide is the obvious dual-receptor reference. If the study adds glucagon-receptor activity, the next step up is [retatrutide](/buy-retatrutide-online).",
        ],
      },
      {
        heading: "Tirzepatide vs semaglutide",
        paragraphs: [
          "The cleanest published comparison is SURMOUNT-5, a head-to-head obesity trial that compared approved tirzepatide against approved semaglutide, not research vials bought online.[3] Tirzepatide beat semaglutide on body-weight change and waist-circumference change over the same treatment window. That is the trial result people are usually pointing to when they search \"semaglutide vs tirzepatide.\"",
          "Mechanistically, the split is simpler than the market copy makes it sound. Semaglutide hits GLP-1 only. Tirzepatide hits GIP and GLP-1. That does not make tirzepatide a universal upgrade for every assay. It means the molecule answers a different receptor question, and that question should be written into the protocol before a lab orders the vial.",
        ],
      },
      {
        heading: "What the human trials actually measured",
        paragraphs: [
          "SURMOUNT-1 put tirzepatide on the map for obesity work. Over 72 weeks, the approved once-weekly product produced mean weight-loss figures that ran from about 15% to 21% depending on dose, versus about 3% on placebo.[2] Those numbers belong to a supervised clinical-trial program using a regulated product, a fixed escalation schedule, and named endpoints. They do not tell you what is in a random online vial.",
          "That distinction matters on this page. Searches like \"tirzepatide for weight loss,\" \"does tirzepatide work,\" and \"what is tirzepatide used for\" usually point back to branded-drug trial data. A research listing borrows the same molecule name, not the same approval status, device, storage chain, or dosing program. The work of a serious supplier is to document identity and purity for the material actually shipped, not to borrow Eli Lilly's trial reputation.",
        ],
      },
      {
        heading: "Side effects and safety: what the approved-drug literature says",
        paragraphs: [
          "The common adverse events in the approved-drug literature are gastrointestinal: nausea, diarrhea, vomiting, constipation, and related dose-escalation dropouts.[2][5] That pattern is not unusual for incretin agonists. It is also the reason trial safety tables need to stay attached to the regulated drug product they came from, not copied onto a research-vial listing as if they were a property of all tirzepatide everywhere.",
          "Searches for hair loss, fatigue, or \"does tirzepatide make you tired\" are usually looking for patient-experience answers. Those effects do turn up in labels, forums, and post-marketing discussion, but they are not the core signal the pivotal trials are built around. This page does not turn supervised clinical safety data into a safety claim for unsupervised use. It sells a laboratory reagent.",
        ],
      },
      {
        heading: "FDA approval, brand names, and compounded tirzepatide",
        paragraphs: [
          "Mounjaro was FDA-approved in 2022 for glycemic control in type 2 diabetes.[4] Zepbound followed in 2023 for chronic weight management.[5] Those are the two brand names most users mean when they search \"tirzepatide brand name\" or ask whether Zepbound is tirzepatide. Yes, Zepbound contains tirzepatide. No, that fact does not make every tirzepatide listing interchangeable with Zepbound.",
          "Compounded tirzepatide is a different category again. Pharmacy compounding sits inside federal and state drug-compounding rules, and those rules changed once tirzepatide was no longer being handled under shortage conditions.[6] A lyophilized research vial sold under RUO terms is not an approved pen and not a compounded prescription product. If a page blurs those lines, that is a warning sign, not a convenience.",
        ],
      },
      {
        heading: "Buying tirzepatide for research: what to verify first",
        paragraphs: [
          "\"Best place to buy tirzepatide\" is really a documentation question. A lab does not need the cheapest page. A lab needs the page that can prove what lot is being sold.",
        ],
        bullets: [
          "Lot match: the lot number on the vial should match the lot number on the Certificate of Analysis.",
          "Identity, not just purity: a 99% line without a lot-linked LC-MS or HPLC record is marketing copy.",
          "Real storage language: the supplier should describe sealed lyophilized storage, cold handling, and how the material ships.",
          "No human-use framing: pages built around unit conversions, injections, before-and-after claims, or Reddit-style sourcing chatter are telling you who the real buyer is.",
          "Price in context: a cheap tirzepatide listing without a lot-specific COA is not a bargain. It is an undocumented purchase.",
        ],
      },
      {
        heading: "Reconstitution, storage, and the 20mg/mL confusion",
        paragraphs: [
          "\"Buy tirzepatide 20mg/ml\" mixes concentration language from other product formats with this page's actual catalog format. Tetrava lists tirzepatide as a lyophilized vial in fixed strengths. A 20 mg vial is not the same thing as a 20 mg/mL finished solution, and the two should not be treated as interchangeable labels.[5][6]",
          "This page does not publish a starting dose, a milligram-to-units conversion, or injection instructions. In the lab, final concentration belongs in the assay SOP. Store sealed vials at -20 C, reconstitute under sterile technique with a protocol-appropriate diluent, avoid repeat freeze-thaw cycling, and log the diluent lot, concentration, operator, and date against the batch [Certificate of Analysis](/coa-library).",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "National Center for Biotechnology Information. PubChem Compound Summary for CID 156588324, Tirzepatide.",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/156588324",
      },
      {
        id: 2,
        citation:
          "Jastreboff AM, Aronne LJ, Ahmad NN, et al. Tirzepatide once weekly for the treatment of obesity. N Engl J Med. 2022;387(3):205-216.",
        url: "https://pubmed.ncbi.nlm.nih.gov/35658024/",
      },
      {
        id: 3,
        citation:
          "Aronne LJ, Horn DB, le Roux CW, et al. Tirzepatide as compared with semaglutide for the treatment of obesity (SURMOUNT-5). N Engl J Med. 2025;393(1):26-36.",
        url: "https://pubmed.ncbi.nlm.nih.gov/40353578/",
      },
      {
        id: 4,
        citation:
          "U.S. Food and Drug Administration. FDA approves novel, dual-targeted treatment for type 2 diabetes. May 13, 2022.",
        url: "https://www.fda.gov/news-events/press-announcements/fda-approves-novel-dual-targeted-treatment-type-2-diabetes",
      },
      {
        id: 5,
        citation:
          "U.S. Food and Drug Administration. FDA approves new medication for chronic weight management. Nov 8, 2023.",
        url: "https://www.fda.gov/news-events/press-announcements/fda-approves-new-medication-chronic-weight-management",
      },
      {
        id: 6,
        citation:
          "U.S. Food and Drug Administration. Interim policy on compounding using bulk drug substances under section 503A and 503B of the Federal Food, Drug, and Cosmetic Act.",
        url: "https://www.fda.gov/media/94155/download",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-08-18",
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
          "That's an intranasal rat study. Tetrava Labs lists a finished [Selank nasal spray](/buy-selank-nasal-spray-online) as a separate catalog SKU; this page is the lyophilized vial. The 2008 paper does not publish a dose-response curve for either form.",
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
          "\"Semax and Selank\" gets searched as a pair because researchers studying stress and cognition sometimes look at both, not because a combined-use trial exists. No published study reviewed for this page tests Selank and Semax administered together, so there's no dosing or interaction data to cite for that combination. Tetrava Labs carries [Semax](/buy-semax-online) and Selank as separate Research Use Only catalog listings. Selank also has a finished [nasal spray](/buy-selank-nasal-spray-online) SKU.",
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
  "selank-nasal-spray-10mg": {
    shortDescription: [
      "Selank nasal spray is the same tuftsin-derived heptapeptide as lyophilized Selank, Thr-Lys-Pro-Arg-Pro-Gly-Pro, supplied here as a finished aqueous research spray rather than a powder vial. PubChem lists the compound under CID 11765600, molecular formula C33H57N11O9, molecular weight 751.89.[1] Russia's Ministry of Health registered Selank in 2009 as a 0.15% intranasal solution, which is why so much of the published work, and so much of the search traffic, is about a spray and not a syringe.[6]",
      "Tetrava Labs lists this SKU as a single 10 mg research spray at $79, with no pack tiers and no second strength. Every lot ships with third-party HPLC-verified identity and purity data. Buy Selank nasal spray online here for laboratory research only. It is not for human or veterinary consumption, and this page will not tell you how to take it.",
    ],
    otherKnownTitles: [
      "TP-7",
      "Selank Acetate",
      "Tuftsin-PGP",
      "Thr-Lys-Pro-Arg-Pro-Gly-Pro",
      "Selank peptide nasal spray",
    ],
    sections: [
      {
        heading: "What Selank nasal spray is, and what it is not",
        paragraphs: [
          "Selank is a seven-residue analog of tuftsin, the tetrapeptide Thr-Lys-Pro-Arg cleaved from immunoglobulin G, with a Pro-Gly-Pro tail added at the C-terminus. That tail is the same carboxypeptidase-slowing trick used on Semax at Russia's Institute of Molecular Genetics.[2] The molecule on this page is unmodified Selank, a free carboxylic acid at the C-terminus, not N-Acetyl Selank Amidate.",
          "This listing is a finished nasal spray. It is not the 5 mg or 10 mg lyophilized [Selank](/buy-selank-online) vial, and it is not a kit for mixing powder into a pump bottle. If a protocol needs a dry reagent you reconstitute yourself, use the vial SKU. If the protocol needs a ready aqueous spray format, this is the catalog item.",
        ],
      },
      {
        heading: "Why so much Selank research is intranasal",
        paragraphs: [
          "The registered Russian product is an intranasal solution. That fact drives the literature more than any marketing claim about 'better bioavailability.' The 2008 trial most often cited for Selank's anxiolytic profile used that pharmaceutical context, and the 2008 rat BDNF paper dosed Selank into the nose on purpose.[5][6]",
          "Intranasal peptide work in animals is often chosen because the olfactory and trigeminal routes can put material near CNS tissue without a systemic injection. That is a study-design reason, not a proven human pharmacokinetic map for this 10 mg research spray. If your assay is in vitro, a spray bottle is the wrong tool.",
        ],
      },
      {
        heading: "What does Selank nasal spray do in the published literature",
        paragraphs: [
          "The mechanistic papers do not describe a consumer wellness product. They describe enzyme kinetics, gene panels, and a small clinical comparison.",
          "In vitro, Selank blocked the peptidases that degrade leu-enkephalin, with an IC50 around 15 micromolar, and outperformed bacitracin and puromycin in that assay.[3] A 2016 rat study then reported expression changes across genes involved in GABAergic neurotransmission after Selank administration, the same inhibitory system benzodiazepines hit at GABA-A receptors.[4] Those are two separate hypotheses, enzyme blockade and gene-expression shift, not one settled receptor-binding story.",
        ],
      },
      {
        heading: "Intranasal Selank and hippocampal BDNF",
        paragraphs: [
          "A 2008 paper gave rats Selank intranasally and measured BDNF expression in the hippocampus afterward.[5] BDNF is a standard neurotrophin readout in stress and plasticity models because chronic stress tends to suppress it. The study reported that the intranasal route changed hippocampal BDNF in vivo.",
          "That is the citation behind 'does Selank nasal spray work' questions that want a brain-side mechanism. It is a rat paper with a fixed protocol, not a timer for when a person would feel something, and not a claim about Tetrava's bottle used outside a laboratory.",
        ],
      },
      {
        heading: "The anxiety trial people quote, and its limits",
        paragraphs: [
          "The human study behind most 'Selank for anxiety' copy is a 2008 Russian randomized comparison in 62 patients with generalized anxiety disorder or neurasthenia: 30 on Selank, 32 on medazepam, scored on Hamilton, Zung, and Clinical Global Impression scales plus blood enkephalin activity.[6] Anxiolytic scores were comparable. The abstract also reports antiasthenic and psychostimulant effects on the Selank arm that it does not report for medazepam.",
          "One single-country trial, no placebo arm described in the abstract, no FDA review. Treat it as the basis for Russia's 2009 registration, not as proof that a research spray treats anxiety. Tetrava Labs does not sell a medicine.",
        ],
      },
      {
        heading: "Selank nasal spray vs injection, and vs mixing powder",
        paragraphs: [
          "Searches for 'Selank nasal spray vs injection which is better' assume a personal-use ranking. In the literature, route follows the question. The registered pharmaceutical product is nasal. Mechanistic enzyme work was done in vitro. Some animal gene-expression work is not even specified as nasal in the English abstract.[4] Injection from a reconstituted lyophilized vial is a different experimental setup: known volume, known concentration, no spray-device variability.",
          "This SKU does not need reconstitution. Questions about how to make Selank nasal spray, how to mix it, how to prepare it, or how to reconstitute Selank powder for a spray are asking for a compounding recipe. This page will not publish one. If you need powder, buy the [lyophilized Selank](/buy-selank-online) vial and write the diluent, concentration, and device into your laboratory SOP. Do not treat a forum recipe as a method.",
        ],
      },
      {
        heading: "Does Selank nasal spray need to be refrigerated",
        paragraphs: [
          "Yes. The lot paperwork for this spray specifies 2-8°C, protected from light, and do not freeze. That is a different storage rule from lyophilized Selank, which is held at -20°C dry.",
          "How to store Selank nasal spray in a lab: keep the primary container sealed until use, log temperature excursions, and do not freeze the aqueous solution. How long the unopened bottle is dated for is on the COA (manufacture and expiry for the batch in hand), not a universal number this page can invent. Once a spray device is in use, follow your SOP for in-use time; this catalog listing will not give a household 'how long does it last after opening' window.",
        ],
      },
      {
        heading: "How long it lasts, and how long until effects",
        paragraphs: [
          "No pharmacokinetic study reviewed for this page publishes a plasma half-life for intact Selank the way a drug label would. The 2008 clinical comparison ran a 14-day course before scoring outcomes, which is a protocol length, not an onset clock.[6] The BDNF rat paper measured expression after intranasal dosing; it does not translate into 'how long until effects' for a person.",
          "Forum timelines about feeling something in minutes are uncontrolled reports. They are not a substitute for the assay timepoints in the paper you are actually replicating.",
        ],
      },
      {
        heading: "Selank and Semax nasal spray: two peptides, no combo product",
        paragraphs: [
          "Selank and Semax share a Moscow origin and the Pro-Gly-Pro tail. Selank is built from tuftsin and is studied for anxiolytic and immune-adjacent endpoints. Semax is built from an ACTH fragment and is studied for neurotrophic and ischemia endpoints.[2] They are not interchangeable, and they are not a single spray.",
          "No published trial reviewed here tests Semax and Selank together, so there is no combined dosage chart and no instruction for how to make Semax and Selank nasal spray. Tetrava Labs sells [Semax](/buy-semax-online) as lyophilized powder and Selank in both vial and this spray format. If a protocol needs both molecules, they stay separate reagents.",
        ],
      },
      {
        heading: "Where to buy Selank nasal spray, and what to check",
        paragraphs: [
          "You can buy Selank nasal spray online from Tetrava Labs on this page, 10 mg, one bottle, $79. Shipping for a spray-only cart is $9 on this site; mixed carts use the standard research-peptide rate. Checkout is card (Peptide Pay) or crypto. ACH is not a listed method here, even if a search query names it.",
          "UK and other international orders depend on destination rules that change. Check [shipping restrictions](/shipping-restricted) before you order. Tetrava Labs does not tell you how any country classifies this peptide.",
        ],
        bullets: [
          "Lot match: the COA batch number has to match the bottle in hand, not a recycled PDF.",
          "Identity: HPLC purity plus sequence or mass confirmation for Thr-Lys-Pro-Arg-Pro-Gly-Pro, CAS 129954-34-3.",
          "Format: the listing should say finished nasal spray versus lyophilized powder, and the storage temperature should match (2-8°C here, not -20°C).",
          "Claims: a vendor ranking itself 'best place to buy Selank nasal spray 2026' without a lot-linked COA is selling a sentence, not a reagent.",
        ],
      },
      {
        heading: "How to use this spray in a laboratory, and what this page will not answer",
        paragraphs: [
          "Handle the bottle under your chemical-hygiene plan. Prime a research spray device only if your SOP says to. Record operator, time, lot, and any temperature excursion in the ELN. Do not share applicators across operators or study arms.",
          "This page does not answer how to take Selank nasal spray, how to use it on a person, or what dose to administer. Those queries are asking for human instructions. The catalog item is Research Use Only. For reconstitution math on powder, use the lyophilized Selank page and your own SOP, not a copy-pasted milliliter chart from a forum.",
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
          "\"Semax and Selank\" gets searched as a pair, sometimes stacked as a nasal spray combination, because researchers studying stress and cognition sometimes look at both compounds side by side. No published study reviewed for this page tests Semax and Selank administered together, so there's no combined dosage chart, dosing protocol, or interaction data to cite. Tetrava Labs carries Semax and [Selank](/buy-selank-online) as separate Research Use Only catalog listings. Selank also has a finished [nasal spray](/buy-selank-nasal-spray-online); Semax on this page is lyophilized powder.",
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
  dsip: {
    shortDescription: [
      "DSIP, Delta Sleep-Inducing Peptide, is a nonapeptide, nine amino acids: Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu. Swiss researchers Michel Monnier and Gottfried Schoenenberger isolated it from the cerebral venous blood of rabbits during electrically induced sleep and published the full characterization in 1977.[1] Molecular formula C35H48N10O15, molecular weight 848.8, cross-referenced against the PubChem compound record for CAS 62568-57-4.[2] Its International Nonproprietary Name, the label FDA uses in its own compounding review, is emideltide.",
      "Tetrava Labs supplies DSIP as a sterile, lyophilized reagent, 5 mg, 10 mg, or 15 mg vials, for laboratory research into sleep architecture, stress physiology, and neuroendocrine signaling. Every lot ships with third-party HPLC-verified identity and purity data. Buy DSIP online here for research use only; it is not for human or veterinary consumption.",
    ],
    otherKnownTitles: [
      "Emideltide",
      "DSIP Nonapeptide",
      "Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu",
    ],
    sections: [
      {
        heading:
          "What DSIP is: a peptide pulled from the blood of a sleeping rabbit",
        paragraphs: [
          "The discovery story is unusual even by peptide standards. Monnier's lab was running cross-circulation experiments, dialyzing blood from rabbits during electrically induced sleep and infusing the dialysate into awake animals, when they noticed the transferred fraction pushed the recipient's EEG toward delta waves, the slow, high-amplitude pattern of deep non-REM sleep. They isolated the active fraction, sequenced it, and published DSIP as a defined nonapeptide in 1977.[1] The name describes the observed effect, not a confirmed hormone class.",
          "Later structural surveys found DSIP-like immunoreactivity in neurons, peripheral organs, and plasma across several species.[2] Stress hormone regulation, circadian rhythm, and withdrawal pharmacology all show up in the DSIP literature as a result. None of that breadth resolved what DSIP binds to first.",
        ],
      },
      {
        heading: "How DSIP is thought to work: a mechanism nobody has pinned down",
        paragraphs: [
          "A 2006 review in the Journal of Neurochemistry, written by two researchers who had studied DSIP for years, is titled plainly: \"Delta sleep-inducing peptide (DSIP): a still unresolved riddle.\"[3] That title is the honest summary of the field. Decades after the 1977 discovery paper, no study has identified a DSIP-specific receptor, and the peptide's name is now considered something of a misnomer, since some studies find it promotes delta sleep and others don't replicate that effect cleanly.",
          "What is published are downstream observations: shifts in neurotransmitter levels, hormonal changes, altered locomotor and circadian patterns, and modified responses to other neuropharmacological drugs, including withdrawal symptoms.[3] Researchers designing a DSIP assay are generally not testing a single validated pathway. They're testing one of several candidate effects reported in a literature that never converged on a receptor.",
        ],
      },
      {
        heading:
          "The 1980s human trials: chronic pain and withdrawal syndromes",
        paragraphs: [
          "DSIP has an older human clinical record than most catalog peptides. A 1983 case series found delta sleep-inducing peptide eased withdrawal symptoms in patients being weaned from opiates, reasoning it might carry weak agonist activity at opiate receptors.[4] A 1984 follow-up in European Neurology tested DSIP specifically against alcohol and opiate withdrawal syndromes.[5] The same 1984 issue carried a separate pilot study using DSIP in patients with chronic, pronounced pain episodes.[6]",
          "These are small, decades-old European studies, not FDA-reviewed trials, and none of them used the sequence-confirmed reagent grade sold here. Treat them as the historical basis for later interest in DSIP, not as a modern efficacy dataset.",
        ],
      },
      {
        heading:
          "Modern preclinical revival: sleep architecture, memory, and stroke models",
        paragraphs: [
          "DSIP research didn't stop in the 1980s. A 2018 study in Life Sciences found that a phosphorylated DSIP analog restored spatial memory and CREB phosphorylation in rats whose sleep architecture had been disrupted by simulated high altitude. The memory result and the sleep-quality result came from the same animal model.[7] A 2021 study in Molecules reported that DSIP improved motor-function recovery in rats after a focal cortical stroke.[8] A companion 2021 paper in Biomedicines tested a DSIP-like analog called KND. It reduced brain infarct size in mice and myocardial infarct size in rats when given during reperfusion.[9]",
          "Most recently, a 2024 paper in Frontiers in Pharmacology engineered a DSIP fusion peptide designed to cross the blood-brain barrier and tested it in a PCPA-induced insomnia mouse model.[10] Read these four papers as a live, active research thread, not a settled conclusion. All four are rodent studies from a small number of labs, and none has an independent Western replication.",
        ],
      },
      {
        heading:
          "DSIP and stress physiology: a hepatoprotective signal worth noting",
        paragraphs: [
          "A separate line of Russian research looked at DSIP's effect outside the brain entirely. Studies from 2015 and 2016 measured hepatocyte function in rats subjected to restraint stress and foot-shock stress, and found DSIP administration was associated with a protective shift in liver-cell markers compared with stressed, untreated controls.[11] That's a peripheral-organ stress-response finding, a different endpoint than sleep EEG or infarct volume.",
        ],
      },
      {
        heading: "Engineering DSIP for delivery: fusion peptides and the BBB",
        paragraphs: [
          "Native DSIP is a short, unmodified nonapeptide, and short peptides generally clear fast and cross the blood-brain barrier inefficiently. A 2017 paper in Protein & Peptide Letters described producing DSIP fused to a protein transduction domain and human serum albumin in Pichia pastoris yeast, an engineering approach aimed at improving delivery and persistence.[12] The 2024 fusion-peptide insomnia study cited above uses a related strategy.[10] Those are drug-delivery research programs building on DSIP, not descriptions of the lyophilized reagent sold on this page, which is unmodified, sequence-confirmed DSIP only.",
        ],
      },
      {
        heading: "Buying DSIP for research: what to verify before you order",
        paragraphs: [
          "\"DSIP peptide 10mg 99% lab tested\" and similar search phrases point at the same underlying question: is the purity claim backed by anything. Before treating a supplier as qualified, look at:",
        ],
        bullets: [
          "Lot identity: does the listing give a batch or lot number that matches the Certificate of Analysis shipped with the vial, or is the PDF generic or reused across products?",
          "COA/HPLC traceability: is the COA from an independent third-party lab, reporting purity by area-under-curve HPLC rather than an in-house claim?",
          "Identity confirmation: does the COA or an accompanying mass-spec report confirm DSIP's nine-residue sequence and molecular weight, not just a purity percentage?",
          "INN awareness: does the listing recognize emideltide as the same substance, or does it read like a template that's never checked the FDA docket?",
          "Shipping compliance: does the seller disclose which destinations it won't ship to, rather than leaving that out until checkout?",
        ],
      },
      {
        heading:
          "Injecting or dosing DSIP: what this listing does and doesn't cover",
        paragraphs: [
          "\"How much DSIP to inject,\" \"where to inject DSIP,\" and \"DSIP dosage calculator\" are common searches, and this page won't answer any of them. Tetrava Labs doesn't provide human dosing, injection volumes, or administration protocols for DSIP, and a dosing chart built from the small 1980s clinical pilots above wouldn't be a responsible thing to publish as a general recommendation. That's a question for a licensed prescriber operating under a specific compounding pathway, not an RUO catalog listing.",
          "For laboratory use, reconstitute the lyophilized vial under sterile technique with a diluent your protocol specifies, and record diluent lot, concentration, and reconstitution date in your ELN. Match those notes to the batch [Certificate of Analysis](/coa-library) so identity and purity data stay traceable to the exact vial used in an assay.",
        ],
      },
      {
        heading:
          "Is DSIP legal in the US? The one peptide the FDA's committee voted down",
        paragraphs: [
          "DSIP has never been FDA-approved and carries no U.S. drug registration. In July 2026, the FDA's Pharmacy Compounding Advisory Committee reviewed seven peptide-related bulk drug substances nominated for the Section 503A Bulks List, the list that lets compounding pharmacies use a substance without a substance-specific approved drug behind it.[13] DSIP, listed in the docket under emideltide, was one of them.",
          "Six of the seven got a favorable recommendation. DSIP didn't. The committee voted against including it, 6 in favor to 7 opposed with one abstention, the sole rejection of the two-day session.[14] FDA staff briefing documents cited two specific gaps: no safety data at all for the subcutaneous route DSIP is typically proposed for, and insufficient safety data even for the intravenous route where some data exists.[15] That's a narrower, more specific finding than a generic \"not enough evidence\" conclusion.",
          "Committee members who voted against inclusion raised a related point during the hearing: DSIP's clearest supporting human study is from the early 1990s, and the common name has historically covered more than one chemically distinct molecule, which complicates characterization and impurity testing.[16] That's an advisory vote, not a final rule; the FDA can still act independently through formal rulemaking. It's a materially different regulatory posture than the other six peptides reviewed alongside it, and it doesn't change this catalog listing's status: a Research Use Only laboratory reagent, not a compounding-eligible substance.",
        ],
      },
      {
        heading: "Laboratory handling: reconstitution, storage, and documentation",
        paragraphs: [
          "DSIP ships as a lyophilized powder, stable at -20°C away from light. Reconstitute under sterile technique with a protocol-appropriate diluent immediately before use, and avoid repeated freeze-thaw cycling once in solution.",
          "Hold reconstituted working solutions at 4°C and use them within the window your laboratory SOP sets. Record diluent lot, reconstitution date, and concentration in your ELN, and match those notes to the batch Certificate of Analysis so identity and purity data stay traceable to the exact vial used in an assay.",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "Schoenenberger GA, Monnier M. Characterization of a delta-electroencephalogram(-sleep)-inducing peptide. Proc Natl Acad Sci U S A. 1977;74(3):1282-1286.",
        url: "https://pubmed.ncbi.nlm.nih.gov/265572/",
      },
      {
        id: 2,
        citation:
          "National Center for Biotechnology Information. PubChem Compound Summary for CID 68816, Delta Sleep-Inducing Peptide.",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/68816",
      },
      {
        id: 3,
        citation:
          "Kovalzon VM, Strekalova TV. Delta sleep-inducing peptide (DSIP): a still unresolved riddle. J Neurochem. 2006;97(2):303-309.",
        url: "https://pubmed.ncbi.nlm.nih.gov/16539679/",
      },
      {
        id: 4,
        citation:
          "Dick P, Grandjean ME, Tissot R. Successful treatment of withdrawal symptoms with delta sleep-inducing peptide, a neuropeptide with potential agonistic activity on opiate receptors. Neuropsychobiology. 1983;10(4):205-208.",
        url: "https://pubmed.ncbi.nlm.nih.gov/6328354/",
      },
      {
        id: 5,
        citation:
          "Dick P, Costa C, Fayolle K, Grandjean ME, Khoshbeen A, Tissot R. DSIP in the treatment of withdrawal syndromes from alcohol and opiates. Eur Neurol. 1984;23(5):364-371.",
        url: "https://pubmed.ncbi.nlm.nih.gov/6548969/",
      },
      {
        id: 6,
        citation:
          "Larbig W, Gerber WD, Kluck M, Schoenenberger GA. Therapeutic effects of delta-sleep-inducing peptide (DSIP) in patients with chronic, pronounced pain episodes. A clinical pilot study. Eur Neurol. 1984;23(5):372-385.",
        url: "https://pubmed.ncbi.nlm.nih.gov/6548970/",
      },
      {
        id: 7,
        citation:
          "Roy K, Chauhan G, Kumari P, Wadhwa M, Alam S, Ray K, Panjwani U, Kishore K. Phosphorylated delta sleep inducing peptide restores spatial memory and p-CREB expression by improving sleep architecture at high altitude. Life Sci. 2018;209:282-290.",
        url: "https://pubmed.ncbi.nlm.nih.gov/30107169/",
      },
      {
        id: 8,
        citation:
          "Tukhovskaya EA, Ismailova AM, Shaykhutdinova ER, Slashcheva GA, Prudchenko IA, Mikhaleva II, Khokhlova ON, Murashev AN, Ivanov VT. Delta Sleep-Inducing Peptide Recovers Motor Function in SD Rats after Focal Stroke. Molecules. 2021;26(17):5173.",
        url: "https://pubmed.ncbi.nlm.nih.gov/34500605/",
      },
      {
        id: 9,
        citation:
          "Tukhovskaya EA, Shaykhutdinova ER, Ismailova AM, Slashcheva GA, Prudchenko IA, Mikhaleva II, Khokhlova ON, Murashev AN, Ivanov VT. DSIP-Like KND Peptide Reduces Brain Infarction in C57Bl/6 and Reduces Myocardial Infarction in SD Rats When Administered during Reperfusion. Biomedicines. 2021;9(4):407.",
        url: "https://pubmed.ncbi.nlm.nih.gov/33918965/",
      },
      {
        id: 10,
        citation:
          "Mu X, Qu L, Yin L, Wang L, Liu X, Liu D. Pichia pastoris secreted peptides crossing the blood-brain barrier and DSIP fusion peptide efficacy in PCPA-induced insomnia mouse models. Front Pharmacol. 2024;15:1439536.",
        url: "https://pubmed.ncbi.nlm.nih.gov/39444618/",
      },
      {
        id: 11,
        citation:
          "Bobyntsev II, Kryukov AA, Belykh AE, Dudka VT. Effect of Delta Sleep-Inducing Peptide on Functional State of Hepatocytes in Rats During Restraint Stress. Bull Exp Biol Med. 2016;160(4):421-424.",
        url: "https://pubmed.ncbi.nlm.nih.gov/26902351/",
      },
      {
        id: 12,
        citation:
          "Zhang XG, Wang WN, Zhang CS, Li K, Ma GD, Li JY. Expression and Purification of Delta Sleep-Inducing Peptide Fused with Protein Transduction Domain and Human Serum Albumin in Pichia pastoris. Protein Pept Lett. 2017;24(7):668-675.",
        url: "https://pubmed.ncbi.nlm.nih.gov/28462721/",
      },
      {
        id: 13,
        citation:
          "U.S. Food and Drug Administration. Pharmacy Compounding Advisory Committee; Notice of Meeting; Establishment of a Public Docket; Request for Comments--Bulk Drug Substances Nominated for Inclusion on the Section 503A Bulk Drug Substances List. Fed Regist. 2026;91(73):20465 (Docket No. FDA-2025-N-6895).",
        url: "https://www.govinfo.gov/content/pkg/FR-2026-04-16/html/2026-07361.htm",
      },
      {
        id: 14,
        citation:
          "Kelley Drye & Warren LLP. FDA Advisory Committee Recommends Several Peptides for Compounding for Various Uses Despite Staff Opposition: What Stakeholders Need to Know. Ad Law Access (blog). 2026.",
        url: "https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/fda-advisory-committee-recommends-several-peptides-for-compounding-for-various-uses-despite-staff-opposition-what-stakeholders-need-to-know",
      },
      {
        id: 15,
        citation:
          "Bass, Berry & Sims PLC. FDA Advisory Committee Recommends Six Peptides for Compounding: What the Evaluation Criteria Tell Us About the Road Ahead. Firm publication. 2026.",
        url: "https://www.bassberry.com/news/fda-advisory-committee-recommends-six-peptides-for-compounding-what-the-evaluation-criteria-tell-us-about-the-road-ahead/",
      },
      {
        id: 16,
        citation:
          "Hyman, Phelps & McNamara, P.C. The PEPTIDE-L Wave Rolls On! PCAC Adds Two More Bulk Drug Substances for the 503A List. FDA Law Blog. 2026.",
        url: "https://www.thefdalawblog.com/2026/07/the-peptide-l-wave-rolls-on-pcac-adds-two-more-bulk-drug-substances-for-the-503a-list/",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-08-18",
  },
  "cu-50mg-tb500-10mg-bpc-157-10mg-kpv-10mg-80mg": {
    shortDescription: [
      "KLOW is what people search for when they mean an 80mg, four-peptide research blend: BPC-157 10mg, TB-500 10mg, GHK-Cu 10mg, and KPV 50mg, lyophilized into one vial. That's the whole product. Tetrava Labs sells it strictly for laboratory research. It isn't an FDA-approved drug, it isn't a supplement, and it isn't meant for a person or an animal to consume.",
      'The name isn\'t official anywhere.',
      'It follows the same pattern as [GLOW Blend](/glow-bpc-157-tb-500-ghk-cu), which uses the first three of these four peptides. KLOW just adds a fourth: KPV, a tripeptide studied for anti-inflammatory signaling that has nothing to do with the tissue-repair work behind [BPC-157](/buy-bpc-157-online) and [TB-500](/buy-tb-500-online), or the copper-gene work behind GHK-Cu. Whoever coined "KLOW" and "GLOW" was borrowing initials, not describing a mechanism. The Certificate of Analysis is what actually tells you what\'s in the vial.',
    ],
    otherKnownTitles: [
      "KLOW Blend",
      "KLOW Stack",
      "KLOW Peptide Blend",
      "BPC-157 / TB-500 / GHK-Cu / KPV Blend",
      "CU 50mg + TB500 10mg + BPC-157 10mg + KPV 10mg (80mg)",
    ],
    sections: [
      {
        heading: "What each peptide in KLOW Blend is studied for",
        paragraphs: [
          "BPC-157 came out of gastric-juice research at the University of Zagreb in the 1990s. It's a synthetic 15-amino-acid fragment built from a longer gastroprotective protein, and it shows up mostly in tissue-repair, angiogenesis, and gut-mucosal-protection studies in animal models.[1]",
          "TB-500 is a name, not a peptide sequence in its own right. Mass spectrometry traced the material sold under that name to the N-terminal acetylated 17-23 fragment of thymosin beta-4, a short stretch cut from a much larger 4,963-dalton protein.[2] Researchers use it in actin-regulation and cell-migration work. The full-length protein and the fragment aren't interchangeable, and older thymosin beta-4 literature doesn't automatically carry over to TB-500.",
          "GHK-Cu is older than either of those. Loren Pickart identified the copper-binding tripeptide, glycyl-L-histidyl-L-lysine, in human plasma in 1973, while comparing blood from younger and older donors. Decades of follow-up work since then tie it to gene-expression changes around collagen synthesis, antioxidant activity, and wound healing.[3]",
          "KPV is the smallest of the four: three amino acids, Lys-Pro-Val, clipped from the tail end of alpha-melanocyte-stimulating hormone. Strip away the rest of alpha-MSH and the pigmentation signaling goes with it, but KPV keeps showing anti-inflammatory activity on its own, including in intestinal-inflammation models.[4]",
        ],
      },
      {
        heading: "Purity, documentation, and lot verification for a four-component blend",
        paragraphs: [
          "One purity number doesn't cut it here. A four-component blend needs four confirmed identities on the same Certificate of Analysis, one per peak: BPC-157, TB-500, GHK-Cu, and KPV. Tetrava Labs publishes that lot-linked HPLC-MS data in the [COA library](/coa-library), so you can check the batch against what's actually in your hands before starting comparative work.",
          "The FDA put BPC-157 and the thymosin beta-4 fragment sold as TB-500 on its Category 2 list of significant-safety-risk bulk substances back in 2023.[5] Both stayed Research Use Only after that. GHK-Cu and KPV never landed on that list, for what it's worth, but the finished blend still ships under the same RUO restriction. Regulatory history on one ingredient doesn't change how the other three get treated.",
        ],
      },
      {
        heading: "Why researchers combine four peptides in one lot",
        paragraphs: [
          "Buying four peptides from four separate vials means four identity checks and four chances for lot variation to creep in. A fixed-ratio blend collapses that into one lot, one COA, one set of numbers to trust.",
          "Each of the four sits in its own pathway: tissue-repair signaling for BPC-157, actin regulation for TB-500, copper-peptide gene modulation for GHK-Cu, cytokine-linked anti-inflammatory signaling for KPV. A lab running a comparative protocol, blend against single components, or KLOW against the three-peptide [GLOW Blend](/glow-bpc-157-tb-500-ghk-cu), can isolate exactly what adding KPV changes in a given assay.",
        ],
      },
      {
        heading: "GLOW vs KLOW: what the fourth peptide changes",
        paragraphs: [
          "GLOW and KLOW start the same: BPC-157, TB-500, GHK-Cu. KLOW just keeps going and adds KPV. Run both blends side by side and you're really testing one variable, whether the anti-inflammatory tripeptide shifts the result against the three-peptide baseline, not comparing two unrelated products.",
          "The fastest way to confirm that difference isn't the label. It's the chromatogram. GLOW resolves three peaks. KLOW resolves four, and that fourth peak needs to match KPV on both mass and retention time. Whatever the marketing name says, the COA is the only thing that actually tells you what's in the vial.",
        ],
      },
      {
        heading: "Laboratory handling: reconstitution, storage, and documentation",
        paragraphs: [
          "KLOW Blend ships lyophilized, which is what keeps it stable in transit. Keep sealed vials at -20°C, skip the freeze-thaw cycles, and reconstitute right before use under sterile technique with whatever diluent your protocol calls for.",
          "Once it's reconstituted, hold it at 4°C and use it inside the window your lab's SOP sets for a multi-peptide prep. Write down the diluent lot, the date, the target concentration, and who did it. That's what keeps a four-component identity auditable against the batch [Certificate of Analysis](/coa-library) later. None of this is dosing advice. It's lab prep, for people running the assay, not for anyone administering it to themselves or anyone else.",
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
          "Esposito S, Deventer K, Goeman J, Van der Eycken J, Van Eenoo P. Synthesis and characterization of the N-terminal acetylated 17-23 fragment of thymosin beta 4 identified in TB-500, a product suspected to possess doping potential. Drug Test Anal. 2012;4(9):733-738.",
        url: "https://doi.org/10.1002/dta.1402",
      },
      {
        id: 3,
        citation:
          "Pickart L, Margolina A. Regenerative and Protective Actions of the GHK-Cu Peptide in the Light of the New Gene Data. Int J Mol Sci. 2018;19(7):1987.",
        url: "https://doi.org/10.3390/ijms19071987",
      },
      {
        id: 4,
        citation:
          "Dalmasso G, Charrier-Hisamuddin L, Nguyen HT, Yan Y, Sitaraman S, Merlin D. PepT1-mediated tripeptide KPV uptake reduces intestinal inflammation. Gastroenterology. 2008;134(1):166-178.",
        url: "https://doi.org/10.1053/j.gastro.2007.10.026",
      },
      {
        id: 5,
        citation:
          "U.S. Food and Drug Administration. Certain Bulk Drug Substances for Use in Compounding That May Present Significant Safety Risks. 2023.",
        url: "https://www.fda.gov/drugs/human-drug-compounding",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-08-18",
  },
  "pinealon-10mg": {
    shortDescription: [
      "Pinealon is a synthetic tripeptide. Sequence: Glu-Asp-Arg, EDR for short. Vladimir Khavinson's group built it at the Saint Petersburg Institute of Bioregulation and Gerontology, part of a short-peptide bioregulator program that produced dozens of similar two-to-seven amino acid compounds. The sequence itself turned up first inside Cortexin, a polypeptide extract from bovine and porcine brain cortex, and researchers later synthesized it on its own to test whether the fragment carried any of Cortexin's activity by itself.[2]",
      "Tetrava Labs sells Pinealon as a sterile, lyophilized reagent for [central-nervous-system and longevity peptide research](/category/longevity-neuropeptides): oxidative stress, neuronal viability, cognitive-aging models in cells and animals. The identity fields in the Specifications tab match the CAS registry (175175-23-2). Every lot ships with third-party HPLC-verified identity and purity data, tested and documented, not just claimed. This is a research reagent. It is not for human or veterinary consumption.",
    ],
    otherKnownTitles: [
      "EDR peptide",
      "Glu-Asp-Arg tripeptide",
      "Pineal bioregulator peptide",
    ],
    sections: [
      {
        heading: "Where Pinealon came from: a Cortexin fragment, not a pineal extract",
        paragraphs: [
          "Pinealon's name points to the pineal gland. The peptide itself was pulled out of Cortexin, a neuroprotective polypeptide mixture made from bovine and porcine cerebral cortex.[2] Glu-Asp-Arg was the most common three-amino-acid sequence in that extract, so Khavinson's group isolated it and synthesized a standalone version to see if the short fragment did anything on its own.",
          "The pineal branding comes from a separate, overlapping thread. The same EDR sequence has also turned up in pineal-derived preparations, which is why older research summaries and marketing copy file Pinealon under \"pineal bioregulators\" next to Epitalon. Cortical origin and pineal association are two different claims. They get blurred often enough that it's worth keeping them apart when you're reading an older paper or a vendor page.",
        ],
      },
      {
        heading: "What \"bioregulator\" means here",
        paragraphs: [
          "Searches for \"Pinealon (bioregulator)\" usually mean the term literally, so it's worth defining once. In the Khavinson framework, a bioregulator is a short peptide, most under eight amino acids, proposed to act on gene expression inside a specific tissue type rather than through a cell-surface receptor. Pinealon, Epitalon, and roughly a dozen related compounds fall under that label. It's a research classification, not a regulatory one. No health authority defines or approves a product category called \"bioregulator.\"",
        ],
      },
      {
        heading: "Pinealon and oxidative stress: the actual numbers behind the headline claim",
        paragraphs: [
          "The paper researchers cite most often is a 2011 Rejuvenation Research study using rat cerebellar granule cells, neutrophils, and PC12 pheochromocytoma cells.[2] The design: expose the cells to a known oxidative trigger, ouabain at 100 nM or homocysteine at 500 micromolar, then add Pinealon and measure free-radical accumulation by flow cytometry.",
          "A 100 nM dose of Pinealon fully blocked the ouabain-induced rise in reactive oxygen species. Against homocysteine, 500 nM did the same. Downstream, Pinealon delayed ERK 1/2 activation from 2.5 minutes to about 20 minutes in the homocysteine condition, and in PC12 cells, concentrations between 50 and 500 nM shifted the cell-cycle distribution away from the G1 phase.[2] The antioxidant effect and the drop in necrotic cell death both leveled off around 100 to 500 nM, while the cell-cycle shift kept scaling past that point, a split the authors used to argue Pinealon does more than absorb free radicals.",
          "All of that is one paper, in three cell lines, none of them human tissue and none of them a live animal. Useful for designing a comparator arm. Not evidence of anything happening in a body.",
        ],
      },
      {
        heading: "Animal-model findings: prenatal hyperhomocysteinemia and aged-rat hypoxia",
        paragraphs: [
          "A 2012 study from the same research network tested Pinealon in pregnant rats with induced hyperhomocysteinemia, a metabolic stressor tied to fetal neurodevelopmental disruption, and reported that the peptide protected offspring against some of the resulting damage.[3] A 2014 paper from a different institutional group ran a separate comparison: Pinealon against Cortexin in old rats under acute hypoxic stress, reading out serum cytokines and caspase-3 activity in brain tissue. The two peptides split the results, each doing more on some endpoints than the other.[4]",
          "Both are small, non-blinded rodent studies published in Russian-language or Russian-affiliated journals. Neither has an independent replication outside that network. That's a real gap, worth naming in any protocol that leans on these papers. It's a reason for caution, not a reason to throw the data out.",
        ],
      },
      {
        heading: "The DNA-binding mechanism claim, and where the evidence actually stands",
        paragraphs: [
          "Khavinson's framework holds that Pinealon and related short peptides bind gene-promoter DNA directly and adjust transcription from inside the nucleus, instead of signaling through a cell-surface receptor. A 2019 physical-chemistry paper modeled how monovalent and divalent ions affect the EDR peptide's interaction with DNA, adding an outside lab's angle to the mechanism.[5]",
          "What's still missing, more than fifteen years after the idea was proposed, is a structural study, X-ray or cryo-EM, showing a three-residue peptide bound sequence-specifically to a DNA promoter. A folded DNA-binding domain usually needs more scaffolding than three amino acids can provide. Read the genomic-interaction model as a proposed mechanism backed by fluorescence and computational data. It isn't a settled fact.",
        ],
      },
      {
        heading: "Pinealon vs Epitalon: same research tradition, different molecule",
        paragraphs: [
          "Pinealon (Glu-Asp-Arg, three residues) and Epitalon (Ala-Glu-Asp-Gly, four residues) both came out of Khavinson's bioregulator program and both get filed under pineal research, but they aren't interchangeable. Epitalon's literature is about telomerase activity and rodent lifespan studies. Pinealon's is about oxidative stress, neuronal viability, and cortical gene expression, plus a separate paper reporting that short peptides including EDR stimulate serotonin-related gene expression in cultured brain-cortex cells.[1]",
          "Their regulatory footprint at home differs too. Several related Khavinson bioregulators hold Russian Federation drug registration. Pinealon and Epitalon don't; they're sold there as supplement-tier products. Neither is an FDA-approved drug in the United States. Tetrava Labs sells both strictly as Research Use Only laboratory reagents, and nothing in this section should be read as a recommendation to swap one for the other in a study design.",
        ],
      },
      {
        heading: "Reading a Pinealon research protocol without turning it into a dosing chart",
        paragraphs: [
          "\"Pinealon peptide protocol\" searches usually want a human schedule. This page doesn't have one, and Tetrava Labs won't publish one, because Pinealon is a laboratory reagent, not an approved product with a dosing label.",
          "What the published protocols do specify is concentration and timing for a given assay: nanomolar-range doses for the cell-culture oxidative-stress work cited above, milligram-per-kilogram dosing scaled for rat body weight in the hyperhomocysteinemia and hypoxia studies, each with its own exposure window and readout. None of that scales to a human number through simple arithmetic, and this page won't do that conversion. If your protocol needs a concentration or exposure time, pull it from the primary paper for your specific model, not from a rearranged version of someone else's rat study.",
        ],
      },
      {
        heading: "Laboratory handling: reconstitution, storage, and documentation",
        paragraphs: [
          "Pinealon ships lyophilized. That's what keeps a tripeptide this small stable in transit. Store sealed vials at -20°C, skip repeated freeze-thaw cycles, and reconstitute under sterile technique with a protocol-appropriate diluent right before use.",
          "Once reconstituted, hold the working solution per your lab's SOP and log the diluent lot, concentration, date, and operator in the ELN, so the prep stays traceable against the batch [Certificate of Analysis](/coa-library). A \"99% pure, lab-tested\" claim only means something if you can match it to that specific lot's COA, not a generic PDF reused across batches. Tetrava Labs also lists [Pinealon capsules](/buy-pinealon-capsules-online) for labs running an oral-route design instead of a reconstituted vial. None of this is dosing or administration guidance for a person or an animal. It's lab-prep documentation for whoever is running the assay.",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "Khavinson VK, Lin'kova NS, Tarnovskaya SI, Umnov RS, Elashkina EV, Durnova AO. Short peptides stimulate serotonin expression in cells of brain cortex. Bull Exp Biol Med. 2014;157(1):77-80.",
        url: "https://pubmed.ncbi.nlm.nih.gov/24909721/",
      },
      {
        id: 2,
        citation:
          "Khavinson V, Ribakova Y, Kulebiakin K, Vladychenskaya E, Kozina L, Arutjunyan A, Boldyrev A. Pinealon increases cell viability by suppression of free radical levels and activating proliferative processes. Rejuvenation Res. 2011;14(5):535-541.",
        url: "https://pubmed.ncbi.nlm.nih.gov/21978084/",
      },
      {
        id: 3,
        citation:
          "Arutjunyan A, Kozina L, Stvolinskiy S, Bulygina Y, Mashkina A, Khavinson V. Pinealon protects the rat offspring from prenatal hyperhomocysteinemia. Int J Clin Exp Med. 2012;5(2):179-185.",
        url: "https://pubmed.ncbi.nlm.nih.gov/22567179/",
      },
      {
        id: 4,
        citation:
          "Mendzheritskiy AM, Karantysh GV, Ryzhak GA, Demyanenko SV. Regulation of content of cytokines in blood serum and of caspase-3 activity in brains of old rats in model of sharp hypoxic hypoxia with Cortexin and Pinealon. Adv Gerontol. 2014;27(1):94-97.",
        url: "https://pubmed.ncbi.nlm.nih.gov/25051764/",
      },
      {
        id: 5,
        citation:
          "Silanteva IA, Komolkin AV, Morozova EA, Vorontsov-Velyaminov PN, Kasyanenko NA. Role of mono- and divalent ions in peptide Glu-Asp-Arg-DNA interaction. J Phys Chem B. 2019;123(8):1786-1795.",
        url: "https://pubmed.ncbi.nlm.nih.gov/30762356/",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-08-18",
  },
  semaglutide: {
    shortDescription: [
      "Semaglutide is a GLP-1 receptor agonist. Novo Nordisk started from native human GLP-1, which DPP-4 chews through in a couple of minutes, and changed two places on the chain. Position 2 got aminoisobutyric acid (Aib) in place of alanine, which blocks that cleavage. Lysine 26 got a C18 fatty diacid hung off an AEEA-AEEA-γ-Glu spacer, so the peptide can bind albumin in blood and stay in circulation for about a week instead of a few minutes.[1]",
      "Ozempic, Wegovy, and Rybelsus are the FDA-approved brand names for type 2 diabetes and chronic weight management. Tetrava Labs does not sell those products. This page lists a sterile, lyophilized semaglutide reagent for [GLP-1 receptor research](/category/glp-1-research): binding assays, cAMP readouts, glucose-handling models, and head-to-head work against other incretin peptides. The identity fields in the Specifications tab match CAS 910463-68-2, formula C187H291N45O59, molecular weight 4113.58. Every lot ships with third-party HPLC identity and purity data. Research use only. Not for human or veterinary use.",
    ],
    otherKnownTitles: [
      "Ozempic (brand name)",
      "Wegovy (brand name)",
      "Rybelsus (brand name)",
      "GLP-1 analog",
    ],
    sections: [
      {
        heading: "How semaglutide is built, and how it works",
        paragraphs: [
          "Native GLP-1 is a terrible drug candidate for one boring reason: DPP-4 cuts it almost as soon as it is released. The Aib swap at position 2 takes that cut site away. The fatty diacid is a different trick. Bound to albumin, the peptide clears more slowly through the kidney, so a low concentration hangs around for days.[1]",
          "At the GLP-1 receptor, semaglutide slows gastric emptying and drives glucose-dependent insulin release from the pancreas. It also acts on hypothalamic circuits that cut food intake. Glucose-dependent is the part that matters. The insulin-release effect drops off as blood glucose comes back down, unlike older diabetes drugs that force insulin release no matter what glucose is doing.",
          "In a lab that is the whole reason to keep a GLP-1-only agonist on the shelf. If the protocol is asking what GLP-1 receptor activity does on its own, semaglutide is the reference. Dual and triple agonists belong in a different arm.",
        ],
      },
      {
        heading: "The weight-loss data: what STEP 1 actually measured",
        paragraphs: [
          "STEP 1 is the trial behind most \"semaglutide weight loss\" numbers. 1,961 adults with obesity, or overweight plus a weight-related condition, none of them diabetic, 68 weeks, placebo-controlled.[2] Semaglutide 2.4 mg weekly produced a mean body-weight change of -14.9%, versus -2.4% on placebo. Absolute change was -15.3 kg versus -2.6 kg.",
          "The responder cuts are less quoted and more useful. 86.4% of the semaglutide group lost 5% or more of body weight, versus 31.5% on placebo. 69.1% lost 10% or more, versus 12.0%. Half of the semaglutide group, 50.5%, lost 15% or more, versus 4.9% on placebo.[2]",
          "It was not fast. Investigators used a slow dose-escalation schedule because gastrointestinal events cluster when the dose jumps. At week 68 the mean curve was still going down. \"How long does it take for semaglutide to work\" has a blunt answer in this paper: the trial ran well over a year and the effect was still building.",
          "Gastrointestinal events, mainly nausea and diarrhea, showed up in 74.2% of the semaglutide group versus 47.9% on placebo. Most were mild to moderate and sat around dose increases. 7.0% quit because of adverse events, versus 3.1% on placebo.[2] Gallstones were less common but still higher: cholelithiasis in 1.8% versus 0.6%. Acute pancreatitis was rare, 3 people (0.2%) versus none on placebo. Those figures come from a supervised trial of an approved product. They are not a safety label for a research vial.",
        ],
      },
      {
        heading: "Semaglutide and cardiovascular risk: the SELECT trial",
        paragraphs: [
          "Weight loss and cardiovascular risk are separate questions. SELECT enrolled 17,604 adults with established cardiovascular disease and overweight or obesity, no diabetes, and followed them for a mean of 39.8 months.[3]",
          "A primary endpoint event, cardiovascular death, non-fatal heart attack, or non-fatal stroke, happened in 569 of 8,803 people on semaglutide 2.4 mg (6.5%) and 701 of 8,801 on placebo (8.0%). Hazard ratio 0.80. Permanent discontinuation because of adverse events ran 16.6% versus 8.2%.",
          "That result is why the approved label, for a defined population, includes cardiovascular risk reduction. It does not travel with Tetrava's catalog item. This page sells a laboratory reagent.",
        ],
      },
      {
        heading: "Oral semaglutide: why a peptide needs a tablet trick",
        paragraphs: [
          "A peptide this size usually dies in the stomach. Enzymes and low pH take the backbone apart before much of it can cross. Rybelsus, the oral tablet, puts semaglutide in the same tablet as SNAC, sodium N-(8-[2-hydroxybenzoyl] amino) caprylate.[4]",
          "SNAC works next to the tablet, not throughout the body. It briefly raises the pH at the tablet surface so pepsin has a harder time chewing the peptide, and it loosens the nearby gastric epithelial membrane just enough for semaglutide to cross through the cells, transcellularly, without opening tight junctions.[4] The window is small and local. Food or extra water dilutes the SNAC concentration at that patch of stomach lining, which is why the approved tablet is taken on an empty stomach with a sip of water.",
          "That constraint belongs to Rybelsus. Tetrava does not sell semaglutide pills, oral semaglutide, or a SNAC co-formulation. The listing here is a lyophilized vial.",
        ],
      },
      {
        heading: "Ozempic, Wegovy, Rybelsus: one molecule, three products",
        paragraphs: [
          "Yes, Ozempic is semaglutide. Wegovy is too. Rybelsus is the oral one. Same active molecule, different products. Ozempic is the type 2 diabetes injection, labeled up to 2 mg weekly. Wegovy is the chronic weight-management injection, labeled up to 2.4 mg weekly. Rybelsus is the SNAC tablet, approved for type 2 diabetes.",
          "\"Semaglutide vs Ozempic\" is usually a naming mix-up, not a pharmacology mix-up. The brand names differ in dose, delivery, and the population each was studied in. Tetrava Labs lists none of them. No pen. No prescription. No patient label.",
        ],
      },
      {
        heading: "What this catalog listing actually is",
        paragraphs: [
          "The vial on this page is lyophilized semaglutide in 5 mg and 10 mg research strengths. It is not a finished injection, not a milligram-per-milliliter solution, and not a tablet. A reconstituted research prep is a lab variable you set in the SOP. It is not interchangeable with Ozempic, Wegovy, or Rybelsus.",
          "Labs that buy semaglutide peptides here usually want a documented GLP-1-only comparator. Common pairings: [tirzepatide](/buy-tirzepatide-online) when the study needs dual GIP/GLP-1 activity, [retatrutide](/buy-retatrutide-online) when glucagon-receptor activity is in the protocol too, and the [cagrilintide + semaglutide blend](/buy-cagrilintide-semaglutide-online) when the question is amylin-plus-GLP-1 rather than GLP-1 alone.",
          "Identity check is boring and non-negotiable. CAS 910463-68-2 on the paperwork should match the vial. Lot number on the vial should match the lot number on the [Certificate of Analysis](/coa-library). A purity percentage with no lot-linked HPLC-MS record is a catalog claim, not a result.",
        ],
      },
      {
        heading: "Semaglutide vs tirzepatide",
        paragraphs: [
          "Semaglutide hits GLP-1. Tirzepatide hits GIP and GLP-1. That is the difference. Searches for \"tirzepatide vs semaglutide\" and \"is tirzepatide better than semaglutide\" are usually asking which molecule lost more weight in a trial, which is a different question from which receptor profile a protocol needs.",
          "SURMOUNT-5 ran approved tirzepatide against approved semaglutide in the same obesity protocol, so it is the comparison that does not rest on cross-trial arithmetic.[5] Tirzepatide produced a larger drop in body weight and waist circumference over that window, at those doses, in that population. It does not make tirzepatide the right reagent for every assay. Write the receptor question into the protocol first, then pick the vial.",
        ],
      },
      {
        heading: "Compounded semaglutide: what the FDA has actually said",
        paragraphs: [
          "Compounded semaglutide is a pharmacy-prepared product made outside Novo Nordisk's approved manufacturing. A lot of it showed up during the 2022-2024 Ozempic and Wegovy shortage, when compounding copies of a shortage drug is allowed under narrow conditions.",
          "FDA drew a line on the salt forms. Ozempic and Wegovy contain semaglutide base. Some compounders used semaglutide sodium or semaglutide acetate instead. In an April 2023 letter to the National Association of Boards of Pharmacy, FDA's Office of Compounding Quality and Compliance wrote that it was \"not aware of any basis for compounding a drug using these semaglutide salts that would meet federal law requirements.\"[6] A public adverse-event warning followed in May 2023. Semaglutide has never been on FDA's 503A bulk-compounding list.",
          "\"Does compounded semaglutide work\" still does not have a published pharmacokinetics answer for the salt forms the way the base compound does. A compounded product, an approved pen, and Tetrava's RUO vial are three different categories. This page is the third one.",
        ],
      },
      {
        heading: "Reported safety signals: thyroid tumors, hair loss, and what the label actually says",
        paragraphs: [
          "The FDA label carries a boxed warning for thyroid C-cell tumors. The finding is from rats and mice. The label says human relevance \"has not been determined.\"[7] Anyone with a personal or family history of medullary thyroid carcinoma, or with MEN 2, is contraindicated. \"Does semaglutide cause cancer\" does not have a clean human yes or no. What exists is an animal finding, a boxed warning, and a contraindication.",
          "Alopecia showed up in STEP 1: 3.3% on semaglutide versus 1.0% on placebo, 4.0% of women and 0.9% of men.[2] The pattern that fits is telogen effluvium, a temporary shed after rapid weight loss, which tends to ease once weight stabilizes. Fatigue is not a main signal in those trial tables the way nausea and diarrhea are. \"Does semaglutide make you tired\" does not have a strong trial number behind it either way.",
        ],
      },
      {
        heading: "Laboratory handling: reconstitution, storage, and documentation",
        paragraphs: [
          "Tetrava ships semaglutide lyophilized. Store sealed vials at -20°C. Skip repeated freeze-thaw. Reconstitute under sterile technique with the diluent your SOP names, right before use.",
          "Hold the working solution the way the method says, then log diluent lot, concentration, date, and operator in the ELN so the prep still matches the batch [Certificate of Analysis](/coa-library) a month later. This page does not publish a unit-to-milligram conversion, a starting dose, an injection site, or a weight-loss dosage chart. Those questions belong to an approved label and a clinician. They do not belong on a Research Use Only catalog page.",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "Lau J, Bloch P, Schäffer L, et al. Discovery of the once-weekly glucagon-like peptide-1 (GLP-1) analogue semaglutide. J Med Chem. 2015;58(18):7370-7380.",
        url: "https://doi.org/10.1021/acs.jmedchem.5b00726",
      },
      {
        id: 2,
        citation:
          "Wilding JPH, Batterham RL, Calanna S, et al. Once-weekly semaglutide in adults with overweight or obesity (STEP 1). N Engl J Med. 2021;384(11):989-1002.",
        url: "https://pubmed.ncbi.nlm.nih.gov/33567185/",
      },
      {
        id: 3,
        citation:
          "Lincoff AM, Brown-Frandsen K, Colhoun HM, et al. Semaglutide and cardiovascular outcomes in obesity without diabetes (SELECT). N Engl J Med. 2023;389(24):2221-2232.",
        url: "https://doi.org/10.1056/NEJMoa2307563",
      },
      {
        id: 4,
        citation:
          "Buckley ST, Bækdal TA, Vegge A, et al. Transcellular stomach absorption of a derivatized glucagon-like peptide-1 receptor agonist. Sci Transl Med. 2018;10(467):eaar7047.",
        url: "https://doi.org/10.1126/scitranslmed.aar7047",
      },
      {
        id: 5,
        citation:
          "Aronne LJ, Horn DB, le Roux CW, et al. Tirzepatide as compared with semaglutide for the treatment of obesity (SURMOUNT-5). N Engl J Med. 2025;393(1):26-36.",
        url: "https://pubmed.ncbi.nlm.nih.gov/40353578/",
      },
      {
        id: 6,
        citation:
          "U.S. Food and Drug Administration, Office of Compounding Quality and Compliance. Letter to the National Association of Boards of Pharmacy regarding semaglutide salt forms. April 27, 2023.",
        url: "https://www.fda.gov/drugs/human-drug-compounding",
      },
      {
        id: 7,
        citation:
          "U.S. Food and Drug Administration. Ozempic and Rybelsus (semaglutide) prescribing information: Boxed Warning, thyroid C-cell tumors.",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=27f15fac-7d98-4114-a2ec-92494a91da98",
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
