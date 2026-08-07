import "server-only"

import type { AuthorId } from "@/lib/authors"

export type ResearchSection = {
  heading: string
  paragraphs: string[]
  /** Optional bullet list rendered after the paragraphs (for myth-busting / evidence summaries). */
  bullets?: string[]
}

export type ResearchReference = {
  id: number
  citation: string
  url?: string
}

export type ProductResearchDetail = {
  /** Short description paragraph(s) shown above the analytical data table. */
  shortDescription: string[]
  /** Known synonyms / development codes, shown alongside Molecular Formula / Weight / Sequence. */
  otherKnownTitles?: string[]
  /** "[Product Name] Peptide Research" subsections. */
  sections: ResearchSection[]
  /** Numbered references, cited in section paragraphs as literal "[n]" tokens. */
  references: ResearchReference[]
  /** Byline shown as the Author Profile block beneath the references. */
  authorId: AuthorId
}

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
      "Tetrava Labs supplies BPC-157 as a sterile, lyophilized reagent intended exclusively for in vitro and in vivo laboratory research into [tissue-repair signaling](/category/tissue-repair), angiogenesis, and gastrointestinal mucosal-protection models. The molecular formula, weight, and sequence listed below are cross-referenced against the PubChem compound record for BPC-157.[10] Every lot ships with third-party HPLC-verified identity and purity data — this compound is sold strictly for research use and is not for human or veterinary consumption."
    ],
    otherKnownTitles: [
      "Body Protection Compound-157",
      "Pentadecapeptide BPC 157",
      "PL-14736",
      "PL-10",
      "Bepecin",
      "BPC 15"
    ],
    sections: [
      {
        heading: "BPC-157 and Angiogenic Signaling: VEGFR2 and the Akt-eNOS Pathway",
        paragraphs: [
          "Chick chorioallantoic membrane and endothelial tube-formation assays indicate that BPC-157 increases vessel density and accelerates blood-flow recovery in the ischemic hindlimb muscle of rats.[2] Histological and cell-culture analyses from the same study reported increased expression of vascular endothelial growth factor receptor 2 (VEGFR2) and time-dependent activation of the VEGFR2-Akt-eNOS signaling cascade — a pathway associated with nitric-oxide-mediated endothelial function.[2]",
          "Laboratories modeling angiogenesis in tissue-repair protocols frequently reference this pathway when designing VEGFR2 expression or nitric-oxide-synthase readouts, and when selecting endothelial cell lines for comparative screening."
        ]
      },
      {
        heading: "BPC-157 and Tendon Fibroblast Migration: The FAK-Paxillin Pathway",
        paragraphs: [
          "In cultured rat Achilles tendon fibroblasts, BPC-157 was reported to accelerate ex vivo tendon-explant outgrowth, increase cell survival under oxidative (H2O2) stress, and dose-dependently enhance fibroblast migration in transwell assays.[3] The same study attributed the migratory effect to increased phosphorylation of focal adhesion kinase (FAK) and paxillin — proteins associated with cytoskeletal reorganization and cell adhesion — without a corresponding change in total protein levels.[3]",
          "This mechanism is commonly cited in [comparative tendon-repair study designs](/category/tissue-repair) alongside growth-factor controls such as bFGF or EGF, and BPC-157 is frequently stacked with [TB-500](/buy-tb-500-online) in combined tissue-repair protocols — a useful reference point when structuring dose-response migration assays."
        ]
      },
      {
        heading: "BPC-157 and Growth Hormone Receptor Expression in Tendon Fibroblasts",
        paragraphs: [
          "A cDNA microarray screen of BPC-157-treated tendon fibroblasts identified growth hormone receptor (GHR) as one of the most strongly up-regulated genes.[4] Follow-up assays reported dose- and time-dependent increases in GHR mRNA and protein, with downstream activation of the Janus kinase 2 (JAK2) pathway when exogenous growth hormone was added to BPC-157-treated cultures — a combination associated with increased fibroblast proliferation.[4]",
          "Researchers studying GHR-JAK2 crosstalk in tendon models may find this pairing informative when designing co-treatment or sequential-exposure protocols."
        ]
      },
      {
        heading: "BPC-157 and the Myotendinous Junction: Musculoskeletal Repair Models",
        paragraphs: [
          "In a rat model of surgically dissected quadriceps myotendinous junction — an injury that does not heal spontaneously — intraperitoneal and oral BPC-157 regimens were associated with full functional recovery, reversal of progressive muscle atrophy, and structural resolution of the defect by postoperative day 42.[5]",
          "A 2025 systematic review of 36 studies (35 preclinical, 1 clinical) concluded that BPC-157 modulates growth hormone receptor expression along with angiogenic and inflammatory-cytokine pathways across muscle, tendon, ligament, and bone injury models in animal research, while explicitly noting that the evidence base remains dominated by preclinical (level IV-V) study designs.[8]"
        ]
      },
      {
        heading: "BPC-157 and Gastrointestinal Mucosal Protection",
        paragraphs: [
          "BPC-157 was first characterized in work on gastric-juice-derived cytoprotective compounds, and much of the foundational literature centers on gastrointestinal ulcer, fistula, and mucosal-injury models in rats.[1] Review literature describes consistent protective findings across GI-injury models, attributed in part to modulation of the nitric-oxide system and interactions with several neurotransmitter pathways, though the precise upstream mechanism has not been fully resolved.[1]"
        ]
      },
      {
        heading: "BPC-157 and the Central Nervous System: Traumatic Brain Injury Models",
        paragraphs: [
          "A single published study evaluated intraperitoneal BPC-157 in a mouse falling-weight traumatic brain injury (TBI) model.[6] Treated mice showed reduced 24-hour post-injury mortality and less severe hemorrhagic and edema findings on gross and histological assessment, with improved outcomes when the peptide was administered prophylactically before injury.[6] This remains the only direct TBI dataset identified in the literature, so extrapolation beyond this single-study, single-species model should be treated cautiously."
        ]
      },
      {
        heading: "BPC-157 and the Evidence Gap: Preclinical Weight vs. Human Data",
        paragraphs: [
          "A common misconception is that the extensive rodent and cell-culture literature on BPC-157 is equivalent to demonstrated human efficacy. Current systematic and narrative reviews are explicit that this is not the case:"
        ],
        bullets: [
          "BPC-157 is not approved by the FDA or any comparable regulator for human therapeutic use, and it is prohibited by major anti-doping authorities in professional sports.[8]",
          "Human data are limited to a small number of pilot-level, non-blinded studies — including a retrospective case series of intra-articular injection for chronic knee pain, in which 14 of 16 patients reported relief beyond six months.[7]",
          "A 2025 systematic review identified only one clinical-level study among 36 total included papers, and found no published in-human safety data despite favorable preclinical toxicology.[8]",
          "A 2025 narrative review reached the same conclusion, describing BPC-157 as investigational and calling for well-designed human trials before any clinical extrapolation from animal data.[9]"
        ]
      },
      {
        heading: "BPC-157 and Laboratory Handling: Reconstitution, Storage, and Documentation",
        paragraphs: [
          "Tetrava Labs ships BPC-157 as a lyophilized powder for stability during transport. Store sealed vials at -20°C, avoid repeated freeze-thaw cycles, and reconstitute under sterile technique with a protocol-appropriate diluent immediately before use. For dilution ratios and step-by-step math, see our [BPC-157 handling protocol](/blog/bpc-157-handling-protocol) and general [peptide reconstitution calculations](/blog/peptide-reconstitution-calculations) guide.",
          "Once reconstituted, store working solutions at 4°C and use within the window defined by your laboratory SOP. Record diluent lot, reconstitution date, and operator in your ELN so preparation conditions remain auditable alongside the batch [Certificate of Analysis](/coa-library) — see [how to read COA and HPLC reports](/blog/how-to-read-coa-and-hplc-reports) for interpretation guidance."
        ]
      }
    ],
    references: [
      {
        id: 1,
        citation:
          "Sikiric P, Seiwerth S, Rucman R, et al. Stable gastric pentadecapeptide BPC 157: novel therapy in gastrointestinal tract. Curr Pharm Des. 2011;17(16):1612-1632.",
        url: "https://pubmed.ncbi.nlm.nih.gov/21548867/"
      },
      {
        id: 2,
        citation:
          "Hsieh MJ, Liu HT, Wang CN, et al. Therapeutic potential of pro-angiogenic BPC157 is associated with VEGFR2 activation and up-regulation. J Mol Med (Berl). 2017;95(3):323-333.",
        url: "https://pubmed.ncbi.nlm.nih.gov/27889809/"
      },
      {
        id: 3,
        citation:
          "Chang CH, Tsai WC, Lin MS, Hsu YH, Pang JH. The promoting effect of pentadecapeptide BPC 157 on tendon healing involves tendon outgrowth, cell survival, and cell migration. J Appl Physiol. 2011;110(3):774-780.",
        url: "https://pubmed.ncbi.nlm.nih.gov/21030672/"
      },
      {
        id: 4,
        citation:
          "Chang CH, Tsai WC, Hsu YH, Pang JH. Pentadecapeptide BPC 157 enhances the growth hormone receptor expression in tendon fibroblasts. Molecules. 2014;19(11):19066-19077.",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6271067/"
      },
      {
        id: 5,
        citation:
          "Japjec M, Horvat Pavlov K, Petrovic A, et al. Stable gastric pentadecapeptide BPC 157 as a therapy for the disable myotendinous junctions in rats. Biomedicines. 2021;9(11):1547.",
        url: "https://pubmed.ncbi.nlm.nih.gov/34829776/"
      },
      {
        id: 6,
        citation:
          "Tudor M, Jandric I, Marovic A, et al. Traumatic brain injury in mice and pentadecapeptide BPC 157 effect. Regul Pept. 2010;160(1-3):26-32.",
        url: "https://pubmed.ncbi.nlm.nih.gov/19931318/"
      },
      {
        id: 7,
        citation:
          "Lee E, Padgett B. Intra-articular injection of BPC 157 for multiple types of knee pain. Altern Ther Health Med. 2021;27(4):8-13.",
        url: "https://pubmed.ncbi.nlm.nih.gov/34324435/"
      },
      {
        id: 8,
        citation:
          "Vasireddi N, Hahamyan H, Salata MJ, et al. Emerging use of BPC-157 in orthopaedic sports medicine: a systematic review. HSS J. 2025;21(4):485-495.",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12313605/"
      },
      {
        id: 9,
        citation:
          "McGuire FP, Martinez R, Lenz A, et al. Regeneration or risk? A narrative review of BPC-157 for musculoskeletal healing. Curr Rev Musculoskelet Med. 2025;18:611-619.",
        url: "https://doi.org/10.1007/s12178-025-09990-7"
      },
      {
        id: 10,
        citation: "National Center for Biotechnology Information. PubChem Compound Summary for CID 9941957, BPC-157.",
        url: "https://pubchem.ncbi.nlm.nih.gov/compound/9941957"
      }
    ],
    authorId: "sharma"
  }
}

export function getProductResearchDetail(parentHandle: string): ProductResearchDetail | null {
  return PRODUCT_RESEARCH_DETAIL[parentHandle] || null
}
