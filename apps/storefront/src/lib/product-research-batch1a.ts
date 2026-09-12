import "server-only";

import type { ProductResearchDetail } from "@/lib/product-research-types";

export const BATCH1A_RESEARCH: Record<string, ProductResearchDetail> = {
  "ghk-cu": {
    shortDescription: [
      "GHK-Cu is glycyl-L-histidyl-L-lysine bound to copper(II). Pickart's 1980 Nature paper treated the plasma tripeptide as a copper-uptake factor, not as a cream ingredient.[4]",
      "Tetrava Labs sells GHK-Cu as a lyophilized Research Use Only solid for copper-handling and extracellular-matrix work. A buy GHK-Cu order on this catalog is a documented vial among the other [research peptides](/), not a serum. Not for human or veterinary use.",
    ],
    otherKnownTitles: [
      "Copper tripeptide-1",
      "GHK copper",
      "Glycyl-L-histidyl-L-lysine copper complex",
      "Copper peptide",
    ],
    sections: [
      {
        heading: "The hyphen is the metal",
        paragraphs: [
          "The peptide is Gly-His-Lys. The catalog hyphen marks copper(II). That distinction matters the moment the readout is copper delivery rather than the backbone alone.[3][4]",
          "Pickart's later reviews put GHK-Cu against extracellular-matrix genes and remodeling enzymes in cultured cells and tissue models.[2] Those papers describe plates and explants. They do not describe a finished topical sitting on a bathroom shelf.",
        ],
      },
      {
        heading: "Copper uptake is the older mechanism",
        paragraphs: [
          "The 1980 Nature experiment asked whether the plasma tripeptide moves copper into cells.[4] No serum. No volunteer arm.",
          "If the assay is copper uptake or a copper-dependent enzyme, copper-free GHK and GHK-Cu are different reagents. Putting both in the same well because the three-letter name matches is a methods error. Later reviews keep the metal-handling idea and add gene-level remodeling.[2][3] Write the form that went into the well. The line \"copper peptide\" is not an identity.",
        ],
      },
      {
        heading: "A long gene list is not a product comparison",
        paragraphs: [
          "A widely copied sentence says GHK resets expression of thousands of genes. The [2018 gene-data paper](https://pubmed.ncbi.nlm.nih.gov/29986520/) is a microarray-style argument. It is not a head-to-head of a cosmetic GHK-Cu peptide topical against a lyophilized research lot.[1]",
          "A differential-expression list is a hypothesis generator. It does not prove two products that share three letters are interchangeable. In uptake work that treats copper delivery as the mechanism, GHK and GHK-Cu still split.[4]",
          "\"Is GHK-Cu peptide safe\" is a lab SOP question: identity, lot HPLC, chemical-hygiene rules. Plasma occurrence does not turn an RUO vial into personal care.[2][3]",
        ],
      },
      {
        heading: "Read the ELISA at 24 h and again at 72 h",
        paragraphs: [
          "Seed dermal fibroblasts with GHK-Cu and score a published matrix endpoint such as collagen or glycosaminoglycan.[2] A 24-hour ELISA can look flat. The same wells at 72 hours can look like another study. Those reviews treat matrix remodeling as a delayed transcriptional program, not an overnight dye change.[2]",
          "Add a copper-uptake arm copied from the 1980 cellular work.[4] If GHK and GHK-Cu overlay on the ELISA and split on the metal assay, the hyphen earned its keep.",
          "Capsule and topical listings online are usually finished consumer formats. A cell monolayer does not answer capsule absorption. A topical vehicle is a formulation study. This page is the research solid. Tetrava lists 50 mg and 100 mg lyophilized vials.",
        ],
      },
      {
        heading: "GHK-Cu vs TB-500",
        paragraphs: [
          "Labs file GHK-Cu next to other [tissue-repair](/category/tissue-repair) reagents. GHK-Cu is a copper-binding tripeptide. Material sold as [TB-500](/buy-tb-500-online) is an acetylated heptapeptide fragment of thymosin beta-4.[3]",
          "Need an actin-binding fragment? Order that fragment. Need a copper-tripeptide complex? Order GHK-Cu.",
        ],
      },
      {
        heading: "Buy GHK-Cu after the chromatogram matches",
        paragraphs: [
          "Searches for ghk-cu peptide where to buy and ghk-cu peptide price usually want a cart number first. The number that matters is the lot on the vial against the HPLC identity on the [Certificate of Analysis](/coa-library).",
          "If the label, sequence, and chromatogram disagree, leave the plate empty.",
        ],
      },
      {
        heading: "Age in plasma vs age on a label",
        paragraphs: [
          "Pickart's tissue-remodeling review treats GHK as a circulating tripeptide whose measured plasma level falls with age in the human data that paper cites.[3] That is a plasma-chemistry observation. It is not a reason to treat a lyophilized research lot as a replacement for endogenous GHK-Cu.",
        ],
      },
      {
        heading: "Storage and lot notes",
        paragraphs: [
          "Keep sealed lyophilized vials under the copper-peptide storage line your SOP already names. Log lot, operator, and COA file in the ELN.",
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
    updatedAt: "2026-09-13",
  },
  "tb500": {
    shortDescription: [
      "TB-500 is a trade name. Mass spectrometry on commercial and seized lots identified the sold material as Ac-LKKTETQ, the N-acetylated 17-23 stretch of thymosin beta-4, not the 43-residue protein.[1]",
      "Tetrava Labs sells this TB-500 peptide as a Research Use Only laboratory reagent. Other [research peptides](/) in the same remodeling file should be ordered by sequence. Not for human or veterinary use.",
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
          "A synthetic heptapeptide: acetyl-Leu-Lys-Lys-Thr-Glu-Thr-Gln. Esposito's group synthesized that fragment and matched it to material sold as TB-500.[1]",
          "Full-length thymosin beta-4 is a 43-residue actin-sequestering protein. Older Tβ4 papers describe that protein. They do not automatically describe this vial.[1][2]",
        ],
      },
      {
        heading: "Why thymosin beta-4 reviews still get cited",
        paragraphs: [
          "Tβ4 reviews talk about cell migration, angiogenesis, and actin binding. They often point to an actin-binding motif that sits inside the 17-23 stretch.[2] That is why fragment catalogs and Tβ4 papers end up in the same binder.",
          "Sharing a motif is not identity. If the methods line says thymosin beta-4 and the dominant ion is Ac-LKKTETQ, the paper and the vial have already split.[1]",
        ],
      },
      {
        heading: "Is TB-500 a steroid?",
        paragraphs: [
          "No. Steroids are fused-ring lipids. TB-500 is a peptide fragment.[1] Forum threads that call it a steroid usually also treat full-length Tβ4 and the fragment as one reagent.",
          "Those threads also borrow oral claims from Tβ4 reviews. Published identity work does not give the fragment that exception.[1][2] Route is a protocol variable you have to validate on the heptapeptide. Pasting a protein paper into a fragment notebook does not finish the job.",
        ],
      },
      {
        heading: "Scratch the wound, then run the mass spec",
        paragraphs: [
          "Copy a Tβ4 scratch-wound protocol and score closure at 12 hours and 24 hours. The endpoint is still a Tβ4 endpoint from those regenerative-peptide reviews.[2]",
          "Run the same stock on a mass spec. If the dominant species is the acetylated heptapeptide Esposito described, write Ac-LKKTETQ in the methods.[1] A 6-hour imaging read can be plating noise. A clean 24-hour plate on the wrong molecule is still the wrong molecule.",
        ],
      },
      {
        heading: "TB-500 vs BPC-157",
        paragraphs: [
          "[BPC-157](/buy-bpc-157-online) is a 15-residue gastric-juice-derived peptide. TB-500 is the acetylated 17-23 Tβ4 fragment.[1] Both sit in tissue-repair catalogs. The sequences do not match.",
          "The FDA listed thymosin beta-4-related bulk substances among compounding materials that may present significant safety risks.[3] That is a regulatory flag. For a longer catalog side-by-side, see [BPC-157 vs TB-500](/blog/bpc-157-vs-tb-500).",
        ],
      },
      {
        heading: "Buy TB-500 after the lot matches the fragment",
        paragraphs: [
          "TB-500 peptide for sale and tb-500 price searches treat the trade name as settled. Check whether the [Certificate of Analysis](/coa-library) sequence and HPLC-MS ions match Ac-LKKTETQ.[1] Tetrava lists 5 mg and 10 mg lyophilized vials.",
          "A low cart total does not fix a full-length Tβ4 label on a fragment vial. File the [FDA compounding safety-risk page](https://www.fda.gov/drugs/human-drug-compounding) next to the lot paperwork.[3]",
        ],
      },
      {
        heading: "A doping-control unknown, not a tissue-repair trial",
        paragraphs: [
          "Esposito's group was a Ghent anti-doping lab treating TB-500 as an analytical unknown in a product suspected of doping potential.[1] They synthesized the fragment, then used liquid chromatography-mass spectrometry to show that the sold material matched Ac-LKKTETQ. Characterization. Not a wound-closure trial.",
        ],
      },
      {
        heading: "Storage and lot notes",
        paragraphs: [
          "Store sealed lyophilized vials per your peptide SOP. Record lot, operator, and COA file so the fragment identity stays on every plate.",
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
    updatedAt: "2026-09-13",
  },
  "ipamorelin": {
    shortDescription: [
      "Ipamorelin is a pentapeptide growth-hormone secretagogue used as a GHS-R1a agonist in laboratory models.[1] It does not bind the GHRH receptor.",
      "Tetrava Labs lists ipamorelin with its other Research Use Only [research peptides](/) for receptor and pituitary-axis work. Labs that buy ipamorelin online here get a documented reagent. Not for human or veterinary use.",
    ],
    otherKnownTitles: [
      "IPA",
    ],
    sections: [
      {
        heading: "What ipamorelin is",
        paragraphs: [
          "Ipamorelin is a ghrelin-receptor (GHS-R1a) ligand. It sits in the growth-hormone secretagogue class. It is not a shortened GHRH peptide.[1]",
          "Forum posts still treat ipamorelin, sermorelin, and tesamorelin as interchangeable GH peptides. One is a GHS. The others occupy the GHRH axis.",
        ],
      },
      {
        heading: "Selectivity is a plate design, not a slogan",
        paragraphs: [
          "A [2018 secretagogue review](https://pmc.ncbi.nlm.nih.gov/articles/PMC5632578/) treats ipamorelin as a GHS-R1a ligand with less ACTH and cortisol spillover than older GHRP-class agents in the papers it summarizes.[1]",
          "That narrower profile is something you can test. A notebook that says secretagogue and then only runs a GH ELISA has not tested it. Parallel ACTH or cortisol wells are how the review even discusses the claim.[1]",
        ],
      },
      {
        heading: "A CJC stack is a second receptor",
        paragraphs: [
          "Most buy ipamorelin traffic wants a CJC combination. Solo ipamorelin is a GHS-R1a probe. [CJC-1295 without DAC](/cjc-1295-without-dac) is a GHRH analog. Mixing them in a cart does not merge the receptors.[1]",
          "A blend vial is a third material with its own identity check.",
        ],
      },
      {
        heading: "GH ELISA at 15 minutes vs 3 hours",
        paragraphs: [
          "In a pituitary-cell or explant assay, a GH ELISA at 15 minutes sits in the early pulse window the GHS literature actually discusses.[1] Read the same plate at 3 hours and you are scoring whatever happened after the first peak, including media exhaustion.",
          "Leave the ACTH wells out and you can still draw a GH curve. You cannot claim the narrow profile the review describes.[1] Tetrava lists 5 mg and 10 mg lyophilized vials.",
        ],
      },
      {
        heading: "Ipamorelin vs sermorelin",
        paragraphs: [
          "[Sermorelin](/buy-sermorelin-peptide) is GHRH(1-29). Ipamorelin is a GHS-R1a pentapeptide.[1] Tesamorelin vs ipamorelin is the same split one step longer: tesamorelin is a stabilized GHRH analog that clinical trials have explored in a branded setting.[2]",
          "Pick the ligand that matches the receptor you intend to occupy.",
        ],
      },
      {
        heading: "Ipamorelin peptide where to buy",
        paragraphs: [
          "Ipamorelin peptide where to buy should end at a vial whose lot-linked HPLC-MS file in the [Certificate of Analysis](/coa-library) matches the pentapeptide you wrote into the protocol. A stack listing that happens to contain ipamorelin is a different handle.",
        ],
      },
      {
        heading: "Hexarelin is the dirtier GHS comparison",
        paragraphs: [
          "The same 2018 review treats hexarelin as a GHRP-class ligand with more ACTH, cortisol, and prolactin movement than ipamorelin.[1] Hexarelin is six residues. Ipamorelin is five. If the protocol needs that wider pituitary footprint, hexarelin is the comparator. If the protocol needs the narrower GH profile the review assigns to ipamorelin, stay on this vial.",
        ],
      },
      {
        heading: "Storage and lot notes",
        paragraphs: [
          "Store sealed lyophilized vials per your peptide SOP. Log lot, operator, and COA file before the pituitary plate goes in the incubator.",
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
    updatedAt: "2026-09-13",
  },
  "tesamorelin": {
    shortDescription: [
      "Tesamorelin is a stabilized growth-hormone-releasing hormone analog. Clinical trials have explored a branded form in HIV-associated visceral fat redistribution. That labeled use does not attach to a research vial.[1]",
      "Tetrava Labs sells tesamorelin as Research Use Only [research peptides](/). A tesamorelin peptide buy or buy tesamorelin online order here is a reagent purchase, not Egrifta. Not for human or veterinary use.",
    ],
    otherKnownTitles: [
      "Egrifta",
      "TH9507",
    ],
    sections: [
      {
        heading: "What tesamorelin is",
        paragraphs: [
          "Tesamorelin is a GHRH analog. It occupies the GHRH receptor and, in clinical research, moves the downstream GH axis.[1] It is not 191-amino-acid growth hormone. It is not a ghrelin-receptor secretagogue.",
          "The prescription product is sold as Egrifta for a labeled population. The lyophilized research listing is a different commercial object even when the amino-acid story overlaps.",
        ],
      },
      {
        heading: "GHRH receptor vs ghrelin receptor",
        paragraphs: [
          "GHRH analogs and GHS-R1a ligands can both raise GH in research models. They do it through different receptors.[2] Tesamorelin is on the GHRH side. Ipamorelin is on the ghrelin-mimetic side.",
          "A GHRH-receptor cAMP or reporter plate wants tesamorelin. A GHS-R1a binding plate does not. Secretagogue reviews are background. They are not tesamorelin methods.[2]",
        ],
      },
      {
        heading: "The labeled indication stays with the drug",
        paragraphs: [
          "The [2007 NEJM trial](https://pubmed.ncbi.nlm.nih.gov/17625127/) scored metabolic effects of a growth-hormone-releasing factor in patients with HIV-associated fat redistribution.[1] That dataset belongs to a developed product.",
          "Tesamorelin peptide where to buy is a reagent search. Treating the FDA-facing indication as a property of catalog powder is how the aims paragraph goes wrong.",
        ],
      },
      {
        heading: "VAT endpoints do not belong on a cAMP plate",
        paragraphs: [
          "Falutz used visceral adipose tissue and related metabolic laboratories as clinical endpoints.[1] If your plate is a GHRH-receptor cAMP assay harvested at 30 minutes versus 4 hours, keep those endpoints.",
          "A 30-minute read can catch an early cyclase peak. A 4-hour read can catch desensitization or media exhaustion. Neither time point is a body-composition study.",
        ],
      },
      {
        heading: "Tesamorelin vs ipamorelin",
        paragraphs: [
          "[Ipamorelin](/buy-ipamorelin-online) is the ghrelin-mimetic comparison in this catalog. Sermorelin is the shorter GHRH(1-29) comparison. All three sit in the [growth-hormone-axis](/category/growth-hormone-axis) file. None of them is somatropin.[2]",
          "Tetrava lists tesamorelin in 5 mg, 10 mg, and 20 mg lyophilized vials. Tesamorelin 10mg for sale is a mass on a label. Check that mass against the lot-linked HPLC identity in the [Certificate of Analysis](/coa-library).",
        ],
      },
      {
        heading: "What Falutz actually scored",
        paragraphs: [
          "The NEJM paper's endpoints were visceral adipose tissue and related metabolic laboratories in patients with HIV-associated fat redistribution, not a GHRH-receptor reporter harvested at 30 minutes.[1] Keep the imaging endpoint in the trial and the cyclase endpoint on the plate. They do not convert. The 20 mg catalog vial is still a fill mass. It is not a larger Egrifta carton.",
        ],
      },
      {
        heading: "Storage and lot notes",
        paragraphs: [
          "Store sealed lyophilized vials per your peptide SOP. File the lot COA with the material ID so the RUO analog is not confused with a branded drug record in the ELN.",
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
    updatedAt: "2026-09-13",
  },
  "hgh-191aa": {
    shortDescription: [
      "HGH 191aa is recombinant material built on the intact 191-amino-acid somatropin sequence in the NCBI GH1 gene record.[1] It is not a C-terminal fragment. It is not a secretagogue.",
      "Tetrava Labs supplies HGH 191aa for sale as a Research Use Only reagent for receptor and analytical work. Related [research peptides](/) on the GH axis are different molecules. Not for human or veterinary use.",
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
          "HGH 191aa is the intact somatropin sequence. The [NCBI GH1 gene record](https://www.ncbi.nlm.nih.gov/gene/2688) is the identity file for that 191-residue chain.[1]",
          "Loose \"HGH\" on forums can mean a fragment, a GHS, or a pharmacy pen. Those are not this listing.",
        ],
      },
      {
        heading: "Intact hormone, fragment, and secretagogue",
        paragraphs: [
          "A C-terminal stretch sold as hGH fragment 176-191 is a different molecule. In this catalog that fragment lives on the [AOD-9604](/buy-aod-9604-online) page.[1]",
          "A GHRH analog such as tesamorelin sits upstream of the hormone. Clinical trials have explored tesamorelin as a releasing-factor drug in a branded setting. Still not 191aa GH.[2] Growth-hormone secretagogues occupy GHS-R1a, another step removed.[3]",
        ],
      },
      {
        heading: "Buy HGH traffic is usually another product",
        paragraphs: [
          "Searches that say buy HGH often want pens, fragments, or secretagogue stacks. This page is HGH 191aa for sale as an RUO solid.",
          "Intact hormone record: stay here.[1] Fragment lipolysis model: AOD-9604. GHRH analog: tesamorelin. Mixing those aims under one slang name is how identity errors get into print.",
        ],
      },
      {
        heading: "A 24-hour GHR reporter is not a fragment lipolysis plate",
        paragraphs: [
          "A GHR-dependent reporter read at 24 hours is a somatropin-class design. The same clock on a C-terminal-fragment lipolysis plate is a different experiment.[1]",
          "Read the reporter at 6 hours and you may be early for a transcription endpoint. Read it at 72 hours without a media change and you may be scoring starvation. Pick the clock for the hormone assay you wrote.",
        ],
      },
      {
        heading: "HGH 191aa vs tesamorelin",
        paragraphs: [
          "[Tesamorelin](/buy-tesamorelin-online) is a GHRH analog. HGH 191aa is the intact hormone sequence.[1][2] Full somatropin versus the modified C-terminal fragment listed as AOD-9604 is the same kind of split on the other side of the chain.",
          "Lot-linked HPLC or equivalent identity data should agree with an intact-hormone catalog description, not a fragment mass or a secretagogue pentapeptide.[1] Check the [Certificate of Analysis](/coa-library). Tetrava lists HGH 191aa in IU-labeled lyophilized vials (10, 12, 15, 24, and 36 IU among the catalog strengths).",
        ],
      },
      {
        heading: "IU on the label is inventory",
        paragraphs: [
          "Catalog strengths for HGH 191aa are labeled in IU, not in a secretagogue milligram table. 10, 12, 15, 24, and 36 IU are how much hormone is in the sealed vial. They are not a conversion from tesamorelin milligrams and they are not a fragment mass.[1] The NCBI record is the GH1 gene. The vial is recombinant material built on that 191-residue chain.",
        ],
      },
      {
        heading: "Storage and lot notes",
        paragraphs: [
          "Store sealed lyophilized vials per your protein SOP. Log lot, operator, and COA file so the intact-hormone record stays on every run.",
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
    updatedAt: "2026-09-13",
  },

  "igf-1-lr3": {
    shortDescription: [
      "IGF-1 LR3 is the catalog name for Long R3 IGF-I. Mature IGF-1 is a 70-residue ligand. Long R3 adds a 13-amino-acid N-terminal extension and replaces glutamic acid at position 3 with arginine.[1]",
      "Tetrava Labs supplies this IGF-1 LR3 peptide as a lyophilized reagent among its [research peptides](/). Labs that buy IGF-1 LR3 here get lot-linked HPLC-MS paperwork. Research use only. Not for human or veterinary consumption.",
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
          "Native IGF-1 is the secreted ligand at the type 1 IGF receptor. The [NCBI IGF1 gene record](https://www.ncbi.nlm.nih.gov/gene/3479) is the identity file for that parent protein. Long R3 IGF-I is the analog built on top of it.[1]",
          "The 13-residue N-terminal extension and the Arg3 substitution are why vendors and papers call the material Long R3. Those edits reduce sequestration by IGF-binding proteins in culture, which is why many receptor and IGFBP-competition protocols use Long R3 instead of the 70-residue ligand. Write the analog name into the plate map.",
        ],
      },
      {
        heading: "Is igf-1 lr3 a steroid?",
        paragraphs: [
          "No. igf-1 lr3 is a peptide growth-factor analog. Forum threads still file it next to steroids because both show up in body-composition talk.",
          "A 70- to 83-residue protein analog and a tetracyclic androgen do not share a receptor, a scaffold, or an assay. If the protocol needs an androgen-receptor control, use one.",
        ],
      },
      {
        heading: "What a published IGF-1 assay is asking",
        paragraphs: [
          "The analog shows up in IGF-1 receptor binding, phosphorylation readouts, and IGFBP-competition work because the Arg3 swap and the N-terminal extension change how much ligand stays free of binding proteins.[1]",
          "That is a biochemical identity claim. A culture EC50 from one cell line does not become a catalog schedule. If the method needs native IGF-1 as the reference ligand, order that sequence. If it needs Long R3, match the COA sequence to Long R3.",
        ],
      },
      {
        heading: "igf-1 lr3 vs hGH, and vs semaglutide",
        paragraphs: [
          "[HGH 191aa](/buy-hgh-191aa-online) is a pituitary hormone that acts at the GH receptor. IGF-1 is a downstream ligand. Long R3 IGF-I is a modified form of that ligand. Same axis. Different molecules.",
          "[Semaglutide](/buy-semaglutide-online) is a GLP-1 receptor agonist. Shared metabolic-peptide marketing does not make a growth-factor analog and an incretin analog the same control.",
        ],
      },
      {
        heading: "igf-1 peptide for sale",
        paragraphs: [
          "igf-1 lr3 price is a procurement field. An igf-1 peptide for sale listing without a lot number that matches the vial is a catalog sentence.",
          "Tetrava lists 0.1 mg and 1 mg lyophilized vials. Check the [Certificate of Analysis](/coa-library) for HPLC-MS identity, purity by area-under-curve, and a lot that matches the label. A generic PDF reused across strengths is not that.",
        ],
      },
      {
        heading: "0.1 mg and 1 mg are two stock bottles",
        paragraphs: [
          "The 0.1 mg vial and the 1 mg vial are the same Long R3 sequence at two fill masses.[1] Mature IGF-1 is 70 residues. Long R3 is that chain plus the 13-residue N-terminal extension, which is why some plates call it an 83-residue analog. Receptor-binding and IGFBP-competition plates often want different working concentrations. That is a dilution-math problem.",
        ],
      },
      {
        heading: "Storage and lot notes",
        paragraphs: [
          "Ships lyophilized. Store sealed vials at -20 C. Skip repeated freeze-thaw. Log diluent lot, concentration, date, and operator so the prep still matches the batch COA.",
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
    updatedAt: "2026-09-13",
  },
  "cjc-1295-without-dac": {
    shortDescription: [
      "CJC-1295 without DAC is a modified GHRH(1-29) analog sold without the albumin-binding Drug Affinity Complex. DAC is a linker, not a second receptor. The peptide still targets the GHRH receptor on pituitary somatotrophs.",
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
          "It is a GHRH(1-29) analog. It binds GHRHR. Catalog copy often calls the no-DAC form Mod GRF 1-29. That name is a synonym for the peptide without the maleimide albumin handle.[3]",
          "Unmodified GHRH(1-29) is short-lived in plasma because dipeptidyl peptidase-IV cuts the N terminus. The CJC series started as tetrasubstituted hGRF(1-29) built to slow that cut, then added a C-terminal maleimidopropionamide on lysine so the peptide could lock onto albumin.[1] Strip the maleimide and you still have the modified GHRH fragment. You do not have the albumin bioconjugate Jette named CJC-1295.",
        ],
      },
      {
        heading: "The 8-day half-life does not belong on a no-DAC vial",
        paragraphs: [
          "Teichman 2006 measured a 5.8 to 8.1 day half-life after subcutaneous CJC-1295 in healthy adults. That paper is the DAC analog: mean GH up 2- to 10-fold for 6 days or more, mean IGF-I up 1.5- to 3-fold for 9 to 11 days.[2]",
          "Those numbers do not transfer to cjc-1295 without dac. DAC is the albumin linker. No linker, no 8-day claim.",
        ],
      },
      {
        heading: "Jette 2005 and Teichman 2006 are DAC papers",
        paragraphs: [
          "Jette synthesized maleimido hGRF(1-29) derivatives, conjugated them to albumin at Cys34, and picked CJC-1295 as the tetrasubstituted peptide with an N-epsilon-3-maleimidopropionamide on the C-terminal lysine. In rats it raised GH area-under-the-curve about 4-fold over 2 hours versus hGRF(1-29), stayed detectable in plasma past 72 hours, and showed an albumin-band immunoreactive species from 15 minutes past 24 hours.[1]",
          "Teichman ran two randomized, placebo-controlled, double-blind ascending-dose trials in healthy adults aged 21 to 61, 28 and 49 days, single then weekly or biweekly subcutaneous doses.[2] That design is how the 8-day half-life entered the literature. It is not a bridging study for a no-DAC vial. If the protocol needs the albumin conjugate, order [CJC-1295 with DAC](/cjc-1295-with-dac).",
        ],
      },
      {
        heading: "cjc-1295 with dac vs without dac",
        paragraphs: [
          "Same GHRH-receptor class. Different mass, different CAS, different sampling window. Swap them mid-protocol and you have changed the clearance experiment.",
          "[Ipamorelin](/buy-ipamorelin-online) is a ghrelin-receptor (GHS-R1a) ligand. Sigalos reviews that class separately from GHRH analogs.[3] Pairing no-DAC CJC with ipamorelin is a two-receptor design. Sermorelin is closer chemically: unmodified GHRH(1-29)-NH2, shorter plasma life, same receptor family.",
        ],
      },
      {
        heading: "Buy cjc-1295 no dac",
        paragraphs: [
          "Buy cjc-1295 and the SERP mixes DAC and no-DAC. The vial has to say without DAC, or Mod GRF 1-29. The COA mass has to match the no-linker peptide. Tetrava lists 5 mg and 10 mg lyophilized vials.",
          "Lot on the vial has to match the lot in the [Certificate of Analysis](/coa-library). A purity percentage with no chromatogram is a claim.",
        ],
      },
      {
        heading: "The name CJC-1295 started on the conjugate",
        paragraphs: [
          "Jette used CJC-1295 for the tetrasubstituted peptide plus the maleimide on the C-terminal lysine, the species that locked onto albumin at Cys34.[1] Catalog no-DAC material kept the modified GHRH fragment and dropped that handle. The trade name traveled. The mass did not.",
        ],
      },
      {
        heading: "Storage and lot notes",
        paragraphs: [
          "Ships lyophilized. Store sealed vials at -20 C. Skip repeated freeze-thaw. Log diluent lot, concentration, date, and operator against the batch COA.",
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
    updatedAt: "2026-09-13",
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
          "In rats, that analog raised GH area-under-the-curve about 4-fold over 2 hours versus hGRF(1-29), stayed in plasma beyond 72 hours, and produced an albumin-band immunoreactive species from 15 minutes through more than 24 hours.[1] Without the linker, the catalog item is a different reagent.",
        ],
      },
      {
        heading: "DAC is not a nickname for longer sermorelin",
        paragraphs: [
          "Sermorelin is GHRH(1-29)-NH2. CJC-1295 with DAC is a modified GHRH(1-29) that also carries an albumin-binding handle. Same receptor class. Different clearance.",
          "Teichman 2006 half-life (5.8 to 8.1 days) belongs to the DAC analog.[2] It does not describe [CJC-1295 without DAC](/cjc-1295-without-dac). If a protocol quotes an 8-day window, the vial in the box has to be the conjugate.",
        ],
      },
      {
        heading: "Teichman 2006: the human PK/PD design",
        paragraphs: [
          "Teichman ran two randomized, placebo-controlled, double-blind, ascending-dose trials in healthy adults aged 21 to 61, at two sites, lasting 28 and 49 days. Study one used single subcutaneous doses. Study two used two or three weekly or biweekly doses.[2]",
          "After a single injection, mean plasma GH rose 2- to 10-fold for 6 days or more, and mean IGF-I rose 1.5- to 3-fold for 9 to 11 days. Estimated half-life was 5.8 to 8.1 days. After multiple doses, mean IGF-I stayed above baseline for up to 28 days. No serious adverse reactions were reported in that paper.[2]",
          "Those figures are clinic-arm PK/PD. A cjc-1295 with dac 10mg vial is how much peptide is in the sealed vial. Tetrava lists 5 mg and 10 mg lyophilized strengths.",
        ],
      },
      {
        heading: "cjc-1295 with dac vs without dac",
        paragraphs: [
          "Jette's Western blot and the Teichman half-life are on the DAC side.[1][2] No-DAC (Mod GRF 1-29) is the modified GHRH fragment without the maleimide. Different molecular weight. Different sampling interval.",
          "Ipamorelin sits in a separate class. Sigalos treats growth-hormone secretagogues as GHS-R ligands, not GHRH-receptor analogs.[3] A GHRH-plus-GHS design is two receptors.",
        ],
      },
      {
        heading: "Buy cjc-1295: confirm the conjugate",
        paragraphs: [
          "Buy cjc-1295 and the SERP mixes DAC and no-DAC. The [Certificate of Analysis](/coa-library) has to name the DAC conjugate. Mass and sequence notes should match the albumin-binding analog, not Mod GRF 1-29. A 10 mg label is inventory, not a Teichman clinic dose.",
        ],
      },
      {
        heading: "The albumin band is the identity check",
        paragraphs: [
          "Jette's rat work showed an albumin-band immunoreactive species from 15 minutes through more than 24 hours after the DAC analog went in.[1] If a COA or methods line cannot support that conjugate story, the vial is not the Teichman half-life reagent.",
        ],
      },
      {
        heading: "Storage and lot notes",
        paragraphs: [
          "Ships lyophilized. Store sealed vials at -20 C. Skip repeated freeze-thaw. Log diluent lot, concentration, date, and operator.",
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
    updatedAt: "2026-09-13",
  },
  "kpv": {
    shortDescription: [
      "KPV peptide is Lys-Pro-Val, the C-terminal tripeptide of alpha-melanocyte-stimulating hormone. Bare kpv search results are noisy. Most of them are not this sequence.",
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
          "Cut Lys-Pro-Val off the tail of alpha-MSH and the melanocortin pigmentation story largely drops away. What remains in the Dalmasso work is a short peptide that intestinal epithelial cells and some immune cells take up through PepT1, the di/tripeptide transporter.[1]",
          "PepT1 is normally expressed in small intestine and is induced in colon during inflammatory-bowel-disease models. That is the transport claim.",
        ],
      },
      {
        heading: "Oral vs injection is a PepT1 question",
        paragraphs: [
          "kpv peptide oral vs injection threads treat the search like a capsule-versus-shot list. Dalmasso asked something narrower: can PepT1 carry KPV into Caco2-BBE, HT29-Cl.19A, and Jurkat cells, and does that uptake line up with an anti-inflammatory readout?[1]",
          "This listing is a lyophilized 5 mg or 10 mg vial. A capsule search does not change the sequence. A drinking-water mouse arm is not a human oral protocol.",
        ],
      },
      {
        heading: "Dalmasso 2008: cells, then DSS and TNBS mice",
        paragraphs: [
          "Dalmasso stimulated those epithelial and T-cell lines with proinflammatory cytokines, with or without KPV, and read NF-kappaB luciferase, Western blot, RT-PCR, and ELISA. Uptake used cold KPV as a competitor for a PepT1 substrate, and [3H]KPV for kinetics.[1]",
          "Nanomolar KPV inhibited NF-kappaB and MAP-kinase inflammatory signaling and cut proinflammatory cytokine secretion in that system. The same paper put KPV in drinking water in DSS- and TNBS-induced mouse colitis and reported less histologic inflammation and lower proinflammatory cytokine mRNA.[1]",
          "One Gastroenterology paper: cell lines plus two chemical-colitis models. Research suggests a PepT1-linked anti-inflammatory signal in those assays.",
        ],
      },
      {
        heading: "KPV next to KLOW Blend",
        paragraphs: [
          "[KLOW Blend](/klow-blend) adds KPV on top of BPC-157, TB-500, and GHK-Cu. The single-component vial is for protocols that need Lys-Pro-Val alone, or a clean add-back against a three-peptide baseline.",
          "A four-peak chromatogram and a one-peak chromatogram are different identity checks.",
        ],
      },
      {
        heading: "Is kpv peptide safe, and where to buy",
        paragraphs: [
          "Dalmasso is preclinical: cultured cells and mouse colitis.[1] Tetrava's vial is Research Use Only. There is no patient leaflet.",
          "kpv peptide where to buy: lot on the vial has to match the lot in the [Certificate of Analysis](/coa-library). Sequence consistent with Lys-Pro-Val. A purity percentage with no lot is not a result.",
        ],
      },
      {
        heading: "Why Dalmasso picked DSS and TNBS",
        paragraphs: [
          "PepT1 is induced in colon during inflammatory-bowel-disease models.[1] That is why the same paper that measured uptake in Caco2-BBE, HT29-Cl.19A, and Jurkat cells then put KPV in drinking water in DSS and TNBS colitis. The mouse arms test the transport claim in inflamed colon, not a capsule shopping list.",
        ],
      },
      {
        heading: "Storage and lot notes",
        paragraphs: [
          "Ships lyophilized. Store sealed vials at -20 C. If the assay is a PepT1 uptake or colitis model, pull concentrations and vehicles from the primary paper. Log diluent lot, date, and operator.",
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
    updatedAt: "2026-09-13",
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
        heading: "A four-residue pineal peptide",
        paragraphs: [
          "Ala-Glu-Asp-Gly came out of Vladimir Khavinson's short-peptide program. The 2003 fibroblast paper reports that adding Epithalon to a telomerase-negative human fetal fibroblast culture induced the catalytic subunit, telomerase enzymatic activity, and telomere elongation.[1]",
          "That is one Russian-lab cell series. A proposed reactivation of telomerase in those cultures. It is not a license to call a catalog vial a longevity drug.",
        ],
      },
      {
        heading: "Epitalon vs epithalon, and epitalon and cancer",
        paragraphs: [
          "epitalon vs epithalon is spelling. AEDG either way. If two COAs disagree on mass or sequence, that is a lot problem.",
          "Anisimov's 2003 SHR-mouse paper did not change total spontaneous tumor incidence. It reported a lower leukemia count in the Epitalon group (6.0-fold) in that one colony.[2] Limited, non-Western evidence. Tetrava does not sell this peptide as a cancer therapy.",
        ],
      },
      {
        heading: "Two papers from the same research line",
        paragraphs: [
          "Khavinson, Bondarev, and Butyugov (Bull Exp Biol Med, 2003) used telomerase-negative human fetal fibroblasts. The abstract states induction of the catalytic subunit, enzymatic telomerase activity, and longer telomeres after Epithalon was added to the culture.[1] No independent Western replication is cited on this page.",
          "Anisimov, Khavinson, and colleagues then ran female Swiss-derived SHR mice from 3 months to natural death, 54 mice per group, with a monthly five-day subcutaneous course of Epitalon versus saline. Food intake, body weight, and mean life span did not move. The last 10% of survivors lived 13.3% longer, maximum life span 12.3% longer, bone-marrow chromosome aberrations 17.1% lower, and age-related estrous shutdown was slower.[2]",
          "Those mouse numbers stay in that paper.",
        ],
      },
      {
        heading: "Epitalon vs pinealon",
        paragraphs: [
          "Epithalon is Ala-Glu-Asp-Gly (four residues). [Pinealon](/buy-pinealon-online) is Glu-Asp-Arg (three residues). Same Khavinson tradition. Different peptide.",
          "Pinealon literature is oxidative-stress and neuronal-viability work. Epithalon literature is telomerase and rodent lifespan work.",
        ],
      },
      {
        heading: "Buy epithalon, including the 50 mg vial",
        paragraphs: [
          "Tetrava lists 10 mg, 20 mg, and 50 mg lyophilized vials. epithalon 50mg is a pack size. It is not a published human dose from Khavinson or Anisimov.",
          "Lot on the vial has to match the lot in the [Certificate of Analysis](/coa-library). Sequence should read Ala-Glu-Asp-Gly. A generic 99% PDF with no lot is not a result.",
        ],
      },
      {
        heading: "Mean life span did not move",
        paragraphs: [
          "In the SHR-mouse series, food intake, body weight, and mean life span stayed put. The gains Anisimov reported sat in the last 10% of survivors, maximum life span, chromosome-aberration rate, and slower estrous shutdown.[2] A catalog sentence that says epithalon extends lifespan, full stop, is already wider than that paper.",
        ],
      },
      {
        heading: "Storage and lot notes",
        paragraphs: [
          "Ships lyophilized. Store sealed vials at -20 C. Pull culture concentrations from the primary paper for that model. Log diluent lot, concentration, date, and operator.",
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
    updatedAt: "2026-09-13",
  },
};
