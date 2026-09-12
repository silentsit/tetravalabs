import "server-only";

import type { ProductResearchDetail } from "@/lib/product-research-types";

export const BATCH1A_RESEARCH: Record<string, ProductResearchDetail> = {
  "ghk-cu": {
    shortDescription: [
      "GHK-Cu is the copper(II) complex of the human tripeptide glycyl-L-histidyl-L-lysine, first described as a plasma factor that research later tied to copper uptake into cells.[4]",
      "Tetrava Labs supplies GHK-Cu as a lyophilized Research Use Only reagent for in-vitro and in-vivo copper-handling and extracellular-matrix models. Labs that buy GHK-Cu here are purchasing a documented research vial, not a cosmetic serum. Related [research peptides](/) should be ordered by sequence and metal form, not by a forum nickname. Not for human or veterinary use.",
    ],
    otherKnownTitles: [
      "Copper tripeptide-1",
      "GHK copper",
      "Glycyl-L-histidyl-L-lysine copper complex",
      "Copper peptide",
    ],
    sections: [
      {
        heading: "What GHK-Cu is",
        paragraphs: [
          "GHK-Cu is a defined tripeptide-copper complex. The peptide is Gly-His-Lys. The catalog hyphen flags the metal, which matters as soon as the endpoint is copper delivery rather than the peptide backbone alone.[3][4]",
          "Reviews of skin-regeneration models treat GHK-Cu as a modulator of several cellular pathways at once, including extracellular-matrix genes and remodeling enzymes.[2] That is a description of published cell and tissue work. It is not a claim that a finished topical product will do the same thing in a person.",
        ],
      },
      {
        heading: "Copper uptake is the older mechanism",
        paragraphs: [
          "The 1980 Nature paper did not test a serum. It asked whether the plasma tripeptide moves copper into cells.[4] If your assay is a copper-uptake or copper-dependent enzyme readout, copper-free GHK and GHK-Cu are different reagents. Overlaying them because both contain the GHK sequence is a methods error.",
          "Later reviews keep that metal-handling idea and add gene-level remodeling in cultured cells and tissue models.[2][3] Write down which form went into the well. The notebook line 'copper peptide' is not an identity.",
        ],
      },
      {
        heading: "Four thousand genes is not a vial-to-serum proof",
        paragraphs: [
          "A widely repeated line says GHK resets expression of thousands of genes. The [2018 gene-data paper](https://pubmed.ncbi.nlm.nih.gov/29986520/) is a gene-expression argument built on microarray-style analysis, not a head-to-head of a cosmetic GHK-Cu peptide topical against a lyophilized research lot.[1]",
        ],
        bullets: [
          "A large differential-expression list is a hypothesis generator. It does not prove that two products with the same three-letter name are interchangeable.",
          "Copper-free GHK and GHK-Cu are not interchangeable in uptake studies that treat copper delivery as the mechanism.[4]",
          "\"Is GHK-Cu peptide safe\" belongs to a lab SOP (identity, lot HPLC, chemical-hygiene rules), not to a consumer safety stamp. Endogenous occurrence in plasma does not make an RUO vial a personal-care product.[2][3]",
        ],
      },
      {
        heading: "If the ELISA is read at 24 h vs 72 h",
        paragraphs: [
          "Seed dermal fibroblasts with GHK-Cu and score a published matrix endpoint such as collagen or glycosaminoglycan output.[2] A 24-hour ELISA can look flat. The same wells at 72 hours can look like a different study. Skin-regeneration reviews treat matrix remodeling as a delayed transcriptional program, not an overnight dye change.[2]",
          "Add a copper-uptake arm copied from the older cellular work.[4] If GHK and GHK-Cu overlay on the ELISA and split on the metal assay, the catalog hyphen is doing real work. Oral vs injection is a separate design choice: a cell monolayer does not answer capsule absorption, and a topical vehicle is a formulation study. GHK-Cu peptide capsules and GHK-Cu peptide topical listings online are often finished consumer formats. This page is the research solid.",
        ],
      },
      {
        heading: "GHK-Cu vs TB-500",
        paragraphs: [
          "Labs often file GHK-Cu next to other [tissue-repair](/category/tissue-repair) reagents. They are not substitutes. GHK-Cu is a copper-binding tripeptide. Material sold as [TB-500](/buy-tb-500-online) is an acetylated heptapeptide fragment of thymosin β4. Shared shelf space is not shared pharmacology.[3]",
          "If the protocol needs an actin-binding fragment, order that fragment. If it needs a copper-tripeptide complex, order GHK-Cu.",
        ],
      },
      {
        heading: "Buy GHK-Cu after the chromatogram matches",
        paragraphs: [
          "Queries for ghk-cu peptide where to buy and ghk-cu peptide price usually want a number first. The number that matters is the lot on the vial against the HPLC identity on the COA, not a cart total. Tetrava Labs posts lot-linked analytical files in the [Certificate of Analysis](/coa-library) library when a batch is published.",
          "If the label, sequence, and chromatogram do not agree, do not start the plate.",
        ],
      },
      {
        heading: "Laboratory handling",
        paragraphs: [
          "Keep sealed lyophilized vials under the storage conditions your SOP already specifies for copper-peptide solids. Log the lot, the operator, and the COA file name in the ELN.",
          "When the identity check is done, stay on this page for specifications or open the matching COA record. This tab is not a use protocol.",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "Pickart L, Margolina A. Regenerative and protective actions of the GHK-Cu peptide in the light of the new gene data. Int J Mol Sci. 2018;19(7):1987.",
        url: "https://pubmed.ncbi.nlm.nih.gov/29986520/",
      },
      {
        id: 2,
        citation:
          "Pickart L, Vasquez-Soltero JM, Margolina A. GHK peptide as a natural modulator of multiple cellular pathways in skin regeneration. Biomed Res Int. 2015;2015:648108.",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4508379/",
      },
      {
        id: 3,
        citation:
          "Pickart L. The human tri-peptide GHK and tissue remodeling. J Biomater Sci Polym Ed. 2008;19(8):969-988.",
        url: "https://pubmed.ncbi.nlm.nih.gov/18644225/",
      },
      {
        id: 4,
        citation:
          "Pickart L, Freedman JH, Loker WJ, et al. Growth-modulating plasma tripeptide may function by facilitating copper uptake into cells. Nature. 1980;288:715-717.",
        url: "https://pubmed.ncbi.nlm.nih.gov/7453802/",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-09-12",
  },
  "tb500": {
    shortDescription: [
      "TB-500 is a trade name for a short, N-acetylated fragment of thymosin β4. Mass-spectrometry work identified commercial and seized TB-500 as Ac-LKKTETQ, the 17-23 stretch, not the full 43-residue protein.[1]",
      "Tetrava Labs supplies this TB-500 peptide for sale as a Research Use Only laboratory reagent. Related [research peptides](/) in the same remodeling file should be ordered by sequence, not by a shared nickname. Not for human or veterinary use.",
    ],
    otherKnownTitles: [
      "TB500",
      "TB 500",
      "Ac-LKKTETQ",
      "Ac-Leu-Lys-Lys-Thr-Glu-Thr-Gln",
      "thymosin fragment",
    ],
    sections: [
      {
        heading: "What TB-500 is",
        paragraphs: [
          "What is TB-500, if you ignore the marketing line? A synthetic heptapeptide: acetyl-Leu-Lys-Lys-Thr-Glu-Thr-Gln. Esposito and colleagues synthesized that fragment and matched it to material sold as TB-500.[1]",
          "Full-length thymosin β4 is a different molecule. Older Tβ4 papers describe a 43-residue actin-sequestering protein. They do not automatically describe the vial on this page.[1][2]",
        ],
      },
      {
        heading: "Why thymosin β4 reviews still get cited",
        paragraphs: [
          "Tβ4 reviews discuss cell migration, angiogenesis, and actin binding, and they often point to a central actin-binding motif that sits inside the 17-23 stretch.[2] That is why fragment catalogs and Tβ4 papers share a shelf in the same binder.",
          "Sharing a motif is not identity. If the methods line says thymosin β4 and the dominant ion is Ac-LKKTETQ, the paper and the vial have already parted company.[1]",
        ],
      },
      {
        heading: "TB-500 is not a steroid",
        paragraphs: [
          "Is TB-500 a steroid? No. Steroids are fused-ring lipids. TB-500 is a peptide fragment.[1] Calling it a steroid is a category error, usually copied from forum threads that also treat full-length Tβ4 and the fragment as one reagent.",
          "The same threads borrow oral claims from Tβ4 reviews. Published identity work does not give the fragment that exception.[1][2] TB-500 oral vs another laboratory route is a protocol variable you have to validate. Do not paste a protein paper into a heptapeptide notebook and call it done.",
        ],
      },
      {
        heading: "Scratch-wound timing vs an LC-MS identity check",
        paragraphs: [
          "Copy a Tβ4 scratch-wound protocol and score closure at 12 hours and 24 hours. The endpoint is still a Tβ4 endpoint from the regenerative-peptide reviews.[2] Run the same stock on a mass spec. If the dominant species is the acetylated heptapeptide Esposito described, write Ac-LKKTETQ in the methods, not thymosin β4.[1]",
          "If the ELISA or imaging plate is read only at 6 hours, you may be scoring plating noise. If you wait until 24 hours without an identity check, you may be scoring the wrong molecule cleanly. Identity first, then the clock.",
        ],
      },
      {
        heading: "TB-500 vs BPC-157",
        paragraphs: [
          "Researchers mention TB-500 and BPC-157 in the same breath because both sit in tissue-repair catalogs. They are not the same sequence. [BPC-157](/buy-bpc-157-online) is a 15-residue gastric-juice-derived peptide. TB-500 is the acetylated 17-23 Tβ4 fragment.[1]",
          "The FDA has listed thymosin β4-related bulk substances among compounding materials that may present significant safety risks. That listing is a regulatory flag, not a permission slip for human use.[3] For a longer side-by-side written for this catalog, see [BPC-157 vs TB-500](/blog/bpc-157-vs-tb-500).",
        ],
      },
      {
        heading: "Buy TB-500 after the lot matches the fragment",
        paragraphs: [
          "TB-500 peptide for sale and tb-500 price searches treat the trade name as a finished fact. The first check is whether the [Certificate of Analysis](/coa-library) sequence and HPLC-MS ions match Ac-LKKTETQ.[1] A low cart total does not fix a full-length Tβ4 label on a fragment vial.",
          "Tetrava Labs ships TB-500 as Research Use Only material with lot-linked analytical documentation when a batch is posted. If the chromatogram and the vial disagree, stop.",
        ],
      },
      {
        heading: "Laboratory handling",
        paragraphs: [
          "Store sealed lyophilized vials per your peptide SOP. Record the lot, the operator, and the COA file in the ELN so the fragment identity stays attached to every plate.",
          "Open the specifications on this page or the matching COA record when you are done reading. This tab is not a use protocol. The [FDA compounding safety-risk page](https://www.fda.gov/drugs/human-drug-compounding) is worth filing next to the lot paperwork.[3]",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "Esposito S, Deventer K, Goeman J, Van der Eycken J, Van Eenoo P. Synthesis and characterization of the N-terminal acetylated 17-23 fragment of thymosin beta 4 identified in TB-500. Drug Test Anal. 2012;4(9):733-738.",
        url: "https://doi.org/10.1002/dta.1402",
      },
      {
        id: 2,
        citation:
          "Goldstein AL, Hannappel E, Sosne G, Kleinman HK. Thymosin β4: a multi-functional regenerative peptide. Expert Opin Biol Ther. 2012;12(1):37-51.",
        url: "https://pubmed.ncbi.nlm.nih.gov/22074294/",
      },
      {
        id: 3,
        citation:
          "U.S. Food and Drug Administration. Certain Bulk Drug Substances for Use in Compounding That May Present Significant Safety Risks. 2023.",
        url: "https://www.fda.gov/drugs/human-drug-compounding",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-09-12",
  },
  "ipamorelin": {
    shortDescription: [
      "Ipamorelin is a pentapeptide growth-hormone secretagogue used in laboratory models as a selective GHS-R1a agonist, not as a GHRH analog.[1]",
      "Tetrava Labs lists ipamorelin as Research Use Only [research peptides](/) for receptor and pituitary-axis work. Labs that buy ipamorelin online here are purchasing a documented reagent, not a clinic product. Not for human or veterinary use.",
    ],
    otherKnownTitles: [
      "IPA",
    ],
    sections: [
      {
        heading: "What ipamorelin is",
        paragraphs: [
          "Ipamorelin is a ghrelin-receptor (GHS-R1a) ligand. It sits in the growth-hormone secretagogue class. It does not bind the GHRH receptor, and it is not a shortened GHRH peptide.[1]",
          "That receptor split is the whole procurement problem. Forum posts treat ipamorelin, sermorelin, and tesamorelin as interchangeable 'GH peptides.' They are not. One is a GHS. The others are GHRH-axis ligands.",
        ],
      },
      {
        heading: "GHS-R1a selectivity is the mechanism worth testing",
        paragraphs: [
          "A [2018 secretagogue review](https://pmc.ncbi.nlm.nih.gov/articles/PMC5632578/) treats ipamorelin as a GHS-R1a ligand with less ACTH and cortisol spillover than older GHRP-class agents in the literature it summarizes.[1] That selectivity is a claim you can design around. It is not a promise that a vial will 'only do GH' in every model.",
          "If the notebook says secretagogue and the only readout is a GH ELISA, you have not tested the claim the review is known for. Parallel ACTH or cortisol wells are how that narrower profile is even discussed.[1]",
        ],
      },
      {
        heading: "A CJC stack is not solo ipamorelin",
        paragraphs: [
          "Most 'buy ipamorelin' traffic is looking for a CJC combination. Solo ipamorelin is a GHS-R1a probe. [CJC-1295 without DAC](/cjc-1295-without-dac) is a GHRH-analog problem. Mixing them in a cart does not merge the receptors.",
          "If the protocol needs a GHRH-receptor ligand, order that ligand. If it needs a ghrelin-mimetic, order ipamorelin. A blend vial is a third material with its own identity check, not a shortcut through either paper trail.[1]",
        ],
      },
      {
        heading: "GH ELISA at 15 minutes vs 3 hours",
        paragraphs: [
          "In a pituitary-cell or explant secretagogue assay, a GH ELISA read at 15 minutes sits in the early pulse window the GHS literature actually discusses.[1] Read the same plate at 3 hours and you are scoring a different kinetic, including whatever the cells did after the first peak.",
          "Add ACTH or cortisol as a parallel well if selectivity is the hypothesis. Leave those wells out and you can still generate a GH curve. You cannot claim the narrow profile the review describes.[1]",
        ],
      },
      {
        heading: "Ipamorelin vs sermorelin",
        paragraphs: [
          "Ipamorelin vs sermorelin is a receptor question. [Sermorelin](/buy-sermorelin-peptide) is GHRH(1-29). Ipamorelin is a GHS-R1a pentapeptide.[1] Tesamorelin vs ipamorelin is the same split one step longer: tesamorelin is a stabilized GHRH analog that clinical trials have explored in a branded setting, still not a ghrelin mimetic.[2]",
          "Pick the ligand that matches the receptor you intend to occupy. Do not pick the one that ranks higher for 'buy ipamorelin.'",
        ],
      },
      {
        heading: "Ipamorelin peptide where to buy: lot HPLC first",
        paragraphs: [
          "Ipamorelin peptide where to buy should end at a vial whose lot-linked HPLC-MS file matches the pentapeptide you wrote into the protocol. Tetrava Labs posts that analytical record in the [Certificate of Analysis](/coa-library) library when a batch is published.",
          "A stack listing that happens to contain ipamorelin is not this page. Confirm the handle, then confirm the chromatogram.",
        ],
      },
      {
        heading: "Laboratory handling",
        paragraphs: [
          "Store sealed lyophilized vials per your peptide SOP. Log lot, operator, and COA file name before any pituitary plate goes in the incubator.",
          "Return to the specifications on this page or the matching COA when the identity check is done. This tab is not a use protocol.",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "Sigalos JT, Pastuszak AW. The Safety and Efficacy of Growth Hormone Secretagogues. Sex Med Rev. 2018;6(1):45-53.",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5632578/",
      },
      {
        id: 2,
        citation:
          "Falutz J, Allas S, Blot K, et al. Metabolic effects of a growth hormone-releasing factor in patients with HIV. N Engl J Med. 2007;357(2):141-152.",
        url: "https://pubmed.ncbi.nlm.nih.gov/17625127/",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-09-12",
  },
  "tesamorelin": {
    shortDescription: [
      "Tesamorelin is a stabilized growth-hormone-releasing hormone analog. Clinical trials have explored a branded form in HIV-associated visceral fat redistribution; that labeled use does not attach to a research vial.[1]",
      "Tetrava Labs sells tesamorelin as Research Use Only [research peptides](/). A tesamorelin peptide buy or buy tesamorelin online order on this site is a reagent purchase, not Egrifta. Not for human or veterinary use.",
    ],
    otherKnownTitles: [
      "Egrifta",
      "TH9507",
    ],
    sections: [
      {
        heading: "What tesamorelin is",
        paragraphs: [
          "Tesamorelin is a GHRH analog. It is built to occupy the GHRH receptor and, in clinical research, to move the downstream GH axis.[1] It is not 191-amino-acid growth hormone, and it is not a ghrelin-receptor secretagogue.",
          "The prescription product is sold under the name Egrifta for a specific labeled population. The lyophilized research listing is a different commercial object even when the amino-acid story overlaps.",
        ],
      },
      {
        heading: "GHRH-receptor logic vs a ghrelin mimetic",
        paragraphs: [
          "GHRH analogs and GHS-R1a ligands can both raise GH in research models. They do it through different receptors.[2] Tesamorelin is on the GHRH side. Ipamorelin is on the ghrelin-mimetic side.",
          "If the assay is a GHRH-receptor cAMP or reporter plate, tesamorelin is the matching class. If the assay is a GHS-R1a binding plate, it is the wrong ligand. Secretagogue reviews are useful background. They are not tesamorelin methods.[2]",
        ],
      },
      {
        heading: "The labeled indication stays with the drug",
        paragraphs: [
          "The [2007 NEJM trial](https://pubmed.ncbi.nlm.nih.gov/17625127/) scored metabolic effects of a growth-hormone-releasing factor in patients with HIV-associated fat redistribution.[1] That is a clinical dataset on a developed product. It does not travel with an RUO vial.",
          "Tesamorelin peptide where to buy is a reagent search. It is not a pharmacy search for Egrifta. Treating the FDA-facing indication as a property of catalog powder is how labs write the wrong aims paragraph.",
        ],
      },
      {
        heading: "VAT endpoints do not belong on a cAMP plate",
        paragraphs: [
          "Falutz and colleagues used visceral adipose tissue and related metabolic laboratories as clinical endpoints.[1] If your plate is a GHRH-receptor cAMP assay harvested at 30 minutes versus 4 hours, keep those endpoints. Do not import VAT change from the NEJM trial onto a vial label.",
          "A 30-minute read can catch an early cyclase peak. A 4-hour read can catch desensitization or media exhaustion. Neither time point is a body-composition study. Write the endpoint you actually measured.",
        ],
      },
      {
        heading: "Tesamorelin vs ipamorelin",
        paragraphs: [
          "Tesamorelin vs ipamorelin is GHRH analog vs GHS-R1a ligand.[2] [Ipamorelin](/buy-ipamorelin-online) is the ghrelin-mimetic comparison in this catalog. Sermorelin is the shorter GHRH(1-29) comparison. All three sit in the [growth-hormone-axis](/category/growth-hormone-axis) file. None of them is somatropin.",
          "Order the analog that matches the receptor. Do not order the one whose search ads mention 10 mg first.",
        ],
      },
      {
        heading: "Tesamorelin 10mg for sale is a mass on a label",
        paragraphs: [
          "Tesamorelin 10mg for sale and tesamorelin 10mg price are shopping strings. The first check is whether the mass on the vial matches the lot-linked HPLC identity on the COA. A price screenshot does not confirm a GHRH analog.",
          "Tetrava Labs posts that analytical file in the [Certificate of Analysis](/coa-library) library when a batch is published. If the chromatogram and the handle disagree, do not load the plate.",
        ],
      },
      {
        heading: "Laboratory handling",
        paragraphs: [
          "Store sealed lyophilized vials per your peptide SOP. File the lot COA with the material ID so the RUO analog is never confused with a branded drug record in the ELN.",
          "Use the specifications on this page or the matching COA as the next step. This tab is not a use protocol and it is not Egrifta labeling.",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "Falutz J, Allas S, Blot K, et al. Metabolic effects of a growth hormone-releasing factor in patients with HIV. N Engl J Med. 2007;357(2):141-152.",
        url: "https://pubmed.ncbi.nlm.nih.gov/17625127/",
      },
      {
        id: 2,
        citation:
          "Sigalos JT, Pastuszak AW. The Safety and Efficacy of Growth Hormone Secretagogues. Sex Med Rev. 2018;6(1):45-53.",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5632578/",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-09-12",
  },
  "hgh-191aa": {
    shortDescription: [
      "HGH 191aa is recombinant material built on the intact 191-amino-acid somatropin sequence in the NCBI GH1 gene record, not a C-terminal fragment and not a secretagogue.[1]",
      "Tetrava Labs supplies HGH 191aa for sale as a Research Use Only reagent for laboratory receptor and analytical work. Related [research peptides](/) on the GH axis are different molecules. Not for human or veterinary use.",
    ],
    otherKnownTitles: [
      "somatropin",
      "rhGH",
      "recombinant human growth hormone",
      "growth hormone 191aa",
    ],
    sections: [
      {
        heading: "What HGH 191aa is",
        paragraphs: [
          "HGH 191aa is the intact somatropin sequence. The [NCBI GH1 gene record](https://www.ncbi.nlm.nih.gov/gene/2688) is the identity file for that 191-residue human growth hormone chain, not a fragment catalog and not a secretagogue monograph.[1]",
          "HGH 191aa vs hgh is often a language problem. 191aa is the recombinant hormone sequence. Loose 'HGH' on forums can mean a fragment, a GHS, or a pharmacy pen. Those are not this listing.",
        ],
      },
      {
        heading: "Intact hormone, fragment, and secretagogue are three files",
        paragraphs: [
          "A C-terminal stretch sold as hGH fragment 176-191 is a different molecule. In this catalog that fragment lives on the [AOD-9604](/buy-aod-9604-online) page. Do not paste fragment notebooks into a 191aa methods line.[1]",
          "A GHRH analog such as tesamorelin sits upstream of the hormone. Clinical trials have explored tesamorelin as a releasing-factor drug in a branded setting. That is still not 191aa GH.[2] Growth-hormone secretagogues occupy GHS-R1a, another step removed.[3]",
        ],
      },
      {
        heading: "Consumer buy-HGH traffic is not this catalog item",
        paragraphs: [
          "Searches that say buy HGH are usually chasing a consumer story: pens, fragments, or secretagogue stacks. This page is HGH 191aa for sale as an RUO solid. It is not a dispensed medication and it is not AOD-9604.",
          "If the protocol needs the intact hormone record, stay here.[1] If it needs a fragment lipolysis model, open the AOD page. If it needs a GHRH analog, open tesamorelin. Mixing those aims under one slang name is how identity errors get into print.",
        ],
      },
      {
        heading: "A 24-hour GHR reporter is not a fragment lipolysis plate",
        paragraphs: [
          "A GHR-dependent reporter read at 24 hours is a somatropin-class design. The same clock on a C-terminal-fragment lipolysis plate is a different experiment. If both arms share the phrase growth hormone in the notebook, the methods are already wrong.[1]",
          "Read the reporter at 6 hours and you may be early for a transcription endpoint. Read it at 72 hours without a media change and you may be scoring starvation. Pick the clock for the hormone assay you wrote, not for a fragment paper you had open in another tab.",
        ],
      },
      {
        heading: "HGH 191aa vs tesamorelin",
        paragraphs: [
          "HGH 191aa vs tesamorelin is ligand vs releasing-factor analog. [Tesamorelin](/buy-tesamorelin-online) is a GHRH analog. HGH 191aa is the intact hormone sequence.[1][2]",
          "HGH 191aa vs hGH fragment 176-191 is the same kind of split on the other side of the chain: full somatropin versus the modified C-terminal fragment listed as AOD-9604. Order the chain you intend to put in the well.",
        ],
      },
      {
        heading: "Verify the lot against the hormone record",
        paragraphs: [
          "Lot-linked HPLC or equivalent identity data should agree with an intact-hormone catalog description, not with a fragment mass or a secretagogue pentapeptide.[1] Tetrava Labs posts that analytical file in the [Certificate of Analysis](/coa-library) library when a batch is published.",
          "If the COA reads like a fragment or a GHS, you have the wrong vial for a 191aa protocol. Stop before the plate.",
        ],
      },
      {
        heading: "Laboratory handling",
        paragraphs: [
          "Store sealed lyophilized vials per your protein SOP. Log the lot, the operator, and the COA file so the intact-hormone record stays attached to every run.",
          "Next step is the specifications on this page or the matching COA. This tab is not a use protocol.",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "National Center for Biotechnology Information. GH1 growth hormone 1 [Homo sapiens].",
        url: "https://www.ncbi.nlm.nih.gov/gene/2688",
      },
      {
        id: 2,
        citation:
          "Falutz J, Allas S, Blot K, et al. Metabolic effects of a growth hormone-releasing factor in patients with HIV. N Engl J Med. 2007;357(2):141-152.",
        url: "https://pubmed.ncbi.nlm.nih.gov/17625127/",
      },
      {
        id: 3,
        citation:
          "Sigalos JT, Pastuszak AW. The Safety and Efficacy of Growth Hormone Secretagogues. Sex Med Rev. 2018;6(1):45-53.",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5632578/",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-09-12",
  },

  "igf-1-lr3": {
    shortDescription: [
      "IGF-1 LR3 is the catalog name for Long R3 IGF-I, a research analog of native insulin-like growth factor 1. Mature IGF-1 is a 70-residue ligand. Long R3 IGF-I adds a 13-amino-acid N-terminal extension and replaces glutamic acid at position 3 with arginine (Glu3 to Arg). That pair of changes is the standard biochemical identity of the analog.[1]",
      "Tetrava Labs supplies this IGF-1 LR3 peptide as a lyophilized reagent among its [research peptides](/). Labs that buy IGF-1 LR3 here get lot-linked HPLC-MS identity and purity paperwork, not a finished medicine. Research use only. Not for human or veterinary consumption.",
    ],
    otherKnownTitles: [
      "Long R3 IGF-I",
      "Long Arg3 IGF-1",
      "LR3 IGF-1",
      "IGF1 LR3",
    ],
    sections: [
      {
        heading: "How Long R3 IGF-I differs from native IGF-1",
        paragraphs: [
          "Native IGF-1 is the secreted ligand at the type 1 IGF receptor. The [NCBI IGF1 gene record](https://www.ncbi.nlm.nih.gov/gene/3479) is the identity file for that parent protein; Long R3 IGF-I is the research analog built on top of it.[1] The 13-residue N-terminal extension and the Arg3 substitution are why vendors and papers call the material Long R3, not wild-type IGF-1.",
          "Those edits reduce sequestration by IGF-binding proteins in culture systems, which is why many receptor and IGFBP-competition protocols use Long R3 instead of the 70-residue ligand. Write the analog name into the plate map. Native IGF-1 and Long R3 IGF-I are not interchangeable controls.",
        ],
      },
      {
        heading: "Is igf-1 lr3 a steroid?",
        paragraphs: [
          "No. igf-1 lr3 is a peptide growth-factor analog. It is not an anabolic-androgen receptor ligand, and it is not a controlled steroid class.",
          "Forum threads still file it next to steroids because both show up in body-composition talk. Chemistry does not care. A 70- to 83-residue protein analog and a tetracyclic androgen do not share a receptor, a scaffold, or an assay. If a protocol needs an androgen-receptor control, use one. This vial is the wrong molecule for that arm.",
        ],
      },
      {
        heading: "What a published IGF-1 assay is actually asking",
        paragraphs: [
          "This page does not invent a Francis PMID or a trial N. The analog shows up in IGF-1 receptor binding, phosphorylation readouts, and IGFBP-competition work because the Arg3 swap and the N-terminal extension change how much ligand stays free of binding proteins.[1]",
          "That is a biochemical identity claim, not a human outcome. A culture EC50 from one cell line does not become a catalog schedule. If the method needs native IGF-1 as the reference ligand, order that sequence. If it needs Long R3, match the COA sequence to Long R3.",
        ],
      },
      {
        heading: "igf-1 lr3 vs hGH, and vs semaglutide",
        paragraphs: [
          "igf-1 lr3 vs hGH is a ligand-versus-hormone question. [HGH 191aa](/buy-hgh-191aa-online) is a pituitary hormone that acts at the GH receptor. IGF-1 is a downstream ligand. Long R3 IGF-I is a modified form of that ligand. They sit on the same axis and they are not substitutes.",
          "[Semaglutide](/buy-semaglutide-online) is unrelated. It is a GLP-1 receptor agonist. Shared \"metabolic peptide\" marketing does not make a growth-factor analog and an incretin analog the same control. Pick the receptor the assay is built to read.",
        ],
      },
      {
        heading: "igf-1 peptide for sale: what the COA has to show",
        paragraphs: [
          "igf-1 lr3 price is a procurement field. It is not a purity result. An igf-1 peptide for sale listing without a lot number that matches the vial is a catalog sentence, not a qualified reagent.",
          "Tetrava Labs lists 0.1 mg and 1 mg lyophilized vials. Check the [Certificate of Analysis](/coa-library) for the batch: HPLC-MS identity, purity by area-under-curve, and a lot that matches the label. A generic PDF reused across strengths is not that.",
        ],
      },
      {
        heading: "Laboratory handling",
        paragraphs: [
          "Ships lyophilized. Store sealed vials at -20°C. Skip repeated freeze-thaw. Reconstitute under sterile technique with the diluent the SOP names, right before use.",
          "Log diluent lot, concentration, date, and operator in the ELN so the prep still matches the batch COA later. This page does not publish a human dose, a reconstitution-for-injection chart, or a cycle. Research use only.",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "National Center for Biotechnology Information. IGF1 insulin like growth factor 1 [Homo sapiens].",
        url: "https://www.ncbi.nlm.nih.gov/gene/3479",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-09-12",
  },
  "cjc-1295-without-dac": {
    shortDescription: [
      "CJC-1295 without DAC is a modified GHRH(1-29) analog sold without the albumin-binding Drug Affinity Complex. DAC is a linker, not a second receptor. The peptide still targets the growth-hormone-releasing hormone receptor on pituitary somatotrophs.",
      "Tetrava Labs lists this analog with its other [research peptides](/). Labs that buy cjc-1295 no dac here get a lyophilized, lot-documented reagent for pulsatile GHRH-receptor work. Research use only. Not for human or veterinary consumption.",
    ],
    otherKnownTitles: [
      "CJC-1295 no DAC",
      "Mod GRF 1-29",
      "Modified GRF(1-29)",
      "CJC without DAC",
    ],
    sections: [
      {
        heading: "What cjc-1295 no dac does",
        paragraphs: [
          "It is a GHRH(1-29) analog. It binds GHRHR and is used when a protocol wants a secretagogue that still sits on the GHRH receptor, not the ghrelin receptor.[3] Catalog copy often calls the no-DAC form Mod GRF 1-29. That name is a synonym for the peptide without the maleimide albumin handle, not a different mechanism.",
          "Unmodified GHRH(1-29) is short-lived in plasma because dipeptidyl peptidase-IV cuts the N terminus. The CJC series started as tetrasubstituted hGRF(1-29) built to slow that breakdown, then added a C-terminal maleimidopropionamide on lysine so the peptide could lock onto albumin.[1] Strip the maleimide and you still have the modified GHRH fragment. You do not have the albumin bioconjugate that Jette named CJC-1295.",
        ],
      },
      {
        heading: "The 8-day half-life does not belong on a no-DAC vial",
        paragraphs: [
          "Teichman 2006 measured a 5.8 to 8.1 day half-life after subcutaneous CJC-1295 in healthy adults. That paper is the DAC analog: prolonged GH and IGF-I, mean GH up 2- to 10-fold for 6 days or more, mean IGF-I up 1.5- to 3-fold for 9 to 11 days.[2]",
          "Those numbers do not transfer to cjc-1295 without dac. DAC is the albumin linker. No linker, no 8-day claim. Mixing the two on a forum thread is how a pulsatile GHRH reagent gets a depot half-life it was never given.",
        ],
      },
      {
        heading: "Jette 2005 and Teichman 2006 are DAC papers",
        paragraphs: [
          "Jette synthesized maleimido hGRF(1-29) derivatives, conjugated them to albumin at Cys34, and picked CJC-1295 as the tetrasubstituted peptide with an N-epsilon-3-maleimidopropionamide on the C-terminal lysine. In rats it raised GH area-under-the-curve about 4-fold over 2 hours versus hGRF(1-29), stayed detectable in plasma past 72 hours, and showed an albumin-band immunoreactive species from 15 minutes past 24 hours.[1]",
          "Teichman then ran two randomized, placebo-controlled, double-blind ascending-dose trials in healthy adults aged 21 to 61, 28 and 49 days, single then weekly or biweekly subcutaneous doses.[2] That design is how the 8-day half-life entered the literature. It is not a bridging study for a no-DAC vial. If the protocol needs the albumin conjugate, order [CJC-1295 with DAC](/cjc-1295-with-dac).",
        ],
      },
      {
        heading: "cjc-1295 with dac vs without dac, and vs ipamorelin",
        paragraphs: [
          "cjc-1295 with dac vs without dac is a clearance question. Same GHRH-receptor class. Different mass, different CAS, different sampling window. Do not swap them mid-protocol without a bridging arm.",
          "[Ipamorelin](/buy-ipamorelin-online) is a different receptor: ghrelin receptor (GHS-R1a), the growth-hormone-secretagogue class Sigalos reviews separately from GHRH analogs.[3] Pairing no-DAC CJC with ipamorelin is a two-receptor design, not a double dose of one ligand. Sermorelin is closer chemically: unmodified GHRH(1-29)-NH2, shorter plasma life, same receptor family.",
        ],
      },
      {
        heading: "Buy cjc-1295 no dac: lot paperwork first",
        paragraphs: [
          "Buy cjc-1295 and you will see DAC and no-DAC mixed in the same search. Read the handle. The vial has to say without DAC, or Mod GRF 1-29, and the COA mass has to match the no-linker peptide, not the albumin conjugate.",
          "Lot number on the vial has to match the lot in the [Certificate of Analysis](/coa-library). Third-party HPLC-MS, identity plus purity. A purity percentage with no chromatogram is a claim. Price does not fix a missing lot.",
        ],
      },
      {
        heading: "Laboratory handling",
        paragraphs: [
          "Ships lyophilized. Store sealed vials at -20°C. Skip repeated freeze-thaw. Reconstitute under sterile technique with the diluent the SOP names, right before use.",
          "Log diluent lot, concentration, date, and operator so the prep stays auditable against the batch COA. This page does not publish a human dose, a stack schedule, or a reconstitution-for-injection chart. Research use only.",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "Jette L et al. Human growth hormone-releasing factor (hGRF)1-29-albumin bioconjugates activate the GRF receptor on the anterior pituitary in rats: identification of CJC-1295 as a long-lasting GRF analog. J Med Chem. 2005.",
        url: "https://pubmed.ncbi.nlm.nih.gov/15817669/",
      },
      {
        id: 2,
        citation:
          "Teichman SL, Neale A, Lawrence B, Gagnon C, Castaigne JP, Frohman LA. Prolonged stimulation of growth hormone (GH) and insulin-like growth factor I secretion by CJC-1295, a long-acting analog of GH-releasing hormone, in healthy adults. J Clin Endocrinol Metab. 2006.",
        url: "https://pubmed.ncbi.nlm.nih.gov/16352683/",
      },
      {
        id: 3,
        citation:
          "Sigalos JT, Pastuszak AW. The Safety and Efficacy of Growth Hormone Secretagogues. Sex Med Rev. 2018;6(1):45-53.",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5632578/",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-09-12",
  },
  "cjc-1295-with-dac": {
    shortDescription: [
      "CJC-1295 with DAC is a tetrasubstituted GHRH(1-29) analog with a C-terminal Drug Affinity Complex. The DAC is a maleimidopropionamide on lysine that covalently binds the free thiol on Cys34 of serum albumin.[1]",
      "Tetrava Labs sells this analog as a lyophilized [research peptides](/) reagent for extended GHRH-receptor exposure models. Labs that buy cjc-1295 here should confirm the COA is the DAC conjugate, not Mod GRF 1-29. Research use only. Not for human or veterinary consumption.",
    ],
    otherKnownTitles: [
      "CJC-1295 DAC",
      "CJC with DAC",
      "DAC-GRF",
      "hGRF(1-29)-albumin bioconjugate",
    ],
    sections: [
      {
        heading: "What is cjc-1295 with dac",
        paragraphs: [
          "Jette's 2005 chemistry paper is the identity document. Three maleimido hGRF(1-29) derivatives were conjugated to human serum albumin. All three conjugates were more stable against dipeptidyl peptidase-IV in vitro and still released GH from cultured rat anterior pituitary cells. CJC-1295 was the tetrasubstituted peptide plus the N-epsilon-3-maleimidopropionamide on the C-terminal lysine.[1]",
          "In rats, that analog raised GH area-under-the-curve about 4-fold over 2 hours versus hGRF(1-29), stayed in plasma beyond 72 hours, and produced an albumin-band immunoreactive species from 15 minutes through more than 24 hours.[1] The linker is the point. Without it, the catalog item is a different reagent.",
        ],
      },
      {
        heading: "DAC is not a nickname for \"longer sermorelin\"",
        paragraphs: [
          "Sermorelin is GHRH(1-29)-NH2. CJC-1295 with DAC is a modified GHRH(1-29) that also carries an albumin-binding handle. Same receptor class. Different clearance. Calling every GHRH vial \"CJC\" erases that.",
          "Teichman 2006 half-life (5.8 to 8.1 days) belongs to the DAC analog.[2] It does not describe [CJC-1295 without DAC](/cjc-1295-without-dac). If a protocol quotes an 8-day window, the vial in the box has to be the conjugate.",
        ],
      },
      {
        heading: "Teichman 2006: the human PK/PD design",
        paragraphs: [
          "Teichman ran two randomized, placebo-controlled, double-blind, ascending-dose trials in healthy adults aged 21 to 61, at two sites, lasting 28 and 49 days. Study one used single subcutaneous doses. Study two used two or three weekly or biweekly doses.[2]",
          "After a single injection, mean plasma GH rose 2- to 10-fold for 6 days or more, and mean IGF-I rose 1.5- to 3-fold for 9 to 11 days. Estimated half-life was 5.8 to 8.1 days. After multiple doses, mean IGF-I stayed above baseline for up to 28 days. No serious adverse reactions were reported in that paper.[2]",
          "Those figures are clinic-arm PK/PD. They do not convert a catalog vial, including a cjc-1295 with dac 10mg vial, into a human schedule. 10 mg is how much peptide is in the sealed vial.",
        ],
      },
      {
        heading: "cjc-1295 with dac vs without dac",
        paragraphs: [
          "With DAC versus without DAC is albumin binding versus no albumin binding. Jette's Western blot and the Teichman half-life are on the DAC side.[1][2] No-DAC (Mod GRF 1-29) is the modified GHRH fragment without the maleimide. Different molecular weight. Different sampling interval.",
          "Ipamorelin and other ghrelin-receptor ligands sit in a separate class. Sigalos's review treats growth-hormone secretagogues as GHS-R ligands, not GHRH-receptor analogs.[3] A GHRH-plus-GHS design is two receptors. Write both into the protocol.",
        ],
      },
      {
        heading: "Buy cjc-1295: confirm the conjugate on the COA",
        paragraphs: [
          "Buy cjc-1295 and the SERP will mix DAC and no-DAC. The COA has to name the DAC conjugate. Mass and sequence notes should match the albumin-binding analog, not Mod GRF 1-29.",
          "Lot on the vial has to match the lot in the [Certificate of Analysis](/coa-library). Third-party HPLC-MS, identity plus purity. A 10 mg label is inventory. It is not a published clinic dose from Teichman.",
        ],
      },
      {
        heading: "Laboratory handling",
        paragraphs: [
          "Ships lyophilized. Store sealed vials at -20°C. Skip repeated freeze-thaw. Reconstitute under sterile technique with the diluent the SOP names, right before use.",
          "Log diluent lot, concentration, date, and operator. This page does not publish a microgram-per-kilogram clinic conversion or an injection protocol. Research use only.",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "Jette L et al. Human growth hormone-releasing factor (hGRF)1-29-albumin bioconjugates activate the GRF receptor on the anterior pituitary in rats: identification of CJC-1295 as a long-lasting GRF analog. J Med Chem. 2005.",
        url: "https://pubmed.ncbi.nlm.nih.gov/15817669/",
      },
      {
        id: 2,
        citation:
          "Teichman SL, Neale A, Lawrence B, Gagnon C, Castaigne JP, Frohman LA. Prolonged stimulation of growth hormone (GH) and insulin-like growth factor I secretion by CJC-1295, a long-acting analog of GH-releasing hormone, in healthy adults. J Clin Endocrinol Metab. 2006.",
        url: "https://pubmed.ncbi.nlm.nih.gov/16352683/",
      },
      {
        id: 3,
        citation:
          "Sigalos JT, Pastuszak AW. The Safety and Efficacy of Growth Hormone Secretagogues. Sex Med Rev. 2018;6(1):45-53.",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5632578/",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-09-12",
  },
  "kpv": {
    shortDescription: [
      "KPV peptide is Lys-Pro-Val, the C-terminal tripeptide of alpha-melanocyte-stimulating hormone (alpha-MSH). Bare \"kpv\" search results are noisy. Most of them are not this sequence.",
      "Tetrava Labs lists kpv peptide as a lyophilized [research peptides](/) vial for epithelial and immune-cell inflammation models. Labs that buy kpv peptide here get lot-linked HPLC-MS paperwork. Research use only. Not for human or veterinary consumption.",
    ],
    otherKnownTitles: [
      "Lys-Pro-Val",
      "KPV tripeptide",
      "alpha-MSH(11-13)",
      "C-terminal alpha-MSH tripeptide",
    ],
    sections: [
      {
        heading: "PepT1 transport, not pigmentation",
        paragraphs: [
          "Cut Lys-Pro-Val off the tail of alpha-MSH and the melanocortin pigmentation story largely drops away. What remains in the Dalmasso work is a short peptide that intestinal epithelial cells and some immune cells can take up through PepT1, the di/tripeptide transporter.[1]",
          "PepT1 is normally expressed in small intestine and is induced in colon during inflammatory-bowel-disease models. That is the transport claim. It is not a consumer route-of-administration guide.",
        ],
      },
      {
        heading: "Oral vs injection is a PepT1 question",
        paragraphs: [
          "kpv peptide oral vs injection threads treat the search like a capsule-versus-shot shopping list. Dalmasso asked something narrower: can PepT1 carry KPV into Caco2-BBE, HT29-Cl.19A, and Jurkat cells, and does that uptake line up with an anti-inflammatory readout?[1]",
          "kpv capsules in a retail sense are a different product format. This listing is a lyophilized 5 mg or 10 mg vial. A capsule search does not change the sequence, and it does not make a drinking-water mouse arm into a human oral protocol.",
        ],
      },
      {
        heading: "Dalmasso 2008: cells, then DSS and TNBS mice",
        paragraphs: [
          "Dalmasso stimulated those epithelial and T-cell lines with proinflammatory cytokines, with or without KPV, and read NF-kappaB luciferase, Western blot, RT-PCR, and ELISA. Uptake used cold KPV as a competitor for a PepT1 substrate, and [3H]KPV for kinetics.[1]",
          "Nanomolar KPV inhibited NF-kappaB and MAP-kinase inflammatory signaling and cut proinflammatory cytokine secretion in that system. The same paper put KPV in drinking water in DSS- and TNBS-induced mouse colitis and reported less histologic inflammation and lower proinflammatory cytokine mRNA.[1]",
          "That is one Gastroenterology paper: cell lines plus two chemical-colitis models. Research suggests a PepT1-linked anti-inflammatory signal in those assays. It is not a safety label and not an IBD treatment claim.",
        ],
      },
      {
        heading: "KPV next to KLOW Blend",
        paragraphs: [
          "[KLOW Blend](/klow-blend) adds KPV on top of BPC-157, TB-500, and GHK-Cu. The single-component vial is for protocols that need Lys-Pro-Val alone, or a clean add-back against a three-peptide baseline.",
          "A four-peak chromatogram and a one-peak chromatogram are different identity checks. Do not treat the blend COA as proof of the single-peptide lot.",
        ],
      },
      {
        heading: "Is kpv peptide safe, and where to buy",
        paragraphs: [
          "is kpv peptide safe does not have a human prescribing answer on this page. Dalmasso is preclinical: cultured cells and mouse colitis.[1] Tetrava's vial is Research Use Only. There is no patient leaflet.",
          "kpv peptide where to buy is a documentation check. Lot on the vial has to match the lot in the [Certificate of Analysis](/coa-library). Third-party HPLC-MS, sequence consistent with Lys-Pro-Val. A purity percentage with no lot is not a result.",
        ],
      },
      {
        heading: "Laboratory handling",
        paragraphs: [
          "Ships lyophilized. Store sealed vials at -20°C. Skip repeated freeze-thaw. Reconstitute under sterile technique with the diluent the SOP names, right before use.",
          "If the assay is a PepT1 uptake or colitis model, pull concentrations and vehicles from the primary paper, not from a capsule blog. Log diluent lot, date, and operator. Research use only.",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "Dalmasso G, Charrier-Hisamuddin L, Nguyen HT, Yan Y, Sitaraman S, Merlin D. PepT1-mediated tripeptide KPV uptake reduces intestinal inflammation. Gastroenterology. 2008;134(1):166-178.",
        url: "https://pubmed.ncbi.nlm.nih.gov/18061177/",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-09-12",
  },
  "epithalon": {
    shortDescription: [
      "Epithalon is the synthetic tetrapeptide Ala-Glu-Asp-Gly. Papers and vendors also spell it epitalon. Same four residues either way.",
      "Tetrava Labs sells epithalon as a lyophilized reagent with its other [research peptides](/). Labs that buy epithalon here get lot-linked HPLC-MS identity and purity data. Research use only. Not for human or veterinary consumption.",
    ],
    otherKnownTitles: [
      "Epitalon",
      "AEDG",
      "Ala-Glu-Asp-Gly",
      "Epithalon tetrapeptide",
    ],
    sections: [
      {
        heading: "A four-residue pineal peptide, not a telomere drug",
        paragraphs: [
          "Ala-Glu-Asp-Gly came out of Vladimir Khavinson's short-peptide program. The 2003 fibroblast paper reports that adding Epithalon to a telomerase-negative human fetal fibroblast culture induced the catalytic subunit, telomerase enzymatic activity, and telomere elongation.[1]",
          "That is one Russian-lab cell series. It is a proposed reactivation of telomerase in those cultures. It is not settled telomere therapy, and it is not a license to call a catalog vial a longevity drug.",
        ],
      },
      {
        heading: "Epitalon vs epithalon, and epitalon and cancer",
        paragraphs: [
          "epitalon vs epithalon is spelling. AEDG either way. If two COAs disagree on mass or sequence, that is a lot problem, not a name problem.",
          "epitalon and cancer is a different query. Anisimov's 2003 SHR-mouse paper did not change total spontaneous tumor incidence. It reported a lower leukemia count in the Epitalon group (6.0-fold) in that one colony.[2] Limited, non-Western evidence. Not an anticancer indication. Tetrava does not sell this peptide as a cancer therapy. Research use only.",
        ],
      },
      {
        heading: "Two papers from the same research line",
        paragraphs: [
          "Khavinson, Bondarev, and Butyugov (Bull Exp Biol Med, 2003) used telomerase-negative human fetal fibroblasts. The abstract states induction of the catalytic subunit, enzymatic telomerase activity, and longer telomeres after Epithalon was added to the culture.[1] No independent Western replication is cited on this page. Treat it as the paper it is: a short methods note from that group.",
          "Anisimov, Khavinson, and colleagues then ran female Swiss-derived SHR mice from 3 months to natural death, 54 mice per group, with a monthly five-day subcutaneous course of Epitalon versus saline. Food intake, body weight, and mean life span did not move. The last 10% of survivors lived 13.3% longer, maximum life span 12.3% longer, bone-marrow chromosome aberrations 17.1% lower, and age-related estrous shutdown was slower.[2]",
          "Those mouse numbers stay in that paper. They do not scale to a person, and they do not become a catalog cycle.",
        ],
      },
      {
        heading: "Epitalon vs pinealon",
        paragraphs: [
          "epitalon vs pinealon is two sequences. Epithalon is Ala-Glu-Asp-Gly (four residues). [Pinealon](/buy-pinealon-online) is Glu-Asp-Arg (three residues). Same Khavinson tradition. Different peptide.",
          "Pinealon literature is oxidative-stress and neuronal-viability work. Epithalon literature is telomerase and rodent lifespan work. Do not swap them because both get filed under pineal bioregulators.",
        ],
      },
      {
        heading: "Buy epithalon, including the 50 mg vial",
        paragraphs: [
          "buy epithalon is a documentation check. Tetrava lists 10 mg, 20 mg, and 50 mg lyophilized vials. epithalon 50mg is a pack size. It is not a published human dose from Khavinson or Anisimov.",
          "Lot on the vial has to match the lot in the [Certificate of Analysis](/coa-library). Sequence should read Ala-Glu-Asp-Gly. Third-party HPLC-MS, identity plus purity. A generic \"99%\" PDF with no lot is not a result.",
        ],
      },
      {
        heading: "Laboratory handling",
        paragraphs: [
          "Ships lyophilized. Store sealed vials at -20°C. Skip repeated freeze-thaw. Reconstitute under sterile technique with the diluent the SOP names, right before use.",
          "Log diluent lot, concentration, date, and operator. Pull culture concentrations from the primary paper for that model. This page does not publish a human telomere protocol. Research use only.",
        ],
      },
    ],
    references: [
      {
        id: 1,
        citation:
          "Khavinson VK, Bondarev IE, Butyugov AA. Peptide Epitalon activates telomerase / Epithalon peptide induces telomerase activity and telomere elongation in human somatic cells. Bull Exp Biol Med. 2003;135(6):590-592.",
        url: "https://pubmed.ncbi.nlm.nih.gov/12937682/",
      },
      {
        id: 2,
        citation:
          "Anisimov VN, Khavinson VK, et al. Effect of Epitalon on biomarkers of aging, life span and spontaneous tumor incidence in female Swiss-derived SHR mice. Biogerontology. 2003.",
        url: "https://pubmed.ncbi.nlm.nih.gov/14501183/",
      },
    ],
    authorId: "editorial-team",
    updatedAt: "2026-09-12",
  },
};
