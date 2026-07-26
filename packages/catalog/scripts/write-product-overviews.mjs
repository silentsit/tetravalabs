/**
 * Writes packages/catalog/data/product-overviews.json
 * and copies to storefront generated JSON.
 *
 * Usage: node packages/catalog/scripts/write-product-overviews.mjs
 */
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..", "..", "..")
const outCatalog = path.join(root, "packages", "catalog", "data", "product-overviews.json")
const outStorefront = path.join(
  root,
  "apps",
  "storefront",
  "src",
  "lib",
  "product-overviews.generated.json"
)

/** @type {Record<string, [string, string, string]>} */
const OVERVIEWS = {
  "5-amino-1mq": [
    "Buy {productName} online from Tetrava Labs. 5-Amino-1MQ is a small-molecule NNMT inhibitor researched for metabolic and cellular energy pathways in laboratory models.",
    "Teams typically use it in assays exploring fat metabolism signaling, NAD+-related pathways, and metabolic rate markers under controlled research conditions.",
    "Supplied for qualified laboratory research only — not for human or veterinary consumption."
  ],
  "acetic-acid-water-3ml": [
    "Buy {productName} online from Tetrava Labs. Acetic acid water is a laboratory solvent aid used when protocols call for acidic reconstitution or solution prep of research compounds.",
    "Labs commonly keep it on hand for peptide handling workflows that require a mild acid vehicle alongside sterile technique and documented lot control.",
    "For research use only — not for human or veterinary consumption."
  ],
  "adamax-10mg": [
    "Buy {productName} online from Tetrava Labs. Adamax is an N-acetyl Semax amidate analogue studied in neuropeptide and cognitive-signaling research within the Longevity & Neuropeptides category.",
    "Researchers often use Adamax in models examining neurotrophic pathway activity, CNS peptide stability, and related laboratory assays of brain-signaling peptides.",
    "Supplied as lyophilized powder for stable storage and transport. For research use only — not for human or veterinary consumption."
  ],
  adipotide: [
    "Buy {productName} online from Tetrava Labs. Adipotide is a peptidomimetic research compound investigated for targeted adipose vasculature studies in metabolic research models.",
    "It is commonly used in laboratory work exploring fat-pad blood vessel targeting, body-composition biomarkers, and related metabolic pathway readouts.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "aicar-50mg": [
    "Buy {productName} online from Tetrava Labs. AICAR is an AMPK-pathway activator widely used in metabolic and mitochondrial research to probe cellular energy sensing.",
    "Labs typically deploy AICAR in assays of AMPK activation, exercise-mimetic signaling, glucose uptake markers, and mitochondrial biogenesis models.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "aod-9604": [
    "Buy {productName} online from Tetrava Labs. AOD-9604 is a modified hGH fragment (176–191 region analogue) researched for lipid metabolism and adipose signaling studies.",
    "Researchers commonly use it in fat-metabolism assays, lipolytic pathway models, and comparative work against other metabolic research peptides.",
    "Supplied as lyophilized powder with lot-linked COA documentation when published. For research use only — not for human or veterinary consumption."
  ],
  "ara-290-10mg": [
    "Buy {productName} online from Tetrava Labs. ARA-290 is a non-erythropoietic EPO-derived peptide studied for tissue-protective and innate repair signaling in laboratory models.",
    "It is often used in research on inflammation resolution, nerve and tissue stress responses, and erythropoietin receptor–related pathways without classic erythropoietic endpoints.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "b-12-10mg": [
    "Buy {productName} online from Tetrava Labs. Vitamin B-12 (cobalamin) is supplied as a research reagent for metabolic, methylation, and cofactor studies in controlled laboratory settings.",
    "Teams use B-12 standards in assays of one-carbon metabolism, cellular energy cofactors, and comparative vitamin pathway research.",
    "For research use only — not for human or veterinary consumption."
  ],
  "bacteriostatic-water": [
    "Buy {productName} online from Tetrava Labs. Bacteriostatic water is a sterile diluent with benzyl alcohol preservative, used to reconstitute lyophilized research peptides under lab protocols.",
    "Most peptide workflows keep bacteriostatic water as a standard reconstitution vehicle for multi-use research vials when the study design allows preserved diluent.",
    "Handle aseptically. For research use only — not for human or veterinary consumption."
  ],
  "benzyl-alcohol": [
    "Buy {productName} online from Tetrava Labs. Benzyl alcohol is a laboratory preservative and solvent component used in reconstitution and formulation research.",
    "It is commonly referenced in bacteriostatic diluent prep and peptide solution stability studies that require a documented antimicrobial preservative.",
    "For research use only — not for human or veterinary consumption."
  ],
  "bpc-157": [
    "Buy {productName} online from Tetrava Labs. BPC-157 is a synthetic gastric pentadecapeptide extensively studied in tissue repair, angiogenesis, and musculoskeletal research models.",
    "Laboratories typically use BPC-157 in wound-healing assays, tendon and gut barrier models, and comparative tissue-regeneration pathway work.",
    "Supplied as lyophilized powder with third-party analytical testing where COAs are published. For research use only — not for human or veterinary consumption."
  ],
  "bpc-157-5mg-tb500-5mg-10mg": [
    "Buy {productName} online from Tetrava Labs. This BPC-157 + TB-500 blend combines two widely studied tissue-repair research peptides in a single vial for co-administration study designs.",
    "Researchers often choose this stack when protocols compare dual-pathway repair signaling—angiogenesis and cytoskeletal remodeling—versus single-compound controls.",
    "Supplied as lyophilized blend powder. For research use only — not for human or veterinary consumption."
  ],
  "bpc-157-5mg-tb500-5mg-20mg": [
    "Buy {productName} online from Tetrava Labs. This higher-strength BPC-157 + TB-500 research blend is formulated for labs running denser dual-peptide tissue-repair assays.",
    "It is commonly used when study designs require matched BPC-157 and TB-500 exposure in the same vial to reduce reconstitution variables across replicates.",
    "Supplied as lyophilized blend powder. For research use only — not for human or veterinary consumption."
  ],
  "bpc-157-capsules-100-count-500mcg": [
    "Buy {productName} online from Tetrava Labs. BPC-157 capsules deliver measured 500 mcg research units for oral-route peptide studies and capsule-handling workflows.",
    "Labs use capsule formats when protocols call for dry, unit-dosed research material rather than reconstituted lyophilized powder.",
    "Store cool and dry. For research use only — not for human or veterinary consumption."
  ],
  bremelanotide: [
    "Buy {productName} online from Tetrava Labs. Bremelanotide (PT-141) is a melanocortin receptor agonist peptide researched for MC3/MC4 receptor signaling and related CNS pathway models.",
    "It is frequently studied alongside other melanocortin analogues in receptor-binding, behavioral neuroscience, and pigment-pathway comparative research.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  cagrilintide: [
    "Buy {productName} online from Tetrava Labs. Cagrilintide is a long-acting amylin analogue researched in appetite regulation, gastric emptying, and incretin-adjacent metabolic models.",
    "Metabolic research teams often use cagrilintide in amylin receptor assays and combination studies with GLP-1 pathway compounds.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "cagrilintide-semaglutide": [
    "Buy {productName} online from Tetrava Labs. This cagrilintide + semaglutide research blend pairs an amylin analogue with a GLP-1 receptor agonist for dual-incretin pathway studies.",
    "Labs typically use the combination when protocols compare synergistic metabolic signaling versus monotherapy arms in controlled research settings.",
    "Supplied as lyophilized blend powder. For research use only — not for human or veterinary consumption."
  ],
  "cerebrolysin-10mg": [
    "Buy {productName} online from Tetrava Labs. Cerebrolysin-related peptide material is researched in neurotrophic and neuroprotection models examining brain-derived signaling peptides.",
    "Investigators use it in assays of neuronal survival markers, synaptic plasticity readouts, and comparative CNS peptide research.",
    "For research use only — not for human or veterinary consumption."
  ],
  "cjc-1295-with-dac": [
    "Buy {productName} online from Tetrava Labs. CJC-1295 with DAC is a GHRH analogue engineered for extended half-life research via Drug Affinity Complex albumin binding.",
    "Growth hormone axis labs commonly use DAC-bearing CJC-1295 in sustained GHRH receptor stimulation models and pulsatility comparison studies.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "cjc-1295-without-dac": [
    "Buy {productName} online from Tetrava Labs. CJC-1295 without DAC (Mod GRF 1-29) is a shorter-acting GHRH analogue preferred for pulsatile GH-axis research designs.",
    "Researchers often pair it with GHRPs such as ipamorelin when studying synergistic growth hormone secretagogue signaling in vitro or in vivo models.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "cjc-1295-without-dac-ipamorelin-blend-10mg": [
    "Buy {productName} online from Tetrava Labs. This CJC-1295 (no DAC) + ipamorelin blend is a classic GHRH + GHRP research stack for dual secretagogue pathway studies.",
    "Labs use it when protocols require co-formulated GHRH and ghrelin-mimetic peptides to reduce vial count and reconstitution variance.",
    "Supplied as lyophilized blend powder. For research use only — not for human or veterinary consumption."
  ],
  "cjc-1295-without-dac-sermorelin-ipamorelin-blend-5mg": [
    "Buy {productName} online from Tetrava Labs. This triple blend combines CJC-1295 without DAC, sermorelin, and ipamorelin for multi-ligand GH-axis research.",
    "It is useful when study designs compare layered GHRH analogues plus a GHRP in a single research vial format.",
    "Supplied as lyophilized blend powder. For research use only — not for human or veterinary consumption."
  ],
  "cu-50mg-tb500-10mg-bpc-157-10mg-kpv-10mg-80mg": [
    "Buy {productName} online from Tetrava Labs. This multi-peptide research blend combines GHK-Cu, TB-500, BPC-157, and KPV for integrated tissue-repair and inflammation pathway studies.",
    "Researchers choose multi-compound vials when protocols evaluate complementary repair, copper-peptide, and anti-inflammatory peptide signaling together.",
    "Supplied as lyophilized blend powder. For research use only — not for human or veterinary consumption."
  ],
  "dermorphin-5mg": [
    "Buy {productName} online from Tetrava Labs. Dermorphin is a mu-opioid receptor–selective amphibian peptide used in receptor pharmacology and analgesic pathway research.",
    "It appears in laboratory work on opioid receptor binding, structure–activity comparisons, and CNS peptide signaling models.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "dihexa-10mg": [
    "Buy {productName} online from Tetrava Labs. Dihexa is a small-molecule angiotensin IV analogue researched for cognitive and neurotrophic pathway models.",
    "Labs study Dihexa in assays related to hepatocyte growth factor / c-Met signaling and synaptic plasticity markers under research-only conditions.",
    "For research use only — not for human or veterinary consumption."
  ],
  dsip: [
    "Buy {productName} online from Tetrava Labs. Delta Sleep-Inducing Peptide (DSIP) is a neuropeptide researched in sleep architecture, stress, and neuroendocrine laboratory models.",
    "Investigators commonly use DSIP in assays of sleep-related peptide signaling, hypothalamic pathways, and related CNS peptide studies.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  epithalon: [
    "Buy {productName} online from Tetrava Labs. Epithalon (Epitalon) is a tetrapeptide researched for telomerase activity, pineal signaling, and longevity pathway models.",
    "It is widely used in cellular aging assays, circadian and pineal peptide research, and comparative gerontology peptide studies.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "foxo4-dri-10mg": [
    "Buy {productName} online from Tetrava Labs. FOXO4-DRI is a research peptide designed to disrupt FOXO4–p53 interactions in senescence-focused laboratory models.",
    "Senolytic research teams use it in assays examining senescent cell clearance markers and FOXO4 pathway interference under controlled conditions.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "ghk-cu": [
    "Buy {productName} online from Tetrava Labs. GHK-Cu is a copper-binding tripeptide extensively studied in skin remodeling, wound healing, and gene-expression research.",
    "Laboratories typically use GHK-Cu in collagen and extracellular matrix assays, antioxidant copper-peptide models, and regenerative dermatology research.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "ghrp-2-acetate": [
    "Buy {productName} online from Tetrava Labs. GHRP-2 acetate is a ghrelin receptor agonist peptide used in growth hormone secretagogue and appetite-pathway research.",
    "GH-axis labs commonly compare GHRP-2 with other GHRPs for potency, cortisol co-secretion markers, and synergistic GHRH combinations.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "ghrp-6-acetate": [
    "Buy {productName} online from Tetrava Labs. GHRP-6 acetate is a hexapeptide ghrelin mimetic researched for GH release, hunger signaling, and gastric pathway models.",
    "It is frequently used alongside GHRH analogues when protocols examine dual secretagogue stimulation in laboratory settings.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "glow-bpc-157-tb500-ghk-cu": [
    "Buy {productName} online from Tetrava Labs. Glow Blend combines BPC-157, TB-500, and GHK-Cu—three cornerstone peptides in tissue repair and skin-remodeling research.",
    "Teams use this blend when study designs call for concurrent assessment of repair, actin-sequestering, and copper-peptide pathways from one research vial.",
    "Supplied as lyophilized blend powder. For research use only — not for human or veterinary consumption."
  ],
  "glow-tb500-10mg-bpc-157-10mg-ghk-cu-50mg-70mg": [
    "Buy {productName} online from Tetrava Labs. This Glow Blend strength packs TB-500, BPC-157, and GHK-Cu at research-ready ratios for denser multi-pathway repair assays.",
    "It is popular in laboratory work that wants a single lyophilized blend covering cytoskeletal, angiogenic, and copper-tripeptide research angles.",
    "For research use only — not for human or veterinary consumption."
  ],
  glutathione: [
    "Buy {productName} online from Tetrava Labs. Glutathione is the primary endogenous antioxidant tripeptide used in redox biology, detoxification, and oxidative stress research.",
    "Labs rely on glutathione standards for GSH/GSSG ratio assays, cellular antioxidant capacity studies, and mitochondrial oxidative stress models.",
    "Supplied for laboratory research. For research use only — not for human or veterinary consumption."
  ],
  gonadorelin: [
    "Buy {productName} online from Tetrava Labs. Gonadorelin (GnRH) is the native gonadotropin-releasing hormone peptide used in reproductive axis and pituitary signaling research.",
    "It appears in assays of LH/FSH pathway stimulation, hypothalamic–pituitary models, and comparative GnRH analogue studies.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  hcg: [
    "Buy {productName} online from Tetrava Labs. Human chorionic gonadotropin (HCG) is a glycoprotein hormone researched in reproductive biology, LH-receptor signaling, and endocrine pathway models.",
    "Laboratories use HCG in Leydig cell assays, ovulation-related pathway research, and gonadotropin receptor pharmacology studies.",
    "For research use only — not for human or veterinary consumption."
  ],
  "hexarelin-acetate": [
    "Buy {productName} online from Tetrava Labs. Hexarelin acetate is a potent GHRP researched for growth hormone release, cardiac peptide signaling, and ghrelin receptor pharmacology.",
    "GH-axis teams often include hexarelin when comparing secretagogue potency and receptor selectivity across GHRP scaffolds.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "hgh-191aa": [
    "Buy {productName} online from Tetrava Labs. HGH 191aa is recombinant human growth hormone (somatropin sequence) supplied for GH receptor and somatotropic pathway research.",
    "Researchers use 191-amino-acid HGH in cell proliferation assays, IGF-1 axis models, and metabolic endpoint studies under RUO protocols.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "hmg-75-iu": [
    "Buy {productName} online from Tetrava Labs. Human menopausal gonadotropin (HMG) preparations are researched for combined FSH/LH activity in reproductive endocrinology models.",
    "Labs use HMG in ovarian and spermatogenic pathway assays that require dual gonadotropin receptor stimulation.",
    "For research use only — not for human or veterinary consumption."
  ],
  "humanin-10mg": [
    "Buy {productName} online from Tetrava Labs. Humanin is a mitochondria-derived peptide researched for cytoprotection, metabolic stress resilience, and longevity pathway models.",
    "It is commonly studied in neuronal and metabolic assays examining mitochondrial peptide signaling and stress-response markers.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "igf-1-lr3-0-1mg": [
    "Buy {productName} online from Tetrava Labs. IGF-1 LR3 is a long-acting insulin-like growth factor-1 analogue used in cell growth, differentiation, and IGF receptor research.",
    "This lower-strength presentation suits micro-dosing assay designs and titration studies of IGF pathway activation in vitro.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "igf-1-lr3-1mg": [
    "Buy {productName} online from Tetrava Labs. IGF-1 LR3 (1mg) provides a higher research quantity of the extended half-life IGF-1 analogue for denser growth-factor assays.",
    "Labs use it in muscle cell, metabolic, and IGF-1 receptor signaling models where LR3’s reduced IGFBP binding is experimentally useful.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  ipamorelin: [
    "Buy {productName} online from Tetrava Labs. Ipamorelin is a selective ghrelin receptor agonist prized in GH secretagogue research for a cleaner receptor profile versus older GHRPs.",
    "Researchers frequently pair ipamorelin with CJC-1295 (no DAC) when studying synergistic, pulsatile GH-axis stimulation in laboratory models.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "kisspeptin-10": [
    "Buy {productName} online from Tetrava Labs. Kisspeptin-10 is a KISS1-derived peptide that activates GPR54 and is central to reproductive neuroendocrine research.",
    "It is widely used in studies of GnRH pulse generation, puberty pathway models, and hypothalamic reproductive signaling.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  kpv: [
    "Buy {productName} online from Tetrava Labs. KPV is an alpha-MSH–derived tripeptide researched for anti-inflammatory and epithelial barrier pathway models.",
    "Labs often include KPV in gut and skin inflammation assays, and in blends with tissue-repair peptides for multi-pathway research designs.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "l-carnitine-600mg-10ml": [
    "Buy {productName} online from Tetrava Labs. L-Carnitine research solution supports studies of fatty-acid transport into mitochondria and cellular energy metabolism.",
    "Metabolic labs use L-carnitine reagents in beta-oxidation assays, exercise metabolism models, and mitochondrial substrate studies.",
    "Supplied as a research liquid. For research use only — not for human or veterinary consumption."
  ],
  "l-glu-100mg": [
    "Buy {productName} online from Tetrava Labs. L-glutathione-related research material (L-Glu presentation) supports redox and antioxidant pathway laboratory work.",
    "Investigators use it when protocols require glutathione-pathway reagents for oxidative stress and detoxification assays.",
    "For research use only — not for human or veterinary consumption."
  ],
  "lemon-bottle-10ml": [
    "Buy {productName} online from Tetrava Labs. Lemon Bottle–style research solutions are multi-component metabolic formulations studied in adipose and lipolytic pathway models.",
    "Labs evaluate these blends when comparing cocktail metabolic reagents against single-compound controls in controlled research settings.",
    "For research use only — not for human or veterinary consumption."
  ],
  "lipo-c-10ml": [
    "Buy {productName} online from Tetrava Labs. Lipo-C research solution is a lipotropic blend used in metabolic and hepatic fat-metabolism laboratory models.",
    "It is commonly referenced in studies examining lipotropic micronutrient combinations and related metabolic pathway readouts.",
    "Supplied as a research liquid. For research use only — not for human or veterinary consumption."
  ],
  "ll-37-5mg": [
    "Buy {productName} online from Tetrava Labs. LL-37 is a human cathelicidin antimicrobial peptide researched for innate immunity, host defense, and epithelial barrier models.",
    "Immunology labs use LL-37 in antimicrobial peptide assays, inflammation signaling studies, and wound-microbiome research designs.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  mazdutide: [
    "Buy {productName} online from Tetrava Labs. Mazdutide is a dual GLP-1/glucagon receptor agonist researched in next-generation incretin and energy-expenditure metabolic models.",
    "Metabolic research teams study mazdutide when comparing dual-agonist signaling against single GLP-1 agonists such as semaglutide.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "melanotan-1-10mg": [
    "Buy {productName} online from Tetrava Labs. Melanotan 1 (afamelanotide-related analogue) is a melanocortin peptide researched for MC1R pigmentation pathway models.",
    "Dermatology and pigment research labs use Melanotan 1 in melanogenesis assays and comparative melanocortin receptor studies.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "melanotan-2-10mg": [
    "Buy {productName} online from Tetrava Labs. Melanotan 2 is a cyclic melanocortin analogue studied for broader MC receptor activity, including pigmentation and related CNS pathways.",
    "It is commonly compared with Melanotan 1 and bremelanotide in structure–activity and receptor selectivity research.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "mgf-2mg": [
    "Buy {productName} online from Tetrava Labs. Mechano Growth Factor (MGF / IGF-1 Ec) is researched in muscle repair, satellite cell, and mechanical-load adaptation models.",
    "Exercise physiology labs use MGF in assays of muscle IGF splice variants and localized repair signaling after mechanical stress models.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "mk-677-5mg": [
    "Buy {productName} online from Tetrava Labs. MK-677 (ibutamoren) is an oral ghrelin receptor agonist researched for GH/IGF-1 axis stimulation and metabolic endpoint models.",
    "Unlike injectable GHRPs, MK-677 is studied as a small-molecule secretagogue for sustained GH-axis research designs.",
    "For research use only — not for human or veterinary consumption."
  ],
  "mots-c": [
    "Buy {productName} online from Tetrava Labs. MOTS-c is a mitochondria-encoded peptide researched for metabolic homeostasis, exercise capacity, and insulin-sensitivity pathway models.",
    "Mitochondrial biology labs use MOTS-c in AMPK-related metabolic assays and aging-associated metabolic stress research.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  nad: [
    "Buy {productName} online from Tetrava Labs. NAD+ is a core redox cofactor supplied for cellular energy, sirtuin, and longevity-pathway laboratory research.",
    "Teams use NAD+ reagents in mitochondrial function assays, NAD+/NADH ratio studies, and age-related metabolic models.",
    "For research use only — not for human or veterinary consumption."
  ],
  "oxytocin-acetate": [
    "Buy {productName} online from Tetrava Labs. Oxytocin acetate is the classic social and reproductive neuropeptide used in receptor pharmacology and behavioral neuroscience research.",
    "Labs study oxytocin in bonding, stress, and uterine smooth-muscle pathway models under controlled research protocols.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "peg-mgf-2mg": [
    "Buy {productName} online from Tetrava Labs. PEG-MGF is a PEGylated mechano growth factor analogue researched for extended IGF splice-variant signaling in muscle models.",
    "Researchers choose PEG-MGF when protocols need longer circulating exposure than native MGF for repair and hypertrophy pathway assays.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "pinealon-10mg": [
    "Buy {productName} online from Tetrava Labs. Pinealon is a pineal tripeptide researched for neuroprotection, circadian, and cognitive-aging laboratory models.",
    "It is commonly used in CNS peptide assays examining oxidative stress resilience and pineal bioregulator signaling.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "pinealon-capsules-100-count": [
    "Buy {productName} online from Tetrava Labs. Pinealon capsules provide unit-dosed pineal tripeptide for oral-route bioregulator research workflows.",
    "Capsule formats suit labs that prefer dry, measured research doses without reconstitution steps.",
    "Store cool and dry. For research use only — not for human or veterinary consumption."
  ],
  retatrutide: [
    "Buy {productName} online from Tetrava Labs. Retatrutide is a triple agonist (GLP-1 / GIP / glucagon) researched at the frontier of incretin and energy-balance metabolic science.",
    "Metabolic labs use retatrutide when comparing multi-receptor incretin agonists against dual or single agonists such as tirzepatide and semaglutide.",
    "Supplied as lyophilized powder with lot-linked COAs when published. For research use only — not for human or veterinary consumption."
  ],
  selank: [
    "Buy {productName} online from Tetrava Labs. Selank is a synthetic tuftsin analogue researched for anxiolytic pathway, immune modulation, and cognitive neuropeptide models.",
    "Neuropeptide labs commonly study Selank in stress-axis assays and comparative work with related peptides such as Semax.",
    "Available in research presentations suited to laboratory handling. For research use only — not for human or veterinary consumption."
  ],
  semaglutide: [
    "Buy {productName} online from Tetrava Labs. Semaglutide is a long-acting GLP-1 receptor agonist and a reference compound in incretin, appetite, and glycemic pathway research.",
    "It is widely used as a benchmark GLP-1 agonist when labs compare next-generation dual and triple agonists in metabolic models.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  semax: [
    "Buy {productName} online from Tetrava Labs. Semax is a synthetic ACTH(4-10) analogue researched for nootropic, neurotrophic, and neuroprotective pathway models.",
    "CNS research teams use Semax in assays of BDNF-related signaling, cognitive stress models, and comparative neuropeptide studies with Adamax and Selank.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  sermorelin: [
    "Buy {productName} online from Tetrava Labs. Sermorelin is a GHRH(1-29) analogue used in physiological GH-axis research and pituitary stimulation models.",
    "Labs often compare sermorelin with CJC-1295 variants when studying endogenous GH pulse amplification versus extended GHRH analogues.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "snap-8-10mg": [
    "Buy {productName} online from Tetrava Labs. SNAP-8 is an acetyl octapeptide researched as a topical neuromuscular pathway modulator in cosmetic peptide science.",
    "Dermatology research labs use SNAP-8 in expression-line and SNARE-complex related in vitro models of skin peptide activity.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "ss-31": [
    "Buy {productName} online from Tetrava Labs. SS-31 (elamipretide) is a mitochondria-targeting tetrapeptide researched for cardiolipin interaction and mitochondrial resilience models.",
    "Mitochondrial biology teams use SS-31 in assays of oxidative phosphorylation efficiency, cardiac and neuronal mitochondrial stress, and aging-related bioenergetics.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "survodutide-10mg": [
    "Buy {productName} online from Tetrava Labs. Survodutide is a dual GLP-1/glucagon receptor agonist researched in metabolic disease and energy-expenditure pathway models.",
    "It is studied alongside other dual agonists when labs map glucagon contribution to weight and liver-metabolism research endpoints.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  tb500: [
    "Buy {productName} online from Tetrava Labs. TB-500 (thymosin beta-4 fragment research material) is studied for actin sequestration, cell migration, and tissue repair pathway models.",
    "It is one of the most common companions to BPC-157 in dual-peptide musculoskeletal and soft-tissue research designs.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  tesamorelin: [
    "Buy {productName} online from Tetrava Labs. Tesamorelin is a stabilized GHRH analogue researched for visceral adipose and GH-axis metabolic endpoint models.",
    "GH-axis labs use tesamorelin when protocols require a clinically characterized GHRH analogue scaffold for comparative somatotropic research.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "thymalin-10mg": [
    "Buy {productName} online from Tetrava Labs. Thymalin is a thymic peptide complex researched for immune regulation and T-cell pathway laboratory models.",
    "Immunology teams study thymic peptides like Thymalin in immunosenescence and thymic bioregulator research designs.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "thymosin-alpha-1": [
    "Buy {productName} online from Tetrava Labs. Thymosin alpha-1 is a thymic peptide researched for T-cell maturation, innate immunity, and host-defense pathway models.",
    "It is a staple reagent in immuno-peptide research comparing thymic hormones and related immune-modulating peptides.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  tirzepatide: [
    "Buy {productName} online from Tetrava Labs. Tirzepatide is a dual GIP/GLP-1 receptor agonist and a landmark compound in modern incretin metabolic research.",
    "Labs use tirzepatide as a dual-agonist benchmark when evaluating next-generation multi-incretin peptides such as retatrutide.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ],
  "vip-10mg": [
    "Buy {productName} online from Tetrava Labs. Vasoactive Intestinal Peptide (VIP) is a neuropeptide researched for vasodilation, immune modulation, and circadian pathway models.",
    "Neuroscience and immunology labs use VIP in receptor pharmacology assays spanning G-protein–coupled VIP/PACAP receptors.",
    "Supplied as lyophilized powder. For research use only — not for human or veterinary consumption."
  ]
}

async function run() {
  const handles = Object.keys(OVERVIEWS).sort()
  const missingBuy = handles.filter((h) => !OVERVIEWS[h][0].includes("Buy {productName} online"))
  if (missingBuy.length) {
    throw new Error(`Missing buy phrase in: ${missingBuy.join(", ")}`)
  }

  const payload = {}
  for (const handle of handles) {
    payload[handle] = { paragraphs: OVERVIEWS[handle] }
  }

  await fs.mkdir(path.dirname(outCatalog), { recursive: true })
  await fs.mkdir(path.dirname(outStorefront), { recursive: true })
  const json = `${JSON.stringify(payload, null, 2)}\n`
  await fs.writeFile(outCatalog, json, "utf8")
  await fs.writeFile(outStorefront, json, "utf8")
  console.log(`Wrote ${handles.length} product overviews`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
