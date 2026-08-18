import { type FaqItem, productFaqItems } from "@/lib/faq-content";
import { getCompoundParentHandle } from "@/lib/compound-product";
import {
  buildAutoProductFaqs,
  type ProductFaqContext,
} from "@/lib/product-faq-auto";

/**
 * Hand-curated PDP FAQs: featured top sellers + next sales tier.
 * Other catalog products use buildAutoProductFaqs() (still unique per product).
 */
export const productFaqsByHandle: Record<string, FaqItem[]> = {
  "bpc-157": [
    {
      question: "What is BPC-157 used for in laboratory research?",
      answer:
        "BPC-157 is a synthetic gastric pentadecapeptide studied in tissue repair, angiogenesis, and musculoskeletal research models. Tetrava Labs supplies it as a Research Use Only (RUO) reagent with lot-linked documentation. It's not for human or veterinary use.",
    },
    {
      question: "Where can you buy BPC-157 / buy BPC-157 peptide online?",
      answer:
        "You can buy BPC-157 peptide online from Tetrava Labs. The BPC-157 peptides for sale on this page ship to qualified researchers with lot-linked COA documentation and cold-chain-aware fulfillment. When you're deciding where to buy BPC-157 peptide, the best place to buy BPC-157 publishes third-party HPLC-MS purity for the exact batch you receive, not just a generic catalog claim.",
    },
    {
      question: "Where can I get BPC-157 near me?",
      answer:
        'RUO research peptides like BPC-157 aren\'t stocked at local pharmacies or walk-in clinics, so a "BPC-157 near me" search usually won\'t turn up a retail counter. Tetrava Labs ships BPC-157 peptides for sale directly to qualified laboratories nationwide. Order online on this page for documented research supply instead of a local store pickup.',
    },
    {
      question: "What purity and COA documentation come with BPC-157?",
      answer:
        "Each lot gets verified by independent third-party HPLC-MS analysis. The purity percentage shown on this page is confirmed on the Certificate of Analysis when one is published for that batch. Match the COA batch number to the vial before you start comparative work.",
    },
    {
      question: "Does oral BPC-157 work?",
      answer:
        "In published research, most angiogenesis, tendon-repair, and myotendinous-junction findings used intraperitoneal or local injection routes in animal models. That injectable dataset is bigger than the oral one. Oral BPC-157 has been evaluated in a subset of gastrointestinal-protection models, but there's no validated human oral-bioavailability data, and results shouldn't be read as clinical proof. This is laboratory research context only, not human-use guidance.",
    },
    {
      question: "Can BPC-157 be taken orally?",
      answer:
        "BPC-157 is gastric-juice-derived and often described as relatively acid- and enzyme-stable in preclinical GI literature, so some animal studies do use oral administration. Labs asking whether BPC-157 can be taken orally should treat the oral route as its own experimental variable (stability, vehicle, pharmacokinetics), not a drop-in substitute for injectable protocols. Tetrava Labs supplies RUO research material only. It's not for human or veterinary consumption.",
    },
    {
      question: "How does BPC-157 compare to TB-500?",
      answer:
        "BPC-157 is one defined 15-amino-acid sequence. Material sold as TB-500 is different: mass-spectrometry analysis identified it as a short fragment of thymosin beta-4 (Ac-LKKTETQ, about 888 daltons), not the full 4,963-dalton protein the name suggests. Both compounds are Research Use Only, and both sit on the FDA's 2023 Category 2 significant-safety-risk list. See the BPC-157 vs TB-500 comparison in our research library for the full breakdown.",
    },
    {
      question: "What is the difference between BPC-157 oral and injection routes?",
      answer:
        "The two routes serve different research purposes. Oral or intragastric dosing fits BPC-157's original gastrointestinal research context, since it reaches the luminal mucosa directly. Injection (IP, SC, or IM) is the default in receptor- and growth-factor-signaling studies, because it bypasses the GI tract and delivers a known, controlled dose. Tetrava Labs supplies BPC-157 as an injectable vial and as oral capsules, so the route can match your protocol.",
    },
    {
      question: "How should lyophilized BPC-157 be reconstituted in the lab?",
      answer:
        "Reconstitute under sterile technique with a protocol-appropriate diluent, commonly bacteriostatic water or another vehicle your SOP specifies. Avoid vigorous foaming, record the diluent lot and final concentration in your ELN, and follow your institution's chemical-handling rules. This is laboratory preparation guidance only, not dosing advice.",
    },
    {
      question: "How should I store BPC-157 before and after reconstitution?",
      answer:
        "Store the lyophilized powder at -20°C for long-term stability. Once you reconstitute it, store at 4°C, minimize freeze-thaw cycles, and use it within the window your laboratory protocol defines.",
    },
    {
      question: "How is BPC-157 shipped?",
      answer:
        "Lyophilized BPC-157 ships in temperature-controlled packaging, with cold packs where required. Packages are discreet. Tracking gets emailed once the carrier label is generated. See the Shipping page for regional delivery windows.",
    },
    {
      question: "Is BPC-157 Research Use Only?",
      answer:
        "Yes. Every Tetrava Labs BPC-157 vial is designated Research Use Only. It isn't approved for human consumption, diagnostic use, or therapeutic use. Buyers need to be qualified research professionals.",
    },
    {
      question: "Does Tetrava Labs sell other research peptides besides BPC-157?",
      answer:
        "Yes. The Tetrava Labs catalog includes TB-500 for tissue-repair research and Sermorelin for growth-hormone-secretagogue research, alongside BPC-157. Every product ships with its own lot-linked COA, so you can verify identity and purity batch by batch.",
    },
  ],
  semaglutide: [
    {
      question: "What is semaglutide?",
      answer:
        "A GLP-1 receptor agonist built from native human GLP-1. Novo Nordisk swapped position 2 for Aib so DPP-4 cannot cut it, then hung a C18 fatty diacid off lysine 26 so the peptide binds albumin and lasts about a week instead of a few minutes. Ozempic, Wegovy, and Rybelsus are the approved brand names. Tetrava Labs does not sell those. This page lists a lyophilized Research Use Only reagent, CAS 910463-68-2, in 5 mg and 10 mg research strengths.",
    },
    {
      question: "What does semaglutide do, and how does it work?",
      answer:
        "It activates the GLP-1 receptor. Gastric emptying slows. Glucose-dependent insulin release goes up. Food intake drops through hypothalamic circuits. Glucose-dependent is the useful part: the insulin-release effect fades as blood sugar comes back down, unlike older drugs that force insulin release anyway. Labs keep it as the GLP-1-only reference when a protocol has to separate that signal from dual or triple agonists.",
    },
    {
      question: "Is Ozempic semaglutide? Is semaglutide the same as Ozempic?",
      answer:
        "Yes. Ozempic is a brand name for semaglutide. So are Wegovy and Rybelsus. Same molecule, different products: Ozempic up to 2 mg weekly for type 2 diabetes, Wegovy up to 2.4 mg weekly for chronic weight management, Rybelsus as the oral tablet. Tetrava's listing is none of those. It is a research vial, not a finished drug.",
    },
    {
      question: "What is the semaglutide brand name?",
      answer:
        "Ozempic, Wegovy, and Rybelsus, depending on the product. Semaglutide is the generic name. If a search for \"semaglutide vs Ozempic\" is asking whether they are different molecules, they are not.",
    },
    {
      question: "How much weight loss, and how long does it take for semaglutide to work?",
      answer:
        "STEP 1 ran 68 weeks in adults with obesity or overweight who did not have diabetes. Mean change was -14.9% on semaglutide 2.4 mg versus -2.4% on placebo, or -15.3 kg versus -2.6 kg. 86.4% lost 5% or more of body weight, versus 31.5% on placebo. Half of the semaglutide group lost 15% or more. The mean curve was still falling at week 68. That is a supervised trial of an approved product, not a timeline for this research reagent.",
    },
    {
      question: "What is oral semaglutide, and do semaglutide pills or tablets work?",
      answer:
        "Oral semaglutide is Rybelsus: the peptide co-formulated with SNAC in one tablet. SNAC raises pH next to the dissolving tablet and loosens nearby gastric membrane enough for the peptide to cross before enzymes destroy it. Food or extra water dilutes that local effect, so the approved tablet is taken on an empty stomach with a sip of water. Tetrava does not sell semaglutide tablets. The catalog item is lyophilized powder.",
    },
    {
      question: "What is the difference between semaglutide and tirzepatide?",
      answer:
        "Semaglutide hits GLP-1. Tirzepatide hits GIP and GLP-1. SURMOUNT-5 compared the approved products head-to-head in obesity and found a larger drop in body weight and waist circumference on tirzepatide, at those doses, in that population. For lab work the choice is the receptor question, not a ranking copied from a trial.",
    },
    {
      question: "Is tirzepatide better than semaglutide?",
      answer:
        "In SURMOUNT-5, on weight-loss endpoints, tirzepatide beat semaglutide. That is the published result. It does not make tirzepatide the right reagent if the assay is supposed to isolate GLP-1-only activity. Pick the molecule that matches the receptor the protocol is testing.",
    },
    {
      question: "What are the side effects of semaglutide, and is it safe?",
      answer:
        "STEP 1 reported gastrointestinal events, mainly nausea and diarrhea, in 74.2% on semaglutide versus 47.9% on placebo, mostly mild to moderate and clustered around dose increases. 7.0% quit because of adverse events, versus 3.1%. Gallstones: 1.8% versus 0.6%. Acute pancreatitis: 0.2% versus none. SELECT, a longer cardiovascular trial, had 16.6% permanent discontinuation versus 8.2% on placebo. \"Safe\" is a risk-benefit call in a supervised population. This page does not certify the research vial as a treatment.",
    },
    {
      question: "Does semaglutide cause cancer?",
      answer:
        "The FDA label has a boxed warning for thyroid C-cell tumors from rat and mouse studies. Human relevance, the label says, has not been determined. Personal or family history of medullary thyroid carcinoma, or MEN 2, is a contraindication. There is no clean confirmed human cancer link in the trial literature. There is an animal finding and a boxed warning.",
    },
    {
      question: "Does semaglutide cause hair loss?",
      answer:
        "Alopecia in STEP 1: 3.3% on semaglutide versus 1.0% on placebo. 4.0% of women, 0.9% of men. The pattern that fits is telogen effluvium, a temporary shed after rapid weight loss, which tends to ease once weight stabilizes. Real trial signal. Not something that happened to most participants.",
    },
    {
      question: "Does semaglutide make you tired?",
      answer:
        "Fatigue is not a main finding in STEP 1 or SELECT the way nausea and diarrhea are. There is no strong trial number tying semaglutide to tiredness, either direction.",
    },
    {
      question: "Does semaglutide expire?",
      answer:
        "Lyophilized peptide has a shelf life. It depends on storage temperature and how the vial was handled before it reached you. Read the lot paperwork for the batch in hand. This page does not publish an in-use window for an approved pen, because that is not the product sold here.",
    },
    {
      question: "What to eat on semaglutide?",
      answer:
        "That is a diet question for someone taking an approved drug under a clinician. An RUO listing has nothing useful to say about it.",
    },
    {
      question: "Does compounded semaglutide work?",
      answer:
        "Compounded semaglutide is a pharmacy-made product, often using sodium or acetate salt forms instead of the semaglutide base in Ozempic and Wegovy. FDA said in April 2023 it was not aware of a legal basis for compounding with those salts. Published pharmacokinetics for the salt forms are thin compared with the base compound. Tetrava does not sell a compounded product.",
    },
    {
      question: "Where can I buy compounded semaglutide?",
      answer:
        "Not here. Compounded semaglutide comes from a licensed compounding pharmacy under drug-compounding rules, usually with a prescription. Searches for \"buy semaglutide compound\" and \"where to buy semaglutide compound\" are that category. This page sells a bulk research reagent for laboratory work.",
    },
    {
      question: "Can I buy semaglutide online, and is it safe to buy semaglutide online?",
      answer:
        "You can buy semaglutide online here as a research reagent, for qualified laboratory use. Safety of the purchase is a documentation question: lot-specific Certificate of Analysis, CAS 910463-68-2 matching the vial, HPLC-MS identity, not a PDF recycled across batches. This page is not a route to a prescription, a compounded product, or a personal-use injection.",
    },
    {
      question: "Can you buy semaglutide over the counter?",
      answer:
        "No. Approved semaglutide is prescription-only. There is no OTC version. The RUO vial on this page is a separate category, not an over-the-counter substitute.",
    },
    {
      question: "How do I buy semaglutide, or how do I get it?",
      answer:
        "For treatment: a licensed prescriber and a licensed pharmacy dispensing Ozempic, Wegovy, or Rybelsus. For laboratory work: order the research reagent on this page from a supplier that documents lot identity and purity. Two different purchases. This page is the second one. \"Buy semaglutide prescription online\" is the first path, and Tetrava is not it.",
    },
    {
      question: "Where can I buy semaglutide online?",
      answer:
        "Here, if the order is for a qualified lab: Tetrava Labs ships lyophilized semaglutide with a lot-linked Certificate of Analysis. If the search is for the approved drug, that is a pharmacy and prescription question this page does not answer.",
    },
    {
      question: "What is the best place to buy semaglutide online?",
      answer:
        "For a research reagent, the useful test is paperwork. Lot number on the vial matching the COA. Independent HPLC-MS, not a purity percentage floating without a chromatogram. CAS 910463-68-2 on the label. Price without that is just a cheap undocumented vial.",
    },
    {
      question: "Where can I buy semaglutide in the UK or Canada?",
      answer:
        "Tetrava ships from the United States. Typical windows to the UK, Canada, Australia, and the USA are 2-7 business days, with some regions restricted. Check the Shipping page before you order. Customs and duties sit with the recipient. This listing is a lyophilized research vial, not a pre-filled injection pen.",
    },
    {
      question: "What does semaglutide cost, and where can I buy semaglutide tablets?",
      answer:
        "The price on this page is per research vial, 5 mg or 10 mg depending on the strength you pick. It is not a monthly prescription cost, an insurance copay, or a compounding-pharmacy quote. Tetrava does not sell semaglutide tablets. Rybelsus is the oral product, and it is prescription-only.",
    },
    {
      question: "Can I buy semaglutide for weight loss on this page?",
      answer:
        "No. Searches for \"buy semaglutide for weight loss\" and \"semaglutide weight loss where to buy\" are looking for a treatment. STEP 1 and the Wegovy label are that conversation, under a clinician. Tetrava sells a laboratory reagent. Using it as a substitute for Wegovy is outside the listing and outside the law this page is written under.",
    },
    {
      question: "Where to buy needles for semaglutide?",
      answer:
        "Not on this page. Injection supplies and administration guidance belong to an approved drug under clinical instruction. An RUO catalog does not sell that kit and does not tell you how to use one.",
    },
    {
      question: "How to inject semaglutide, and where to inject it?",
      answer:
        "This page does not give injection technique or injection-site instructions. Those sit on an approved label, with a prescriber. The catalog item is a lyophilized research peptide, reconstituted in a lab, not a weekly injection.",
    },
    {
      question: "How many mg is 40 units of semaglutide, or 50 units?",
      answer:
        "Not published here. Units-to-milligrams depends on the pen or syringe concentration in front of you. Getting it wrong is a dosing-error risk, which is why that conversion belongs with a pharmacist or prescriber, not a research catalog.",
    },
    {
      question: "Where is the semaglutide dosing chart or weight-loss dosage chart?",
      answer:
        "Not on this page. The approved drug's escalation schedule is on its prescribing label. Tetrava sells lyophilized 5 mg and 10 mg research vials with no human dosing schedule attached.",
    },
    {
      question: "Where to buy GLP-1 semaglutide, and is this a semaglutide injection?",
      answer:
        "This page is where to buy GLP-1 semaglutide as a documented research peptide. It is not a finished semaglutide injection. No pen. No pre-filled syringe. Labs reconstitute the lyophilized cake under their own SOP.",
    },
    {
      question: "What purity and COA documentation come with semaglutide?",
      answer:
        "Independent third-party HPLC-MS on each lot. The Certificate of Analysis lists identity and purity for that batch. Match the lot number on the COA to the vial before you start comparative work. A recycled generic PDF is not a lot record.",
    },
    {
      question: "How is semaglutide stored and shipped?",
      answer:
        "Lyophilized vial at -20°C. After reconstitution, skip repeat freeze-thaw and follow the lab SOP for the working solution. Orders ship in cold-chain-aware packaging where the route needs it, tracking emailed after dispatch. Typical delivery to USA, Canada, Australia, and UK is 2-7 business days when the destination is not restricted.",
    },
    {
      question: "Can semaglutide from Tetrava Labs be used in humans?",
      answer:
        "No. Research Use Only. Not for human or veterinary administration, not for compounding into a clinical product, not for diagnostic use.",
    },
  ],
  tirzepatide: [
    {
      question: "What is tirzepatide?",
      answer:
        "Tirzepatide is a synthetic peptide that activates both the GIP receptor and the GLP-1 receptor. In the approved-drug market it is sold under the brand names Mounjaro and Zepbound. On this page, Tetrava Labs lists tirzepatide as a lyophilized Research Use Only reagent for qualified laboratories, not as a consumer drug product.",
    },
    {
      question: "Is tirzepatide a peptide, and is it a GLP-1?",
      answer:
        "Yes, tirzepatide is a peptide. It is also part of the GLP-1 field, but calling it just a GLP-1 leaves out half the mechanism. Tirzepatide is a dual GIP/GLP-1 receptor agonist, which is why labs use it differently from a GLP-1-only comparator like semaglutide.",
    },
    {
      question: "What does tirzepatide do in research settings?",
      answer:
        "Labs use tirzepatide to study dual-incretin signaling, receptor selectivity, and comparative metabolic pharmacology. It often sits in the middle of a comparison set: semaglutide for GLP-1-only activity, tirzepatide for dual GIP/GLP-1 activity, and retatrutide when the study adds glucagon-receptor activity too.",
    },
    {
      question: "How does tirzepatide differ from semaglutide?",
      answer:
        "Semaglutide is a GLP-1 receptor agonist. Tirzepatide activates both GIP and GLP-1. That receptor split is the reason \"tirzepatide vs semaglutide\" keeps showing up in search. In approved-drug trials, tirzepatide outperformed semaglutide on weight-loss endpoints in SURMOUNT-5. On this page, the practical difference is that tirzepatide is the better lab comparator when a protocol needs dual-incretin activity rather than GLP-1 activity alone.",
    },
    {
      question: "Is Zepbound tirzepatide? Is Mounjaro tirzepatide?",
      answer:
        "Yes. Zepbound and Mounjaro both contain tirzepatide. They are approved Lilly products in pen or vial presentations made for prescription use. This Tetrava page is different. It lists a Research Use Only lyophilized reagent for laboratory procurement, not the approved finished product.",
    },
    {
      question: "Can I buy tirzepatide online from this page?",
      answer:
        "You can buy tirzepatide online here as a research reagent if you are ordering for qualified laboratory use. This page is not a route to buy a prescription pen, a compounded pharmacy product, or a personal-use injection. The listing is Research Use Only.",
    },
    {
      question: "Where can I buy tirzepatide legally and safely?",
      answer:
        "That depends on which category you mean. For human treatment, the legal route is a licensed prescriber and a licensed pharmacy supplying the approved drug product. For laboratory work, the safe route is a documented research supplier that publishes a lot-specific Certificate of Analysis, identifies the lot on the vial, and ships the material as a lyophilized reagent with clear RUO terms.",
    },
    {
      question: "What about compounded tirzepatide or tirzepatide compound online?",
      answer:
        "Compounded tirzepatide is not the same thing as a Research Use Only tirzepatide vial. A compounded product comes from a pharmacy under drug-compounding rules. This page does not sell that category. It sells a bulk research reagent for in-vitro and in-vivo laboratory work.",
    },
    {
      question: "Does tirzepatide from Tetrava include a Certificate of Analysis?",
      answer:
        "When a batch COA is published, it documents third-party HPLC-MS purity and identity data for that lot. The check that matters is simple: the batch number on the vial should match the batch number on the COA. If those two numbers do not match, the paperwork is not proving the material in hand.",
    },
    {
      question: "How much is tirzepatide, and what does the price on this page mean?",
      answer:
        "The price shown on this page is the price of a research vial. It is not a monthly treatment cost, not an insurance price, and not a compounding-pharmacy quote. If you are comparing vendors, the better question is not who is cheapest. It is who can prove the lot, purity, and identity of the vial actually being shipped.",
    },
    {
      question: "Does tirzepatide work?",
      answer:
        "The approved-drug literature says tirzepatide works for the indications it was studied for under regulated clinical protocols. That is why Mounjaro and Zepbound exist. This page does not turn those trial results into a claim about personal use of a research vial. It lists tirzepatide for laboratory research on dual-incretin signaling.",
    },
    {
      question: "Is tirzepatide safe, and what side effects are reported?",
      answer:
        "Published safety data comes from the approved-drug trials and labels, not from RUO catalog listings. The main reported adverse events are gastrointestinal, nausea, diarrhea, vomiting, and constipation, often during dose escalation. Questions about hair loss, fatigue, or feeling tired come up often, but they are not the main signal the pivotal obesity trials are built around. This page makes no human safety claim.",
    },
    {
      question: "How should tirzepatide be reconstituted and handled in the lab?",
      answer:
        "Use sterile technique and the diluent your laboratory SOP specifies. Record concentration, operator, diluent lot, and timestamp in the ELN. Handle it as a research chemical under institutional PPE and waste rules. This page does not publish a human-use mixing recipe.",
    },
    {
      question: "What are the storage requirements for tirzepatide?",
      answer:
        "Store sealed lyophilized material at -20 C. After reconstitution, most labs hold working solutions at 4 C and avoid repeat freeze-thaw cycling, but the exact handling window belongs in the validated method for the assay.",
    },
    {
      question: "How is tirzepatide shipped?",
      answer:
        "Lyophilized vials ship with cold-chain-aware packaging where required. Tracking is emailed after dispatch. The Shipping page covers delivery windows and country-specific restrictions.",
    },
    {
      question: "Is this the same thing as tirzepatide 20mg/mL, tirzepatide pills, or a tirzepatide injection pen?",
      answer:
        "No. This page lists fixed-strength lyophilized vials for research. A 20 mg vial is not the same thing as a 20 mg/mL finished solution. Tetrava also does not sell tirzepatide pills or an approved injection pen on this page.",
    },
    {
      question: "How many units is 2.5 mg of tirzepatide, what is the starting dose, and where do you inject it?",
      answer:
        "This page does not provide unit conversions, a starting dose, or injection-site instructions. Those are human-use questions tied to approved labeling or clinical supervision, not to a Research Use Only catalog page.",
    },
  ],
  retatrutide: [
    {
      question: "What is retatrutide?",
      answer:
        "Retatrutide is a synthetic peptide that activates three receptors at once, GLP-1, GIP, and glucagon, developed by Eli Lilly under the code LY3437943. It's the furthest-along \"triple agonist\" peptide in clinical testing, still investigational and not FDA-approved. Tetrava Labs supplies retatrutide as a Research Use Only laboratory reagent, not the drug being tested in clinical trials.",
    },
    {
      question: "What does retatrutide do?",
      answer:
        "It binds GLP-1, GIP, and glucagon receptors in the same molecule. Labs study that combination for insulin secretion, gastric emptying, hepatic fat oxidation, and energy expenditure. Tetrava Labs does not sell it as a treatment.",
    },
    {
      question: "Is retatrutide FDA approved?",
      answer:
        "No. Retatrutide has no FDA approval and no brand name. In July 2026 Lilly said it plans to submit a Biologics License Application in the first quarter of 2027; a planned filing is not an approval. Tetrava Labs' listing is a Research Use Only laboratory reagent.",
    },
    {
      question: "Is retatrutide safe?",
      answer:
        "No FDA safety finding exists, because there is no FDA approval. Trial reports describe mostly mild-to-moderate gastrointestinal events (nausea, diarrhea, vomiting, constipation), often during dose escalation, plus a heart-rate rise that later declined. Those results come from supervised protocols, not from Tetrava Labs' RUO listing.",
    },
    {
      question: "Are mild headaches a known side effect of taking retatrutide?",
      answer:
        "Headache was recorded in the 2023 Phase 2 NEJM trial's less-common events table: 0% on placebo, 11.4% in one 8 mg arm, 6.5% in the 12 mg arm, and 3.3% of participants overall. It was not among the main side effects in that paper, which were gastrointestinal. Those rates are not a safety claim about Tetrava's research reagent.",
    },
    {
      question: "What is retatrutide peptide used for in research?",
      answer:
        "Labs use retatrutide peptide to study triple-receptor incretin signaling, hepatic lipid metabolism, and comparative pharmacology against dual agonists like tirzepatide or single-receptor agonists like semaglutide. Every Tetrava Labs order ships with lot-linked COA documentation. It's not for human or veterinary use.",
    },
    {
      question: "Retatrutide vs tirzepatide: how do they compare?",
      answer:
        "Tirzepatide vs retatrutide comes down to a shared GLP-1/GIP base plus one extra target: retatrutide adds glucagon-receptor activity, tirzepatide doesn't. No trial has run the two head-to-head. Across separate Phase 3 trials, retatrutide's 12 mg arm posted larger mean weight loss (28.3% at 80 weeks) than tirzepatide's highest dose (roughly 22.5% at 72 weeks), but different trials and populations make that a suggestive comparison, not a controlled one. Tirzepatide is FDA-approved (Mounjaro, Zepbound); retatrutide is not approved anywhere.",
    },
    {
      question: "Retatrutide vs semaglutide (Ozempic): what's the difference?",
      answer:
        "Retatrutide vs Ozempic is a triple-agonist-versus-single-agonist comparison. Semaglutide (Ozempic, Wegovy) activates only the GLP-1 receptor; retatrutide adds GIP and glucagon. Semaglutide's Phase 3 program reported up to roughly 14.9% weight loss at 68 weeks, versus 28.3% for retatrutide's 12 mg dose in a separate trial. Semaglutide carries FDA approval and years of prescribing data; retatrutide has neither yet.",
    },
    {
      question: "Where to buy retatrutide, and how do I get it?",
      answer:
        "There is no legal retail or pharmacy channel for human use. The sanctioned treatment path is Lilly's TRIUMPH trials (ClinicalTrials.gov NCT05929066 and NCT05931367). Tetrava Labs sells retatrutide as an RUO laboratory reagent for qualified researchers, not as a personal-use vial.",
    },
    {
      question: "What does retatrutide cost, and is there a price per month?",
      answer:
        "There's no official \"price per month\" for retatrutide, because it isn't a prescription product with a pharmacy price yet. The catalog price shown in the purchase panel on this page reflects the RUO research reagent, per vial, for laboratory use, not a recurring treatment cost.",
    },
    {
      question: "Can I sign up for a retatrutide clinical trial?",
      answer:
        "The only sanctioned way to receive retatrutide as a treatment is through one of Eli Lilly's active TRIUMPH trials. ClinicalTrials.gov lists current enrollment status and eligibility criteria under identifiers including NCT05929066 (TRIUMPH-1) and NCT05931367 (TRIUMPH-4); search those numbers directly on ClinicalTrials.gov for up-to-date openings.",
    },
    {
      question: "What does retatrutide Reddit discussion usually cover?",
      answer:
        "Retatrutide threads split into two camps: people tracking TRIUMPH trial data and cross-posting Lilly's press releases, and people discussing personal sourcing and vendor pricing for unregulated retatrutide, which this page doesn't cover or endorse. Dosing, side-effect, and long-term-effects claims on Reddit mix real trial numbers with unverified self-reports; check whether a claim traces back to a named trial before treating it as fact.",
    },
    {
      question: "How to reconstitute retatrutide, and how much bacteriostatic water for 10 mg?",
      answer:
        "This page does not publish a milliliter-per-vial reconstitution recipe, including for a 10 mg vial. Diluent volume belongs in your laboratory SOP for the assay. Store lyophilized vials at -20°C, reconstitute under sterile technique with a protocol-appropriate diluent, and log lot, date, concentration, and operator against the batch COA. Bacteriostatic water is sold separately as a research solvent, not paired to any retatrutide strength at a fixed volume.",
    },
    {
      question: "What should I check before buying retatrutide from any vendor?",
      answer:
        "Before treating any seller, including Tetrava Labs, as a qualified research supplier: does the listing give a lot/batch number matching the shipped Certificate of Analysis, is that COA from an independent third-party lab reporting HPLC purity, does it confirm identity rather than just a purity percentage, and does the listing describe a laboratory reagent rather than market dosing charts and monthly pricing for human use? Skip any vendor that won't produce a lot-specific COA on request.",
    },
    {
      question: "How is retatrutide purity and identity verified?",
      answer:
        "Each lot is checked by independent third-party HPLC-MS analysis reporting both purity and identity. Match the COA batch number in the COA library to the vial you actually received before starting comparative research work.",
    },
  ],
  "ghk-cu": [
    {
      question: "What is GHK-Cu studied for in research?",
      answer:
        "GHK-Cu (copper tripeptide-1 complex) is examined in skin biology, wound-model, and extracellular-matrix research. Tetrava Labs supplies it as an RUO laboratory reagent with documented purity controls.",
    },
    {
      question: "What purity documentation is provided for GHK-Cu?",
      answer:
        "Batches are analyzed by independent third-party HPLC-MS. When a Certificate of Analysis is published, it lists purity and identity data for that lot — file it with your internal material ID.",
    },
    {
      question: "What GHK-Cu strengths are available?",
      answer:
        "Strength options (for example 50mg / 100mg families where listed) and pack tiers are shown on this page. Choose based on assay volume planning, not ad-hoc mid-study restocking.",
    },
    {
      question: "How should GHK-Cu be stored?",
      answer:
        "Store lyophilized powder at -20°C. After reconstitution per your protocol, hold at 4°C, minimize freeze–thaw cycles, and dispose of unused solution under institutional chemical-waste rules.",
    },
    {
      question: "How is GHK-Cu shipped?",
      answer:
        "Orders ship in temperature-controlled packaging appropriate for lyophilized peptides, with email tracking after dispatch. See the Shipping page for delivery windows by region.",
    },
    {
      question: "Is GHK-Cu from this store for cosmetic or clinical use?",
      answer:
        "No. Catalog GHK-Cu is Research Use Only for qualified laboratory professionals and is not intended for cosmetic, diagnostic, or therapeutic applications.",
    },
  ],
  ipamorelin: [
    {
      question: "What is ipamorelin used for in laboratory research?",
      answer:
        "Ipamorelin is a selective growth hormone secretagogue peptide studied in receptor and endocrine research models. Tetrava Labs provides it strictly as RUO material for qualified labs.",
    },
    {
      question: "How do I confirm ipamorelin identity and purity?",
      answer:
        "Third-party HPLC-MS testing supports lot identity and purity. Review the published COA for the batch you receive and reconcile it against the vial label before comparative assays.",
    },
    {
      question:
        "How should ipamorelin be reconstituted for research protocols?",
      answer:
        "Reconstitute under sterile conditions with the diluent specified in your SOP. Document concentration, diluent lot, and operator in your ELN. This is laboratory preparation guidance only — not a clinical dosing protocol.",
    },
    {
      question: "What are the storage conditions for ipamorelin?",
      answer:
        "Keep lyophilized vials at -20°C. Reconstituted solutions are typically stored at 4°C with limited freeze–thaw cycles according to your method validation.",
    },
    {
      question: "How is ipamorelin shipped?",
      answer:
        "Lyophilized ipamorelin ships with cold packs where required and discreet packaging. Tracking is emailed when the carrier label is created.",
    },
    {
      question: "Can I buy ipamorelin for personal use?",
      answer:
        "No. Sales are limited to Research Use Only procurement for qualified research professionals. The product is not for human consumption or veterinary use.",
    },
  ],
  tb500: [
    {
      question: "What is TB-500 in research catalogs?",
      answer:
        "TB-500 refers to a synthetic thymosin β4 fragment used in tissue-repair and cell-migration research models. Tetrava Labs lists it as Research Use Only with lot-linked analytical documentation when published.",
    },
    {
      question: "How does TB-500 differ from BPC-157 for lab procurement?",
      answer:
        "Both appear in tissue-repair research categories, but they are distinct sequences with different molecular identities. Select based on your assay design and documented CAS/sequence fields — not interchangeable substitutes without a bridging study.",
    },
    {
      question: "What COA data should I expect for TB-500?",
      answer:
        "Independent HPLC-MS analysis supports purity and identity. When a COA is published for your batch, retain HPLC summaries and batch numbers with your ELN records.",
    },
    {
      question: "How should TB-500 be reconstituted and stored?",
      answer:
        "Reconstitute lyophilized powder under sterile technique per your SOP. Store dry material at -20°C; keep reconstituted stocks at 4°C and avoid repeated freeze–thaw cycles.",
    },
    {
      question: "How is TB-500 shipped?",
      answer:
        "Shipments use temperature-controlled packaging where appropriate for lyophilized peptides. Tracking is emailed after dispatch; see Shipping for regional timelines.",
    },
    {
      question: "Is TB-500 approved for human use?",
      answer:
        "No. Tetrava Labs TB-500 is designated Research Use Only and must not be used for human or veterinary administration.",
    },
  ],
  "hgh-191aa": [
    {
      question: "What is HGH 191aa as a research reagent?",
      answer:
        "HGH 191aa refers to recombinant human growth hormone (somatropin) sequence material used in receptor, signaling, and analytical research contexts. Tetrava Labs supplies it under Research Use Only terms for qualified laboratories.",
    },
    {
      question: "How is HGH 191aa purity verified?",
      answer:
        "Lots are evaluated with independent third-party analytical methods appropriate to the catalog item. Review the lot-linked Certificate of Analysis when published for purity and identity confirmation.",
    },
    {
      question: "What IU strengths are available for research HGH 191aa?",
      answer:
        "Available IU strengths and pack options are listed in the purchase panel. Match strength selection to your assay design and inventory controls rather than informal unit conversion mid-study.",
    },
    {
      question: "How should HGH 191aa be stored?",
      answer:
        "Follow the storage guidance on this page and your institutional SOP. Lyophilized material is typically held cold for stability; reconstituted solutions require controlled refrigerated storage and limited freeze–thaw cycling.",
    },
    {
      question: "How is HGH 191aa shipped?",
      answer:
        "Orders ship with temperature-controlled packaging where required. Tracking is emailed when the shipment is labeled. International delivery windows are outlined on the Shipping page.",
    },
    {
      question:
        "Is research HGH 191aa the same as a pharmacy prescription product?",
      answer:
        "No. This listing is a Research Use Only catalog item for laboratory use. It is not a dispensed medication and is not intended for human therapeutic administration.",
    },
  ],

  // --- Next sales tier (curated) ---
  "aod-9604": [
    {
      question: "What is AOD-9604?",
      answer:
        "AOD-9604 is a synthetic 16-amino-acid peptide built from the C-terminal end of human growth hormone, residues 176-191 in the numbering most literature uses (the catalog fields on this page list it as Tyr-hGH(177-191), the same molecule under a different residue count). Researchers also call it Anti-Obesity Drug 9604 or hGH fragment 176-191. Tetrava Labs supplies it as a Research Use Only laboratory reagent, not the discontinued obesity drug Metabolic Pharmaceuticals once developed.",
    },
    {
      question: "Is AOD-9604 a fragment of HGH?",
      answer:
        "Yes. It's the isolated carboxy-terminal stretch of the 191-amino-acid hGH molecule, with an added tyrosine residue at the N-terminus for stability. That's why it's often written as hGH fragment 176-191 or hGH fragment 177-191 depending on the numbering convention used.",
    },
    {
      question: "What is AOD-9604 used for in research?",
      answer:
        "Labs use AOD-9604 to study adipocyte lipolysis, lipogenesis inhibition, and growth-hormone-receptor-independent metabolic signaling, often in comparative work against full-length hGH or other GLP-1 research peptides. Tetrava Labs' listing is a laboratory reagent for qualified researchers, not a supplement or drug product.",
    },
    {
      question: "What is AOD-9604's mechanism of action?",
      answer:
        "The C-terminal region of hGH carries the hormone's lipid-mobilizing activity on its own, separate from the region that drives growth signaling. Published binding assays show AOD-9604 doesn't compete with hGH for the growth hormone receptor and doesn't trigger the receptor dimerization that full hGH does, which is the proposed reason animal studies find fat-metabolism effects without hGH's growth-promoting or insulin-antagonizing activity.",
    },
    {
      question: "What benefits has AOD-9604 shown in research?",
      answer:
        "In obese mice and rats, AOD-9604 reduced cumulative body-weight gain and adipose-tissue mass and increased lipolytic activity in chronic-dosing studies. Human trial data is thinner: a 12-week, 300-subject study found a modest weight-loss signal (2.6 kg vs. 0.8 kg on placebo at 1 mg/day), but the larger 24-week Phase 2b trial that followed didn't reach statistical significance against placebo. See the Description tab above for the full trial history and citations.",
    },
    {
      question: "Is AOD-9604 FDA-approved?",
      answer:
        "No. AOD-9604 has never received FDA approval, or approval from any comparable regulator, for weight loss or any other indication. Metabolic Pharmaceuticals discontinued the obesity development program in 2007 after the 24-week Phase 2b trial missed its primary endpoint. Tetrava Labs sells it strictly as a Research Use Only laboratory reagent.",
    },
    {
      question: "What side effects has AOD-9604 shown in clinical trials?",
      answer:
        "In six published human trials, headache was the most common adverse event, and gastrointestinal effects (diarrhea, flatulence, nausea) showed up more at the highest oral doses tested. Across all six studies, AOD-9604 didn't raise IGF-1 levels, didn't affect glucose tolerance, and didn't trigger antibody formation, unlike full-length hGH. That's trial-reported tolerability data from a supervised clinical program, not a safety claim about unsupervised use of a research reagent.",
    },
    {
      question: "Is there before-and-after data on AOD-9604?",
      answer:
        "Published human data comes from randomized, placebo-controlled group averages, not individual before-and-after case reports. The one dataset showing a statistically meaningful group difference was a 12-week pilot study; the larger, better-powered 24-week trial found no significant difference from placebo. Treat single-person before-and-after claims online as anecdotal, not clinical evidence.",
    },
    {
      question: "How should AOD-9604 be reconstituted, and how is it taken?",
      answer:
        "Tetrava Labs doesn't provide human dosing or administration instructions for AOD-9604. For laboratory use, reconstitute lyophilized powder under sterile technique with a diluent specified by your protocol, and record concentration and operator in your ELN. This is preparation guidance for research settings only.",
    },
    {
      question: "Where can I buy AOD-9604 online, and where can I buy it near me?",
      answer:
        "Tetrava Labs ships AOD-9604 directly to qualified laboratories, so you can buy AOD-9604 online here rather than searching for a local walk-in source; RUO research peptides aren't stocked at retail pharmacies. Each vial ships with lot-linked COA documentation so you can verify identity and purity for the specific batch you receive.",
    },
    {
      question: "Does Tetrava Labs sell AOD-9604 as an oral pill or nasal spray?",
      answer:
        "No. This catalog lists AOD-9604 as a lyophilized vial (5 mg or 10 mg) for reconstitution in laboratory research. Four of the six published human trials did dose AOD-9604 orally as a capsule or tablet, so oral-route data exists in the literature, but no published trial has tested a nasal-spray formulation, and Tetrava Labs doesn't stock oral tablets or a nasal spray for this compound.",
    },
    {
      question: "What purity and COA documentation come with AOD-9604?",
      answer:
        "Each lot is verified by independent third-party HPLC-MS analysis. The purity percentage on this page is confirmed on the Certificate of Analysis when one is published for that batch. Match the COA batch number to the vial label before starting comparative work.",
    },
    {
      question: "Can I buy AOD-9604 in bulk?",
      answer:
        "Yes. The 5 mg and 10 mg strengths on this page are available in multi-vial pack sizes with per-unit savings at higher quantities. Choose the pack size that matches your lab's assay cadence and retention policy.",
    },
    {
      question: "How should AOD-9604 be stored and shipped?",
      answer:
        "Store lyophilized vials at -20°C. After reconstitution, hold working solutions at 4°C with minimal freeze-thaw cycling. Orders ship in cold-chain-aware packaging where required, with tracking emailed after dispatch. See Shipping for regional delivery windows.",
    },
    {
      question: "Is AOD-9604 for human use?",
      answer:
        "No. Catalog AOD-9604 is Research Use Only and must not be used for human or veterinary administration, diagnosis, or treatment.",
    },
  ],
  nad: [
    {
      question: "Is NAD+ a peptide?",
      answer:
        "No. A peptide is a chain of amino acids linked by peptide bonds. NAD+ (nicotinamide adenine dinucleotide) is a dinucleotide: two nucleotides joined by a pyrophosphate bridge, with no amino acid backbone anywhere in it. The \"NAD peptide\" phrasing is a common search shorthand, not an accurate chemical description. Tetrava Labs does carry a genuine peptide studied in the same mitochondrial-research space, MOTS-c, which is a real 16-amino-acid sequence.",
    },
    {
      question: "What is NAD+?",
      answer:
        "NAD+ is nicotinamide adenine dinucleotide, a coenzyme found in every living cell. It's built from an adenine-based nucleotide and a nicotinamide-based nucleotide joined end to end. It cycles between an oxidized form (NAD+) and a reduced form (NADH) as it carries electrons through metabolism. PubChem lists it under CID 5892, CAS 53-84-9.",
    },
    {
      question: "What does NAD+ do, and what is it used for in research?",
      answer:
        "NAD+ keeps glycolysis, the citric acid cycle, and oxidative phosphorylation running as the electron carrier that feeds ATP production. It's also the substrate three separate enzyme families consume: the sirtuins (SIRT1-7), which regulate gene expression; the PARPs, which use it to repair damaged DNA; and CD38, which degrades it into calcium-signaling metabolites. Tetrava Labs supplies NAD+ as a Research Use Only reagent for labs studying that redox and enzyme-substrate biology, not as a consumer wellness product.",
    },
    {
      question: "What does NAD+ peptide research actually cover?",
      answer:
        "Setting the \"peptide\" label aside, published NAD+ research spans several distinct threads: redox biochemistry, sirtuin and PARP enzymology, a 2009 mouse study linking AMPK activation to NAD+-driven mitochondrial biogenesis through SIRT1 and PGC-1α, and a 2012 human-tissue study tracking NAD+ decline with age. None of it is a single unified \"NAD+ research\" finding. Each thread uses a different model system and answers a different question, and the Description tab above cites all four with the original sources.",
    },
    {
      question: "What is NAD+ good for in laboratory settings, and what benefits has it shown?",
      answer:
        "Published human tissue data links declining NAD+ with age to rising PARP activity and falling SIRT1 activity, which researchers use to study cellular aging mechanisms. Separately, a randomized trial of the NAD+ precursor NMN, not NAD+ itself, improved insulin signaling in prediabetic women over 10 weeks. Both are legitimate research findings. Neither is evidence of a benefit from Tetrava's reagent used outside a laboratory setting.",
    },
    {
      question: "Does Tetrava Labs sell NAD+ injections, an IV solution, or a nasal spray?",
      answer:
        "No. This catalog lists NAD+ as a lyophilized vial (100 mg, 500 mg, or 1000 mg) for reconstitution in laboratory research, not a pre-filled injectable, an IV bag, or a nasal spray. Injectable and IV NAD+ sold by wellness clinics are compounded medications prepared under FDA's interim compounding policy, not an FDA-approved product. Tetrava Labs doesn't manufacture, compound, or ship anything in that category.",
    },
    {
      question: "Where can I buy NAD+ online?",
      answer:
        "You can buy NAD+ online directly from Tetrava Labs on this page. Every vial ships to qualified researchers with lot-linked COA documentation confirming identity and HPLC purity for the exact batch received, cold-chain-aware where the strength requires it. This is a laboratory reagent, not a dietary supplement or a wellness-clinic product. It isn't stocked at retail pharmacies or supplement stores.",
    },
    {
      question: "What strengths does Tetrava Labs carry for NAD+?",
      answer:
        "NAD+ is listed in 100 mg, 500 mg, and 1000 mg lyophilized vials, with multi-vial pack sizes available at a per-unit discount. Choose the strength and pack size that match your assay's working-concentration needs and your lab's retention policy. Cross-check the lot COA against the identity fields listed above before starting comparative work.",
    },
    {
      question: "Is NAD+ a dietary supplement I can buy over the counter?",
      answer:
        "It depends which molecule and route you mean. Oral NAD+ precursors like NMN and nicotinamide riboside are sold as dietary supplements under DSHEA, no prescription required. Injectable NAD+ is a different regulatory category: a compounded medication dispensed through 503A/503B pharmacies. FDA's 2019 proposed rule specifically excluded NAD from the list of substances those pharmacies can use without restriction. Tetrava Labs' NAD+ is neither a supplement nor a compounded injectable. It's a Research Use Only laboratory reagent.",
    },
    {
      question: "How much NAD+ should I take?",
      answer:
        "This page doesn't answer that, because no validated human dosing figure exists for NAD+ in the published literature. The best-controlled human trials measure NAD+ precursors (NMN, NR) at defined oral doses, not the intact dinucleotide reconstituted from a vial like this one. Tetrava Labs' listing is a laboratory reagent for qualified researchers, not a product with administration instructions.",
    },
    {
      question: "Is there an NAD+ dosing chart or calculator?",
      answer:
        "No. A dosing chart or calculator implies a validated human dose-response relationship, and that dataset doesn't exist for intact NAD+ in the peer-reviewed literature reviewed for this page. If a site publishes one anyway, ask what trial it's based on. Tetrava Labs won't publish a number it can't source.",
    },
    {
      question: "How do you take or reconstitute NAD+ for research use?",
      answer:
        "Tetrava Labs doesn't provide human administration instructions for NAD+. For laboratory use, reconstitute the lyophilized powder under sterile technique with a protocol-appropriate diluent, protect the solution from light, and record diluent lot, concentration, and reconstitution time in your ELN. NAD+/NADH ratios are sensitive to preparation timing in most redox assays.",
    },
    {
      question: "What side effects has NAD+ shown, including by IV?",
      answer:
        "Published tolerability data comes from IV infusion studies, a route this catalog doesn't sell. A 2026 retrospective study found every NAD+ IV participant reported moderate-to-severe abdominal cramping, nausea, vomiting, elevated heart rate, and chest pressure during infusion, all resolving once the infusion stopped. Average infusion time ran nearly triple that of a comparator NR IV arm because of it. A separate 2024 pilot study found signs of an acute inflammatory response (elevated white blood cell count) in the NAD+ IV group. Neither dataset describes the reconstituted-vial route sold here.",
    },
    {
      question: "Is NAD+ related to MOTS-c, and is MOTS-c a peptide?",
      answer:
        "They're related by research context, not by chemistry. MOTS-c is a genuine 16-amino-acid, mitochondrially encoded peptide. NAD+ is a dinucleotide with no amino acid sequence at all. Both show up in mitochondrial and metabolic-aging research because they sit in overlapping pathways, NAD+ as a cofactor and MOTS-c as an AMPK-activating signal, which is likely why search engines cluster \"NAD peptide research MOTS-c\" together. Tetrava Labs carries both as separate Research Use Only reagents.",
    },
    {
      question: "Is NAD+ FDA-approved?",
      answer:
        "No. NAD+ has no FDA-approved indication in any form. FDA's September 2019 proposed rule reviewed NAD alongside 25 other substances and proposed not to add it to the Section 503A compounding bulks list. FDA has separately warned compounders that food-grade NAD+ isn't suitable for sterile injectable use. Tetrava Labs sells NAD+ strictly as a Research Use Only laboratory reagent, with no dosing, treatment, or anti-aging claims.",
    },
    {
      question: "What's the difference between NAD+ and NAD+ precursors like NMN or NR?",
      answer:
        "NAD+ is the finished coenzyme. NMN and NR are smaller precursor molecules that cells convert into NAD+ through the salvage pathway. Nearly all of the controlled human trial evidence on raising NAD+ levels tests the precursors, largely because NAD+ is a larger, charged molecule that doesn't cross cell membranes as easily. That's why oral NMN/NR research and intact-NAD+ research report different findings, and comparing them directly means tracking which molecule a given study actually dosed.",
    },
    {
      question: "What is \"NAD+ serum\" or \"NAD+ therapy\"?",
      answer:
        "Marketing terms from skincare brands and IV-therapy clinics, not standardized scientific categories. No published trial in the literature reviewed for this page tests a topical serum or transdermal route for NAD+, which tracks with the same membrane-permeability problem that limits injectable and oral use of the intact molecule. Tetrava Labs doesn't sell a topical serum, a patch, or any administered therapy. This catalog page is a lyophilized NAD+ vial for laboratory reconstitution.",
    },
  ],
  "cjc-1295-without-dac": [
    {
      question: "What is CJC-1295 without DAC used for in research?",
      answer:
        "CJC-1295 without DAC (Mod GRF 1-29 analogues) is studied in growth-hormone axis and GHRH-receptor research models. Tetrava Labs lists it strictly as an RUO laboratory reagent.",
    },
    {
      question: "How does “without DAC” matter for lab procurement?",
      answer:
        "Without-DAC and with-DAC catalog families are distinct identities with different pharmacokinetic research framing. Select the handle that matches your protocol — do not treat them as interchangeable without a bridging study.",
    },
    {
      question: "What COA data should I expect for CJC-1295 without DAC?",
      answer:
        "Independent HPLC-MS supports purity and identity. File the published COA with your material ID and confirm the strength on the vial label.",
    },
    {
      question: "How should CJC-1295 without DAC be stored?",
      answer:
        "Keep lyophilized powder at -20°C. Reconstituted stocks are typically stored at 4°C with limited freeze–thaw cycles.",
    },
    {
      question: "How is CJC-1295 without DAC shipped?",
      answer:
        "Lyophilized vials ship with temperature-controlled packaging where required. Tracking is emailed when the shipment is labeled.",
    },
    {
      question: "Is CJC-1295 without DAC Research Use Only?",
      answer:
        "Yes. It is not approved for human consumption, compounding for clinical use, or veterinary administration.",
    },
  ],
  "cjc-1295-with-dac": [
    {
      question: "What is CJC-1295 with DAC in a research catalog?",
      answer:
        "CJC-1295 with DAC is a GHRH-analogue research reagent framed for longer-exposure growth-hormone axis models. Tetrava Labs supplies it under Research Use Only terms.",
    },
    {
      question: "How is CJC-1295 with DAC purity verified?",
      answer:
        "Third-party HPLC-MS testing supports lot identity and purity. Retain the COA with working stocks when published.",
    },
    {
      question: "How should CJC-1295 with DAC be reconstituted?",
      answer:
        "Use sterile technique and a protocol-appropriate diluent. Record preparation details in your ELN. Not a clinical dosing protocol.",
    },
    {
      question: "What are the storage conditions?",
      answer:
        "Lyophilized: -20°C. Reconstituted: typically 4°C with minimal freeze–thaw cycling per SOP.",
    },
    {
      question: "How is it shipped?",
      answer:
        "Cold-chain-aware packaging where required; discreet parcels; email tracking after labeling.",
    },
    {
      question: "Can CJC-1295 with DAC be used in humans?",
      answer:
        "No. This catalog item is Research Use Only for qualified laboratory professionals.",
    },
  ],
  cagrilintide: [
    {
      question: "What is cagrilintide studied for in research settings?",
      answer:
        "Cagrilintide is an amylin-analogue research peptide examined in metabolic and appetite-pathway models. Tetrava Labs offers it as RUO material only.",
    },
    {
      question: "How do I verify cagrilintide identity?",
      answer:
        "Review third-party HPLC-MS data on the lot COA when published, and match batch numbers to the sealed vial.",
    },
    {
      question: "Which strengths are available?",
      answer:
        "Strength and pack options appear in the purchase panel. Choose the configuration that matches assay cadence and retention policy.",
    },
    {
      question: "How should cagrilintide be stored?",
      answer:
        "Store lyophilized powder at -20°C; reconstituted solutions at 4°C with limited freeze–thaw cycles.",
    },
    {
      question: "How is cagrilintide shipped?",
      answer:
        "Temperature-controlled packaging where required, with tracking emailed after dispatch.",
    },
    {
      question: "Is cagrilintide approved for human use?",
      answer: "No. It is designated Research Use Only.",
    },
  ],
  "cagrilintide-semaglutide": [
    {
      question: "What is the cagrilintide + semaglutide blend for research?",
      answer:
        "This catalog blend combines amylin- and GLP-1-pathway research reagents for laboratories running multi-agonist metabolic designs. RUO only — not a clinical combination product.",
    },
    {
      question: "How should blend identity be documented?",
      answer:
        "Treat the blend COA and labeled composition as part of the experimental record. Confirm each component’s strength fields against your protocol before reconstitution.",
    },
    {
      question: "How is the blend reconstituted?",
      answer:
        "Follow sterile technique and your SOP for multi-component lyophilized reagents. Record diluent, concentration targets, and lot IDs in the ELN.",
    },
    {
      question: "Storage guidance?",
      answer:
        "Lyophilized blend vials: -20°C. After reconstitution, refrigerate at 4°C and minimize freeze–thaw cycles.",
    },
    {
      question: "Shipping?",
      answer:
        "Cold-chain-aware packaging where required; tracking emailed when labeled.",
    },
    {
      question: "Is this blend for human consumption?",
      answer: "No. Research Use Only for qualified laboratories.",
    },
  ],
  mazdutide: [
    {
      question: "What is mazdutide peptide?",
      answer:
        "Mazdutide is a synthetic peptide that activates both the GLP-1 receptor and the glucagon receptor, modeled on the gut hormone oxyntomodulin. It's also known by its development codes IBI362 and LY3305677, and by the brand name Xinermei in China, where it's an approved drug. Tetrava Labs supplies mazdutide as a Research Use Only laboratory reagent, not the approved drug product.",
    },
    {
      question: "What is mazdutide peptide used for in research?",
      answer:
        "Labs use mazdutide peptide to study dual GLP-1/glucagon receptor signaling, hepatic fat-oxidation pathways, and comparative incretin research against single-receptor agonists like semaglutide, or other dual and triple agonists like tirzepatide and retatrutide. Tetrava Labs supplies it with lot-linked documentation for qualified laboratory professionals. It's not for human or veterinary use.",
    },
    {
      question: "How does mazdutide compare to tirzepatide?",
      answer:
        "Mazdutide vs tirzepatide comes down to the second receptor each one pairs with GLP-1. Mazdutide adds glucagon receptor activity, which drives hepatic fat oxidation and energy expenditure. Tirzepatide adds GIP receptor activity, which improves insulin sensitivity. No trial has tested the two head-to-head; cross-trial data show comparable glycemic effects and a larger pooled weight-loss effect for tirzepatide.",
    },
    {
      question: "Is mazdutide better than tirzepatide?",
      answer:
        "No published trial has put mazdutide against tirzepatide directly, so \"better\" isn't something the current evidence can answer. Across separate trials and cross-trial meta-analyses, tirzepatide's pooled weight-loss effect has come out larger, while mazdutide has posted the only head-to-head win against semaglutide, a single-receptor GLP-1 drug, reported so far. They're not interchangeable research subjects.",
    },
    {
      question: "How does mazdutide compare to retatrutide?",
      answer:
        "Mazdutide vs retatrutide is a dual-agonist-versus-triple-agonist comparison. Both activate GLP-1 and glucagon receptors; retatrutide adds a third target, GIP. In a 2025 network meta-analysis, retatrutide's pooled weight-loss effect was more than double mazdutide's. Retatrutide remains investigational everywhere, while mazdutide holds two regulatory approvals in China.",
    },
    {
      question: "What benefits has mazdutide peptide research reported?",
      answer:
        "In completed Phase 3 trials, mazdutide has been associated with weight reductions of roughly 15% to 18.5% at higher doses over 48 to 60 weeks, plus improvements in blood pressure, lipids, and serum uric acid. A company-reported head-to-head trial found mazdutide outperformed semaglutide on combined glycemic-and-weight-loss response. These are clinical trial findings in human subjects. They are not claims about Tetrava's research reagent, which is sold strictly for laboratory use.",
    },
    {
      question: "What does mazdutide Reddit discussion usually look like?",
      answer:
        "Because mazdutide's retail availability is limited to China, most English-language Reddit threads about it are analytical: people tracking trial data, comparing it to tirzepatide and retatrutide, or asking about its glucagon-driven mechanism, rather than posting personal-use reports. Treat any anecdotal thread as a lead to verify, not as evidence.",
    },
    {
      question: "Where can you buy mazdutide for qualified research?",
      answer:
        "You can buy mazdutide peptide online from Tetrava Labs. Every order ships to qualified researchers with lot-linked COA documentation confirming identity and HPLC purity for the exact batch received, not a generic catalog claim.",
    },
    {
      question: "Is mazdutide Research Use Only, or is it an approved drug?",
      answer:
        "Both, depending on which product you mean. Mazdutide (brand name Xinermei) is an NMPA-approved drug in China for weight management and type 2 diabetes. It is not FDA-approved. Tetrava Labs' mazdutide listing is a separate, Research Use Only laboratory reagent. It isn't dispensed, prescribed, or described as a medication.",
    },
    {
      question: "How should mazdutide be reconstituted and stored?",
      answer:
        "Store lyophilized vials at -20°C and skip repeated freeze-thaw cycles. Reconstitute under sterile technique with a protocol-appropriate diluent right before use, then log diluent lot, reconstitution date, and operator in your ELN alongside the batch COA.",
    },
    {
      question: "How is mazdutide purity and identity verified?",
      answer:
        "Each lot is checked by independent third-party HPLC-MS analysis reporting both purity and identity. Match the COA batch number in the COA library to the vial you actually received before starting comparative research work.",
    },
  ],
  "bacteriostatic-water": [
    {
      question: "What is bacteriostatic water used for in the lab?",
      answer:
        "Bacteriostatic water is a research solvent commonly used to reconstitute lyophilized peptides under sterile laboratory protocols. RUO catalog item — not a medical product.",
    },
    {
      question: "Does bacteriostatic water have a COA?",
      answer:
        "When a lot document is published, it appears in the COA library and on the product page. Match batch identity to the bottle you received.",
    },
    {
      question: "How should bacteriostatic water be stored?",
      answer:
        "Store sealed per the product specifications, typically at controlled room temperature or as stated on the label/SOP. Record open dates when required.",
    },
    {
      question: "Can I use bacteriostatic water for injections in humans?",
      answer:
        "No. Tetrava Labs bacteriostatic water is sold for laboratory research use only.",
    },
    {
      question: "How is bacteriostatic water shipped?",
      answer:
        "Shipped with appropriate packaging for liquid lab supplies. Tracking is emailed after dispatch.",
    },
    {
      question: "Which volumes are available?",
      answer:
        "Available fill volumes are listed in the purchase options on this page.",
    },
  ],
  selank: [
    {
      question: "What is Selank?",
      answer:
        "Selank is a synthetic heptapeptide, seven amino acids: Thr-Lys-Pro-Arg-Pro-Gly-Pro. It's built from tuftsin, a natural immune-signaling peptide, with a Pro-Gly-Pro tail added for metabolic stability. It was developed at Russia's Institute of Molecular Genetics and is catalogued in PubChem under CID 11765600.",
    },
    {
      question: "What is Selank peptide, and what is it used for?",
      answer:
        "Selank is studied as a candidate anxiolytic and nootropic peptide, with published research covering enkephalin metabolism, GABAergic gene expression, hippocampal BDNF, and immune-cytokine signaling under stress models. Tetrava Labs supplies it as a Research Use Only laboratory reagent, not a consumer wellness product.",
    },
    {
      question: "How does Selank work?",
      answer:
        "The best-supported mechanism is enkephalinase inhibition: Selank blocks the enzymes that break down enkephalin, an endogenous opioid peptide, which extends its signaling time in the blood. A 2016 rodent study also linked Selank to changes in GABAergic gene expression, the same inhibitory-signaling system benzodiazepines target. Both mechanisms come from separate studies, not one unified pathway.",
    },
    {
      question: "What does Selank do, and what does Selank peptide do?",
      answer:
        "In the published research, Selank has been studied for anxiolytic effects comparable to a benzodiazepine in a Russian clinical trial, for its effect on enkephalin half-life, for changes in hippocampal BDNF expression after intranasal dosing in rats, and for shifts in cytokine levels under a rodent stress model. See the Description tab above for the original citations behind each finding.",
    },
    {
      question: "What are Selank's studied benefits?",
      answer:
        "The strongest evidence is a 2008 Russian trial where Selank produced anxiolytic effects comparable to the benzodiazepine medazepam in patients with generalized anxiety disorder, without the antiasthenic gap medazepam left. Separate rodent studies report effects on BDNF expression and GABAergic gene activity. None of that is FDA-reviewed evidence, and none of it describes an outcome from Tetrava's reagent used outside a laboratory.",
    },
    {
      question: "How does Selank compare to Semax, and what does semax and selank do together?",
      answer:
        "Selank and Semax came out of the same Moscow research program and share a stabilizing Pro-Gly-Pro tail, but they're built from different parent molecules. Selank derives from tuftsin and is studied mainly for anxiolytic and immune effects. Semax derives from a fragment of ACTH and is studied mainly for neuroprotective and cerebral-ischemia effects. No published trial tests them administered together, so there's no dosing or interaction data for that combination. Tetrava Labs sells Semax and Selank as separate Research Use Only listings.",
    },
    {
      question: "Selank vs. Semax: which one should a lab use?",
      answer:
        "That depends on the research question, not on which peptide is \"better.\" Selank's literature centers on enkephalin metabolism, GABAergic signaling, and anxiety models. Semax's literature centers on neurotrophic signaling and ischemic-stroke models. They're not interchangeable substitutes for the same assay.",
    },
    {
      question: "How long does it take for Selank to work, and how long does Selank last?",
      answer:
        "The Russian clinical trial ran a 14-day dosing course before assessing outcomes, which is a protocol length, not a measured onset or half-life. No pharmacokinetic study in the literature reviewed for this page publishes a clearance half-life for intact Selank. That gap is part of why some vendors market a separately modified molecule, N-Acetyl Selank Amidate, on stability claims this page can't verify against a peer-reviewed source.",
    },
    {
      question: "How much Selank should I take? Is there a dosing chart?",
      answer:
        "This page doesn't answer that. Tetrava Labs' Selank listing is a lyophilized laboratory reagent for qualified researchers, not a product with human administration instructions, and no dosing chart or calculator here would be sourced from anything more than the single Russian trial's protocol dose.",
    },
    {
      question: "Is Selank safe?",
      answer:
        "The 2008 comparative trial reported anxiolytic effects similar to a benzodiazepine without the antiasthenic and psychostimulant gap medazepam left, and no withdrawal symptoms were described after discontinuation. That's one 62-patient, single-country study without a published placebo arm, not a safety database. It hasn't been reviewed by the FDA.",
    },
    {
      question: "Does Selank cause withdrawal symptoms?",
      answer:
        "The published trial data doesn't describe withdrawal symptoms after Selank discontinuation, unlike the benzodiazepine comparator class it was tested against. That's based on one clinical study, not a body of long-term discontinuation research, so treat it as a preliminary finding rather than a guarantee.",
    },
    {
      question: "What are Selank's side effects?",
      answer:
        "The available trial data reports comparable tolerability to a low-dose benzodiazepine, without the same antiasthenic or sedation profile. Independent Western safety trials haven't been published, and the FDA has not evaluated Selank for safety or efficacy in any indication.",
    },
    {
      question: "Where can I buy Selank online?",
      answer:
        "You can buy Selank directly from Tetrava Labs on this page, in 5 mg or 10 mg lyophilized vials. Every vial ships with lot-linked COA documentation confirming identity and HPLC purity for the exact batch received. This is a laboratory reagent for qualified researchers, not a consumer product.",
    },
    {
      question: "Where can I buy Selank nasal spray, and does Tetrava sell one?",
      answer:
        "Yes. Tetrava Labs lists a finished [Selank nasal spray](/buy-selank-nasal-spray-online) as a separate 10 mg research SKU stored at 2-8°C. This page is lyophilized Selank in 5 mg and 10 mg vials. The spray is not mixed from these vials, and this page does not publish a recipe for compounding a nasal spray from powder.",
    },
    {
      question: "Where can I buy Selank amidate or N-Acetyl Selank Amidate, including 30mg?",
      answer:
        "Tetrava Labs doesn't carry N-Acetyl Selank Amidate. That's a separately modified molecule, with an added N-terminal acetyl group and a C-terminal amide in place of Selank's native free acid, sold by other vendors under stability claims this page can't verify against a peer-reviewed study. Tetrava's catalog lists unmodified Selank in 5 mg and 10 mg vials.",
    },
    {
      question: "Is Selank FDA-approved, and has it gone through FDA review like Semax?",
      answer:
        "No. Selank has no FDA approval and no U.S. drug registration. Russia's Ministry of Health registered it in 2009 for generalized anxiety disorder and neurasthenia. In July 2026, the FDA's Pharmacy Compounding Advisory Committee reviewed seven peptides for the Section 503A Bulks compounding list, and Semax was one of them. Selank was not nominated or reviewed at that meeting, so it currently sits further from any U.S. compounding pathway than its lab-mate.",
    },
    {
      question: "What strengths does Tetrava Labs carry for Selank?",
      answer:
        "Selank is listed in 5 mg and 10 mg lyophilized vials. Choose the strength that matches your assay's working-concentration needs, and check the lot COA against the identity data listed above before starting comparative work.",
    },
    {
      question: "Where's the best place to buy Selank peptide online?",
      answer:
        "Buy directly from a supplier that publishes a lot-linked Certificate of Analysis you can match to the vial in hand, rather than relying on forum recommendations or unverified third-party marketplaces. Tetrava Labs ships Selank with third-party HPLC-verified identity and purity data for every batch.",
    },
    {
      question: "What does Selank Reddit discussion usually look like, and is it reliable?",
      answer:
        "Selank threads on peptide and nootropic forums are mostly first-person mood or focus reports, not measured data. Check whether a poster references an actual third-party COA, whether the vendor they name still lists that lot, and whether the timeline they describe is a subjective impression rather than anything tracked. A thread can point you toward a question worth checking. It isn't clinical evidence.",
    },
    {
      question: "Does Tetrava Labs ship Selank internationally, including to Australia?",
      answer:
        "Shipping depends on destination-specific compliance rules, which can change and which this page won't summarize country by country. Check the current [shipping restrictions](/shipping-restricted) before ordering. Tetrava Labs doesn't make regulatory claims about how any individual country classifies Selank; that determination sits with the buyer's local research institution and regulator.",
    },
  ],
  "selank-nasal-spray-10mg": [
    {
      question: "What is Selank nasal spray?",
      answer:
        "Selank nasal spray is unmodified Selank (Thr-Lys-Pro-Arg-Pro-Gly-Pro) supplied as a finished aqueous research spray. It is the same heptapeptide as lyophilized Selank, in a different format. Tetrava Labs lists a single 10 mg bottle. Research use only.",
    },
    {
      question: "What does Selank nasal spray do?",
      answer:
        "Published work studies enkephalinase inhibition, GABAergic gene-expression changes, hippocampal BDNF after intranasal dosing in rats, and a 2008 Russian anxiety-scale comparison against medazepam. Those papers describe laboratory and clinical-trial endpoints, not an outcome from this research bottle used on a person. See the Description tab for citations.",
    },
    {
      question: "Does Selank nasal spray work?",
      answer:
        "In the 2008 rat study, intranasal Selank changed hippocampal BDNF expression. In the 2008 clinical comparison, Selank scores were comparable to medazepam on anxiety scales in 62 patients. That is the published evidence. It is not FDA-reviewed, and it is not a guarantee for any given assay or for unsupervised use.",
    },
    {
      question: "Does Selank nasal spray need to be refrigerated? How do I store it?",
      answer:
        "Yes. Store at 2-8°C, protected from light, and do not freeze. That is different from lyophilized Selank, which is held dry at -20°C. Log temperature excursions. In-use time after first opening belongs in your laboratory SOP, not a household expiry guess on this page.",
    },
    {
      question: "How long does Selank nasal spray last, and how long until effects?",
      answer:
        "Unopened dating is on the lot COA (manufacture and expiry for the batch you received). No paper reviewed for this page publishes a plasma half-life for intact Selank. The clinical comparison ran 14 days before scoring; that is a protocol length, not an onset clock. This page will not convert rat BDNF timepoints into a human 'how long until effects' number.",
    },
    {
      question: "Selank nasal spray vs injection: which is better?",
      answer:
        "Neither is 'better' as a personal ranking. The registered Russian product is nasal. Injection from reconstituted powder is a different experimental setup with a known volume and concentration. Pick the format that matches the protocol. This SKU is the finished spray; lyophilized Selank is the powder vial.",
    },
    {
      question: "How do I make, mix, prepare, or reconstitute Selank nasal spray?",
      answer:
        "You don't, not from this listing. This is a finished spray. Tetrava Labs will not publish a compounding recipe for how to make Selank nasal spray, how to make Semax and Selank nasal spray, or how to reconstitute Selank powder into a pump bottle. If you need powder, use the [lyophilized Selank](/buy-selank-online) vial and write reconstitution into your SOP.",
    },
    {
      question: "How do I take or use Selank nasal spray? What is the dosage?",
      answer:
        "This page does not answer that. The listing is Research Use Only. There is no human dosing chart, no 'how to take' instructions, and no administration video. Laboratory handling: keep the bottle sealed until use, store at 2-8°C, record lot and operator in the ELN, and follow your institution's chemical-hygiene plan.",
    },
    {
      question: "Where can I buy Selank nasal spray online, including in the UK?",
      answer:
        "You can buy Selank nasal spray online from Tetrava Labs on this page, 10 mg, $79, one bottle. UK and other international shipping depends on destination rules; check [shipping restrictions](/shipping-restricted) before ordering. Checkout is card (Peptide Pay) or crypto. ACH is not a listed payment method on this site.",
    },
    {
      question: "What is the best place to buy Selank nasal spray in 2026?",
      answer:
        "Buy from a supplier that publishes a lot-linked COA matching the bottle in hand, states the format (spray vs powder), and states storage (2-8°C for this spray). Tetrava Labs ships this SKU with third-party HPLC identity and purity data. A 'best place' claim without that paperwork is not a method.",
    },
    {
      question: "Does Tetrava sell Semax and Selank nasal spray together?",
      answer:
        "No combo spray. [Semax](/buy-semax-online) is listed as lyophilized powder. Selank is listed as lyophilized vials and as this finished nasal spray. No published trial tests the two peptides administered together, so there is no joint protocol here.",
    },
    {
      question: "Is Selank nasal spray Research Use Only?",
      answer:
        "Yes. Not for human or veterinary consumption, diagnosis, or therapy. The Russian 0.15% pharmaceutical product is a different, country-specific registered medicine. This catalog item is a laboratory reagent.",
    },
  ],
  semax: [
    {
      question: "What is Semax?",
      answer:
        "Semax is a synthetic heptapeptide, seven amino acids: Met-Glu-His-Phe-Pro-Gly-Pro. It's built from a fragment of adrenocorticotropic hormone, ACTH(4-7), with a Pro-Gly-Pro tail added for stability. It was developed at Russia's Institute of Molecular Genetics and is catalogued in PubChem under CID 9811102.",
    },
    {
      question:
        "What is Semax peptide used for, and what does Semax peptide do?",
      answer:
        "In the published research, Semax has been studied for reducing infarct volume and improving memory-task performance in rat stroke models, for raising BDNF and NGF gene expression in rat hippocampus and cortex, and for functional recovery in a 2018 Russian clinical trial across different stages of ischemic stroke. See the Description tab above for the original citations behind each finding.",
    },
    {
      question: "Does Semax work, and how does Semax work?",
      answer:
        "The mechanistic research points to Semax modulating neurotrophin gene expression, BDNF and NGF specifically, while suppressing inflammatory gene activity and activating neurotransmission-related genes in ischemic brain tissue. Whether that translates to a given research outcome depends on your model and endpoint. The citations above are animal studies plus one Russian clinical trial, not a guarantee for every assay design.",
    },
    {
      question: "What are Semax's studied benefits?",
      answer:
        "The strongest evidence sits in cerebral ischemia models: reduced infarct volume, improved passive-avoidance memory performance, and reproducible BDNF/NGF upregulation across three separate rat studies. A 2018 Russian clinical trial reported efficacy across different stages of ischemic stroke in human patients. None of that is FDA-reviewed evidence for a Research Use Only vial.",
    },
    {
      question: "Semax vs. Selank: what's the difference?",
      answer:
        "Semax and Selank were designed at the same Moscow laboratory and share a Pro-Gly-Pro stability tail, but they're built from different parent molecules. Semax derives from a fragment of ACTH, and its literature centers on neuroprotection and cerebral ischemia. Selank derives from tuftsin, and its literature centers on anxiolytic and immune effects. They're not interchangeable substitutes for the same assay.",
    },
    {
      question:
        "Is there a Semax and Selank dosage chart, or should the two be combined?",
      answer:
        "No published trial in the literature reviewed for this page tests Semax and Selank administered together, so there's no combined dosage chart or interaction data to publish. Tetrava Labs sells them as separate Research Use Only listings with independent citation records.",
    },
    {
      question: "Adamax vs. Semax: what's the difference?",
      answer:
        "Adamax is Tetrava Labs' separate listing for a chemically modified Semax analog, distinct from the unmodified Semax sold on this page. The two aren't the same molecule at different strengths, and this page's citations describe native Semax only. Check the [Adamax](/buy-adamax-online) product page directly for its own identity data.",
    },
    {
      question: "How long does Semax last, and how long does it take to work?",
      answer:
        "No study reviewed for this page publishes a serum half-life for Semax the way a drug label would. What's published is a degradation pathway: a study using isotopically labeled Semax found rat brain tissue breaks it down mainly by clipping residues off both ends, generating shorter fragments as the main byproduct. That's a tissue-culture breakdown map, not a blood-clearance timer, so it doesn't translate into a number of hours or minutes. The animal studies measure outcomes at fixed intervals after dosing, commonly 24 hours post-ischemia for gene-expression readouts, which is a study design choice, not a pharmacokinetic answer either.",
    },
    {
      question: "How much Semax should I inject? Is there a dosing calculator?",
      answer:
        "This page doesn't answer that. Tetrava Labs' Semax listing is a lyophilized laboratory reagent for qualified researchers, not a product with human administration instructions, and a generic dosing calculator here wouldn't be sourced from anything more reliable than a single foreign clinical trial's protocol dose.",
    },
    {
      question:
        "How do I take Semax, or use and make a Semax nasal spray?",
      answer:
        "Tetrava Labs doesn't provide human dosing, injection volumes, or nasal-spray-formulation instructions for Semax. This page lists lyophilized Semax for laboratory reconstitution only. A finished [Selank nasal spray](/buy-selank-nasal-spray-online) is a separate SKU; Tetrava does not currently list a Semax nasal spray.",
    },
    {
      question: "How do you reconstitute 10 mg Semax for lab use?",
      answer:
        "Reconstitute under sterile technique with a diluent your protocol specifies, and record diluent lot, concentration, and reconstitution date in your ELN. This page doesn't publish a milliliter-per-vial recipe or a human dosing volume; that belongs in your laboratory SOP.",
    },
    {
      question: "Is Semax legal in the US?",
      answer:
        "Semax isn't FDA-approved and carries no U.S. drug registration. Russia's Ministry of Health registered it in 1994 for cognitive and optic-nerve indications, with the ischemic-stroke indication added later. In July 2026, the FDA's Pharmacy Compounding Advisory Committee reviewed Semax among seven peptides nominated for the Section 503A Bulks compounding list, an open rulemaking docket, not an approval. Tetrava Labs sells it strictly Research Use Only.",
    },
    {
      question:
        "How do I buy Semax, and where can I buy Semax peptide online?",
      answer:
        "You can buy Semax directly from Tetrava Labs on this page, in 5 mg or 10 mg lyophilized vials, shipped within the USA. Every vial ships with lot-linked COA documentation confirming identity and HPLC purity for the exact batch received.",
    },
    {
      question:
        "Where can I buy Semax nasal spray, and does Tetrava sell one?",
      answer:
        "Tetrava Labs does not list a Semax nasal spray. This page is lyophilized Semax for laboratory reconstitution, with no compounding recipe. A finished [Selank nasal spray](/buy-selank-nasal-spray-online) is a separate SKU.",
    },
    {
      question: "Where to buy Semax amidate, including a 30 mg size?",
      answer:
        "Tetrava doesn't sell a SKU called \"Semax amidate\" or stock a 30 mg vial of any Semax-family compound. Its chemically modified analog ships under the separate Adamax listing, at the strength specified on that product's own page.",
    },
    {
      question:
        "Where can I buy Semax and Selank together, including as a nasal spray?",
      answer:
        "Tetrava Labs sells Semax and Selank as separate Research Use Only listings. Selank has a finished [nasal spray](/buy-selank-nasal-spray-online) SKU; Semax on this page is lyophilized powder. No published trial tests the two peptides combined, so this page can't publish a joint protocol or a mixed spray recipe.",
    },
    {
      question: "What's the best place to buy Semax, or Semax nasal spray?",
      answer:
        "Buy from a supplier that publishes a lot-linked Certificate of Analysis you can match to the vial in hand, rather than relying on forum recommendations or an unverified marketplace listing. Tetrava Labs ships Semax with third-party HPLC-verified identity and purity data for every batch. For a finished spray format, see [Selank nasal spray](/buy-selank-nasal-spray-online); Semax is not listed as a spray.",
    },
    {
      question: "Can I buy Semax with a prescription?",
      answer:
        "Tetrava Labs doesn't operate as a pharmacy and doesn't fill prescriptions. Some U.S. compounding pharmacies dispense Semax-based preparations by prescription under state-specific compounding rules, a separate channel from this catalog's Research Use Only laboratory listing.",
    },
    {
      question:
        "What does Semax discussion on Reddit and r/nootropics usually look like?",
      answer:
        "Semax comes up regularly on r/nootropics and similar forums, mostly as first-person focus or mood reports rather than measured data. Check whether a poster references an actual third-party COA, whether the vendor they name still lists that lot, and whether their timeline is a subjective impression rather than anything tracked. A thread can flag a question worth checking. It isn't clinical evidence.",
    },
    {
      question:
        "Does Semax's research go beyond stroke, into eyes or cognition generally?",
      answer:
        "Yes. The stroke and cerebral-ischemia literature gets the most attention, but a separate controlled trial from 2000 tested Semax in optic-nerve disease, comparing intranasal drops and endonasal electrophoresis against an untreated control group, and reported gains in visual acuity, visual field, and color vision for both treated arms. It's one Russian trial, not a replicated Western study, and it's a different indication than the stroke work most search results lead with.",
    },
    {
      question: "What strengths does Tetrava Labs carry for Semax?",
      answer:
        "Semax is listed in 5 mg and 10 mg lyophilized vials. Choose the strength that matches your assay's working-concentration needs, and check the lot COA against the identity data listed above before starting comparative work.",
    },
    {
      question: "What is Semax used for at a peptide clinic?",
      answer:
        "Peptide clinics offering Semax-based preparations to patients operate through the compounding-pharmacy channel, under a prescription and a specific state's compounding rules, not through a Research Use Only catalog like this one. Tetrava Labs doesn't supply clinics for patient administration; this listing is a laboratory reagent for qualified researchers only.",
    },
    {
      question: "Does Tetrava Labs ship Semax internationally?",
      answer:
        "Shipping depends on destination-specific compliance rules, which can change and which this page won't summarize country by country. Check the current [shipping restrictions](/shipping-restricted) before ordering. Tetrava Labs doesn't make regulatory claims about how any individual country classifies Semax; that determination sits with the buyer's local research institution and regulator.",
    },
  ],
  dsip: [
    {
      question: "What is DSIP?",
      answer:
        "DSIP, Delta Sleep-Inducing Peptide, is a synthetic nonapeptide: Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu. Swiss researchers isolated it from the blood of rabbits during electrically induced sleep and published its full characterization in 1977. Its International Nonproprietary Name, the label the FDA uses in its own review documents, is emideltide.",
    },
    {
      question: "What is DSIP peptide used for, and what does DSIP do?",
      answer:
        "In the published research, DSIP has been studied for its association with delta-wave, slow-wave sleep on EEG, for restoring spatial memory and sleep architecture in a rat high-altitude model, for motor-function recovery after stroke in rats, and in small 1980s human trials for opiate and alcohol withdrawal and chronic pain. See the Description tab above for the original citations behind each finding.",
    },
    {
      question: "How does DSIP work?",
      answer:
        "Honestly, nobody has fully worked that out. A 2006 review by researchers who had studied DSIP for years titled their paper \"a still unresolved riddle,\" because no study has identified a DSIP-specific receptor despite decades of research. What's published are downstream effects: shifts in neurotransmitter levels, hormonal changes, altered locomotor patterns, and modified responses to other drugs, without a settled explanation for what DSIP binds to first.",
    },
    {
      question: "What are DSIP's studied benefits?",
      answer:
        "The evidence spans several separate research threads rather than one confirmed effect. Preclinical studies report improved sleep architecture and spatial memory at simulated high altitude, motor-function recovery after stroke, and a liver-protective signal under restraint stress in rats. Small human trials from the 1980s reported reduced withdrawal symptoms in alcohol and opiate withdrawal and reduced pain in a chronic-pain pilot study. None of this is FDA-reviewed evidence for a Research Use Only vial.",
    },
    {
      question: "What do DSIP's clinical trials show?",
      answer:
        "The human trial record is older than most catalog peptides. A 1983 case series and a 1984 follow-up in European Neurology both tested DSIP against alcohol and opiate withdrawal syndromes. A separate 1984 pilot study tested it in patients with chronic, pronounced pain. These are small, decades-old European studies, not FDA-reviewed trials, and none used the sequence-confirmed reagent grade sold here.",
    },
    {
      question: "Does DSIP have side effects?",
      answer:
        "There's no modern, FDA-reviewed safety profile for DSIP. The published human data comes from small 1980s trials that weren't designed as safety studies in the way a current clinical trial would be. Tetrava Labs' listing is a laboratory reagent for qualified researchers, not a product with a human safety label, and this page won't publish a side-effect list it can't back with current data.",
    },
    {
      question: "How long does DSIP take to work, and how long does it last?",
      answer:
        "No study reviewed for this page publishes a serum half-life or onset time for DSIP that would answer that as a general question. The published trials measure outcomes at study-specific intervals, an EEG reading during a sleep session, a motor-function score days after a stroke model, not a pharmacokinetic clearance curve for the reagent.",
    },
    {
      question:
        "How much DSIP should I inject or take? Is there a dosing calculator or dosing chart?",
      answer:
        "This page doesn't answer that. Tetrava Labs' DSIP listing is a lyophilized laboratory reagent for qualified researchers, not a product with human administration instructions. A generic dosing chart here would only be sourced from small 1980s clinical pilots, which isn't a responsible basis for a public recommendation.",
    },
    {
      question: "When should I take DSIP peptide?",
      answer:
        "Tetrava Labs doesn't provide timing guidance for human use. That's a question for a licensed prescriber operating under a specific compounding pathway, not an RUO catalog listing. This page describes a laboratory reagent only.",
    },
    {
      question: "How do I use or take DSIP peptide?",
      answer:
        "Tetrava Labs doesn't provide human dosing, injection volumes, or administration instructions for DSIP. For laboratory use, reconstitute under sterile technique with a diluent your protocol specifies, and record diluent lot, concentration, and reconstitution date in your ELN.",
    },
    {
      question: "Where do I inject DSIP?",
      answer:
        "This page doesn't cover injection sites or routes. DSIP is sold here as a lyophilized vial for laboratory reconstitution, not as a product with human administration instructions.",
    },
    {
      question: "Is there a DSIP protocol Tetrava Labs recommends?",
      answer:
        "No. Tetrava Labs doesn't publish a research or administration protocol for DSIP. Design your own protocol around your assay's endpoint, your institution's IACUC or IRB requirements, and the published studies cited in the Description tab, not a generic template.",
    },
    {
      question:
        "Does Tetrava Labs sell DSIP nasal spray, or DSIP delta sleep inducing peptide nasal spray?",
      answer:
        "No. Tetrava Labs sells lyophilized DSIP in 5 mg, 10 mg, and 15 mg vials for laboratory reconstitution. It doesn't sell a finished nasal spray product, and this page doesn't provide instructions for compounding one.",
    },
    {
      question: "How do you reconstitute 10 mg DSIP for lab use?",
      answer:
        "Reconstitute under sterile technique with a diluent your protocol specifies, and record diluent lot, concentration, and reconstitution date in your ELN. This page doesn't publish a milliliter-per-vial recipe or a human dosing volume; that belongs in your laboratory SOP.",
    },
    {
      question: "Is DSIP legal in the US?",
      answer:
        "DSIP isn't FDA-approved and carries no U.S. drug registration. In July 2026, the FDA's Pharmacy Compounding Advisory Committee reviewed seven peptides nominated for the Section 503A Bulks compounding list, and DSIP, listed under its INN emideltide, was the only one of the seven the committee voted against, 6 in favor to 7 opposed. That's an advisory vote against inclusion, not a ban, and Tetrava Labs sells DSIP strictly Research Use Only regardless of how the rulemaking resolves.",
    },
    {
      question: "Why did the FDA's committee vote against DSIP specifically?",
      answer:
        "FDA staff briefing documents flagged two specific gaps: no safety data at all for the subcutaneous route DSIP is usually proposed for, and insufficient safety data even for the intravenous route where some exists. Committee members who voted against inclusion also pointed out that DSIP's clearest supporting human study dates to the early 1990s, and that the name has historically covered more than one chemically distinct molecule, which complicates identity testing. None of that changes the status of Tetrava Labs' listing, a Research Use Only reagent regardless of the rulemaking outcome.",
    },
    {
      question: "What strengths does Tetrava Labs carry for DSIP?",
      answer:
        "DSIP is listed in 5 mg, 10 mg, and 15 mg lyophilized vials. Choose the strength that matches your assay's working-concentration needs, and check the lot COA against the identity data listed above before starting comparative work.",
    },
    {
      question:
        "Where can I buy DSIP peptide online, and what's the best place to buy DSIP?",
      answer:
        "You can buy DSIP directly from Tetrava Labs on this page, in 5 mg, 10 mg, or 15 mg lyophilized vials, shipped within the USA. The best place to buy DSIP publishes a lot-linked Certificate of Analysis you can match to the vial in hand, rather than an unverified marketplace listing or a forum recommendation.",
    },
    {
      question:
        "I saw \"DSIP peptide 10mg 99% lab tested\" advertised. How do I check that claim?",
      answer:
        "Ask for the batch-specific Certificate of Analysis, not a generic purity statement. A real COA comes from an independent third-party lab, reports purity by area-under-curve HPLC, and confirms DSIP's nine-residue sequence and molecular weight alongside the percentage. Every Tetrava Labs lot ships with that documentation matched to the batch you receive.",
    },
    {
      question: "Is DSIP the same thing as emideltide?",
      answer:
        "Yes. Emideltide is the International Nonproprietary Name for delta sleep-inducing peptide; it's the label that appears in FDA regulatory documents and PubChem, referring to the identical nine-amino-acid sequence sold on this page as DSIP.",
    },
    {
      question: "Does Tetrava Labs ship DSIP within the USA?",
      answer:
        "Yes, Tetrava Labs ships DSIP to qualified laboratories within the USA with cold-chain-aware fulfillment. Check the current [shipping restrictions](/shipping-restricted) before ordering, since destination-specific compliance rules can change.",
    },
  ],
  epithalon: [
    {
      question: "What is Epithalon (Epitalon) in research catalogs?",
      answer:
        "Epithalon is a synthetic tetrapeptide studied in longevity and pineal-related research models. Tetrava Labs lists it as Research Use Only.",
    },
    {
      question: "How is Epithalon purity verified?",
      answer:
        "Independent HPLC-MS analysis supports identity and purity claims for published lots.",
    },
    {
      question: "Reconstitution guidance for research use?",
      answer:
        "Use sterile technique and a protocol-appropriate diluent. Record preparation parameters in your ELN.",
    },
    {
      question: "Storage?",
      answer:
        "Lyophilized powder at -20°C; reconstituted solutions at 4°C with limited freeze–thaw cycling.",
    },
    {
      question: "How is Epithalon shipped?",
      answer:
        "Temperature-controlled packaging where required; email tracking when labeled.",
    },
    {
      question: "Can Epithalon be used clinically?",
      answer: "No. This catalog item is RUO only.",
    },
  ],
  "mots-c": [
    {
      question: "What is MOTS-c peptide?",
      answer:
        "MOTS-c is a 16-amino-acid peptide encoded inside the mitochondrial genome, not nuclear DNA, discovered by Lee and colleagues at USC in 2015. It activates AMPK, the cell's energy-sensing switch, by inhibiting the folate cycle and letting the metabolite AICAR build up. Tetrava Labs supplies it as a Research Use Only laboratory reagent, not a human or veterinary product.",
    },
    {
      question: "What is MOTS-c peptide used for in research?",
      answer:
        "Labs use MOTS-c to study AMPK-linked metabolic signaling, skeletal-muscle exercise adaptation, and insulin-sensitivity pathways in cell and animal models. It's frequently run alongside a folate-cycle or AICAR-pathway comparator to confirm the mechanism, and alongside other mitochondrial-research compounds like SS-31 in comparative designs.",
    },
    {
      question: "How does MOTS-c compare to SS-31?",
      answer:
        "MOTS-c vs SS-31 comes down to mechanism and evidence tier. MOTS-c is a signaling peptide that activates AMPK from inside the nucleus; SS-31 (elamipretide) is a synthetic tetrapeptide that binds cardiolipin to stabilize the electron transport chain directly. SS-31 has been through human Phase 3 trials, with an FDA-approved indication for Barth syndrome and a missed endpoint in a separate mitochondrial-myopathy trial. MOTS-c has mouse pharmacology data and small human observational studies, not a human trial program.",
    },
    {
      question: "What benefits has MOTS-c peptide research reported?",
      answer:
        "In mice, MOTS-c treatment has been associated with reversal of diet-induced obesity and age-related insulin resistance, and with roughly doubled treadmill endurance in middle-aged and old animals. In a small human study, a single bout of cycling raised endogenous MOTS-c protein about 11.9-fold in skeletal muscle. These are published findings in animal models and one human observational study, not claims about Tetrava's research reagent.",
    },
    {
      question: "What does MOTS-c Reddit discussion usually look like?",
      answer:
        "r/Peptides has an active MOTS-c thread culture built mostly around dosage questions and stacking it with SS-31 or other metabolic peptides. Most posts are anecdotal self-report rather than sourced to a study, though the Lee 2015 and Reynolds 2021 papers get cited secondhand fairly often.",
    },
    {
      question: "Is MOTS-c dosage discussion on Reddit reliable?",
      answer:
        "Treat it as a lead, not a source. The published dosing that exists is a mouse mg/kg figure from animal studies, and that doesn't convert to a human number by simple arithmetic. This page doesn't offer that conversion, and a forum post presenting one as settled fact usually isn't citing anything peer-reviewed.",
    },
    {
      question: "What's the best time to take MOTS-c in a research protocol?",
      answer:
        "There's no established human dosing schedule to answer that with, since MOTS-c isn't an approved product. What the literature describes is timing relative to exercise: in the human study, MOTS-c rose during and after a cycling bout and returned near baseline after four hours. Protocols involving exercise-adjacent sampling should anchor collection timepoints to the exercise bout itself, not a fixed clock time.",
    },
    {
      question: "Where can you buy MOTS-c for qualified research?",
      answer:
        "You can buy MOTS-c peptide online from Tetrava Labs. Every order ships to qualified researchers with lot-linked COA documentation confirming identity and HPLC purity for the exact batch received, not a generic catalog claim.",
    },
    {
      question: "Is MOTS-c Research Use Only?",
      answer:
        "Yes. MOTS-c has no FDA-approved human or veterinary indication. Tetrava Labs' listing is strictly a Research Use Only laboratory reagent, not for human or veterinary consumption.",
    },
    {
      question: "Where do you inject MOTS-c, and how do you take it?",
      answer:
        "This page doesn't cover injection sites or self-administration, because Tetrava Labs doesn't sell MOTS-c for human use. Every listing here is a Research Use Only laboratory reagent for cell and animal research models, not a product with a human route of administration.",
    },
    {
      question: "How do you dose MOTS-c, and how much should you inject?",
      answer:
        "There's no approved human dose to answer that with, since MOTS-c has no FDA-approved indication. The dosing that exists in the literature is a mouse mg/kg figure from animal pharmacology studies (15 mg/kg), and it doesn't convert to a human dose or an injection volume by simple arithmetic. Tetrava Labs doesn't publish that conversion.",
    },
    {
      question: "How long does it take for MOTS-c to work?",
      answer:
        "There's no human onset-of-effect timeline to cite, since MOTS-c isn't an approved product. The published kinetics come from a 2021 human trial: MOTS-c protein rose sharply during and immediately after a bout of cycling, then drifted back toward baseline within about four hours. That describes an exercise-linked signal, not how long a dose takes to work in a person.",
    },
    {
      question: "How do you reconstitute MOTS-c, including a 10mg vial?",
      answer:
        "Diluent volume for a specific vial size is a laboratory protocol choice, not a catalog constant, so this page doesn't publish a fixed mL amount for the 10mg vial or any other strength. Tetrava Labs ships MOTS-c as a lyophilized powder: store sealed vials at -20°C, skip repeated freeze-thaw cycles, and reconstitute under sterile technique with a protocol-appropriate diluent right before use, per your lab's SOP. Bacteriostatic water is listed separately as a research solvent. It isn't paired to any MOTS-c SKU at a fixed milliliter amount.",
    },
    {
      question: "How is MOTS-c purity and identity verified?",
      answer:
        "Each lot is checked by independent third-party HPLC-MS analysis reporting both purity and identity. Match the COA batch number in the COA library to the vial you actually received before starting comparative research work.",
    },
  ],
  "pinealon-10mg": [
    {
      question: "What is Pinealon peptide / what is Pinealon used for?",
      answer:
        "Pinealon is a synthetic tripeptide. Sequence: Glu-Asp-Arg, EDR for short. Researchers at the Saint Petersburg Institute of Bioregulation and Gerontology found the sequence inside Cortexin, a brain-cortex extract, then synthesized it on its own. Tetrava Labs sells it as a lyophilized Research Use Only reagent for CNS and oxidative-stress lab work. Not a supplement. Not a drug. Not used for anything outside a laboratory.",
    },
    {
      question: "Is Pinealon a bioregulator, and what does that mean?",
      answer:
        "Yes, that's the research classification Khavinson's group gave it: a short peptide, under eight amino acids, proposed to act on gene expression in a specific tissue rather than through a surface receptor. It's a lab term, not a government-approved category. No agency licenses or defines a product class called \"bioregulator.\"",
    },
    {
      question: "What does Pinealon do, and what does Pinealon peptide do?",
      answer:
        "In cell-culture work, a 100 nanomolar dose blocked ouabain-induced free-radical buildup completely, and 500 nanomolar did the same against homocysteine-induced oxidative stress, in rat cerebellar granule cells. Separate rodent studies report protection against prenatal hyperhomocysteinemia and changes in cytokine and caspase-3 levels under hypoxic stress. All preclinical. Tetrava Labs doesn't claim any of it translates to a person.",
    },
    {
      question: "Pinealon peptide: what is it, benefits, and mechanism?",
      answer:
        "The leading hypothesis says short peptides like Pinealon bind gene-promoter DNA and adjust transcription from inside the nucleus, instead of signaling through a surface receptor. Fluorescence and computational-docking data support that idea. A structural study actually showing the bound complex doesn't exist yet. \"Benefit\" stays inside the cell-culture and rodent literature; there's no human trial behind it.",
    },
    {
      question: "Pinealon peptide: what is it, benefits, and side effects?",
      answer:
        "Check the Description tab for what the published research actually covers. On side effects, there isn't published human safety data, so there's no list to give and none worth guessing at. That absence is itself worth weighing before you trust a summary elsewhere that states one anyway.",
    },
    {
      question: "What is Pinealon peptide used for in research, specifically?",
      answer:
        "Oxidative-stress work in cerebellar granule cells, neutrophils, and PC12 cells. Cognitive-aging and CNS gene-expression assays. A couple of rodent hypoxia and prenatal-stress studies. That's the current published scope, not a wider claim.",
    },
    {
      question: "What does Pinealon do for sleep, and is Pinealon good for sleep?",
      answer:
        "Nothing published ties it to sleep architecture, sleep onset, or melatonin signaling. The pineal-gland framing gets it lumped in with sleep compounds on forums, but the actual papers are about oxidative stress and cortical gene expression, a different question entirely.",
    },
    {
      question: "Pinealon vs Epitalon: what's the difference?",
      answer:
        "Different molecules, same research program. Pinealon is the tripeptide Glu-Asp-Arg. Epitalon is the tetrapeptide Ala-Glu-Asp-Gly. Epitalon's literature is telomerase activity and rodent lifespan. Pinealon's is oxidative stress and neuronal viability. Both trace back to Vladimir Khavinson's lab and both get filed under pineal peptides, but they don't share a sequence, a mechanism paper, or an evidence base you can swap between them.",
    },
    {
      question: "Is there a Pinealon peptide dosage, dosage chart, or protocol?",
      answer:
        "No, on purpose. Pinealon is a laboratory reagent, not a product with a human dosing schedule. Published protocols specify nanomolar concentrations for cell assays and milligram-per-kilogram doses scaled to rat body weight, not a milligram-per-day number for a person. Pull the concentration and exposure time from the primary paper for your own model.",
    },
    {
      question: "When to take Pinealon, or when to take Pinealon peptide?",
      answer:
        "That's a human-administration question this listing doesn't answer. Published timing is relative to an experimental stressor, a hypoxic challenge or an induced metabolic condition, not a daily schedule for a person. Tetrava Labs sells Pinealon strictly for laboratory research.",
    },
    {
      question: "What are Pinealon's side effects, and is it safe?",
      answer:
        "No published human trial has looked at Pinealon's safety profile. There's no side-effect data to report and no safety claim to make. A list you find elsewhere describing human side effects is unsourced until it points to an actual study.",
    },
    {
      question: "Where can I buy Pinealon, or buy Pinealon peptide online?",
      answer:
        "Right here. Tetrava Labs ships Pinealon peptide to qualified researchers with a lot-linked Certificate of Analysis and cold-chain-aware packaging. Pinealon capsules are also available for an oral-route research design instead of a reconstituted vial.",
    },
    {
      question: "Pinealon: buy, purchase, or where to get it?",
      answer:
        "Tetrava Labs sells Pinealon directly through this page, not through a distributor or a marketplace listing. Order the vial or the capsule format, and a lot-linked COA ships with it.",
    },
    {
      question: "What's the best place to buy Pinealon peptide, or the best place to buy Pinealon peptide in 2026?",
      answer:
        "Look for a lot-specific Certificate of Analysis with independent HPLC-MS purity data, not a generic PDF reused across batches. Cold-chain-aware shipping and a CAS number (175175-23-2) that matches the vial label are the other two things worth confirming before you order from anyone.",
    },
    {
      question: "Is Pinealon 20mg, 99% pure, lab-tested?",
      answer:
        "This page sells a 10mg vial, not a 20mg one. Whatever the strength, \"99% pure, lab-tested\" only means something if you can match that number to a lot-specific COA from an independent lab. A percentage with no matching batch report is a marketing line, not documentation.",
    },
    {
      question: "Buy Pinealon for sale, buy Pinealon research peptide, or buy Pinealon capsules?",
      answer:
        "This page lists Pinealon 10mg as a lyophilized vial. If your protocol calls for an oral-route reagent, Tetrava Labs also carries Pinealon capsules, documented the same way with its own lot-linked COA.",
    },
    {
      question: "Buy Pinealon in the UK or the USA, and is there a Pinealon 20mg option?",
      answer:
        "Tetrava Labs ships from the United States to qualified labs, with some regions restricted. Check the Shipping page for current country and state availability, UK included, before ordering. This listing is 10mg only. A \"Pinealon 20mg\" reference elsewhere isn't this SKU; confirm the actual strength against that vendor's own COA.",
    },
    {
      question: "Where to buy Pinealon peptide near me?",
      answer:
        "No pharmacy or supplement counter carries an RUO research peptide, so \"near me\" won't turn up a storefront. Tetrava Labs ships Pinealon directly to laboratories with documented lot identity, which matters more than proximity anyway.",
    },
    {
      question: "What purity and COA documentation come with Pinealon?",
      answer:
        "Independent third-party HPLC-MS testing backs each lot. The published Certificate of Analysis lists identity and purity for that specific batch. Match the lot number on the COA to the vial before you start comparative work.",
    },
    {
      question: "How is Pinealon stored and shipped?",
      answer:
        "Keep the lyophilized vial at -20°C. After reconstitution, avoid repeated freeze-thaw cycles and follow your lab's SOP for working-solution storage. Orders go out in cold-chain-aware packaging where the route requires it, with tracking emailed after dispatch.",
    },
    {
      question: "Is Pinealon Research Use Only?",
      answer:
        "Yes. Laboratory research only, for qualified institutions and researchers. Not for a person, not for an animal. No dosing or outcome claims attach to this listing.",
    },
  ],
  "cu-50mg-tb500-10mg-bpc-157-10mg-kpv-10mg-80mg": [
    {
      question: "What is KLOW peptide / what is in KLOW?",
      answer:
        "KLOW is shorthand, not a peptide, for an 80mg blend: BPC-157 10mg, TB-500 10mg, GHK-Cu 10mg, and KPV 50mg, lyophilized into one vial. Tetrava Labs sells it as a laboratory research reagent. Nobody regulates or defines \"KLOW\" as a term. It's just what this particular four-peptide combination is called on this page.",
    },
    {
      question: "What does KLOW peptide do, and what is KLOW peptide used for?",
      answer:
        "Each of the four components has its own research literature: BPC-157 in tissue repair and angiogenesis, TB-500 in actin regulation and cell migration, GHK-Cu in copper-peptide gene signaling tied to collagen, KPV in anti-inflammatory cytokine work. Tetrava Labs doesn't claim KLOW does anything as a combined product in a human body, because nobody has run that trial. This listing is Research Use Only, full stop.",
    },
    {
      question: "What's the difference between BPC-157, TB-500, GHK-Cu, and KPV in the KLOW blend?",
      answer:
        "They're four unrelated peptides sharing a vial, not four versions of one molecule. BPC-157 and TB-500 both come up in tissue-repair research, but through different mechanisms, one derived from gastric tissue, the other a thymosin beta-4 fragment. GHK-Cu is a copper-binding tripeptide with nothing to do with either. KPV is smaller still, three amino acids, studied for inflammation. Trust the Certificate of Analysis over the blend name.",
    },
    {
      question: "GLOW vs KLOW peptide — what's the difference?",
      answer:
        "One peptide: KPV. GLOW has BPC-157, TB-500, and GHK-Cu. KLOW has those same three plus KPV. Compare the two Certificates of Analysis and you'll see it directly. GLOW's chromatogram shows three peaks. KLOW's shows four.",
    },
    {
      question: "Is 'KLOW stack' the same as KLOW Blend?",
      answer:
        "Yes. Same vial, same four components, same fixed strengths. \"Stack\" and \"blend\" are just two words for the same catalog item on this page.",
    },
    {
      question:
        "Where can I buy KLOW / buy KLOW online / buy KLOW peptide online?",
      answer:
        "Right here. Tetrava Labs ships KLOW Blend (80mg) to qualified researchers with a lot-linked Certificate of Analysis covering all four components, not one blended purity figure. Research Use Only.",
    },
    {
      question:
        "What's the best place to buy KLOW peptide, or the best place to buy KLOW peptide online?",
      answer:
        "Look for a lot-specific COA that identifies all four peaks separately, BPC-157, TB-500, GHK-Cu, KPV, not a single purity percentage covering the whole vial. Cold-chain-aware shipping matters too. A cheaper price on a blend that only tests overall purity tells you less than it looks like it does.",
    },
    {
      question:
        "Where to buy KLOW peptide online in the USA, and is it available in Canada?",
      answer:
        "Tetrava Labs ships from the United States to qualified labs, with some regions restricted. Check the Shipping page for current country and state availability, Canada included, before you order. This is a research reagent, not a consumer product with a retail channel.",
    },
    {
      question: "Where can I buy KLOW peptides near me?",
      answer:
        "No pharmacy or supplement store stocks an RUO four-peptide blend, so \"near me\" won't get you far here. Tetrava Labs ships KLOW Blend directly to laboratories, with documented identity for all four components in the vial.",
    },
    {
      question: "What are the benefits of KLOW peptide?",
      answer:
        "Tetrava Labs doesn't make benefit claims for KLOW Blend. What exists is published research on the individual peptides: BPC-157 and TB-500 in tissue-repair signaling, GHK-Cu in gene modulation tied to collagen, KPV in anti-inflammatory cytokine work. None of that research has tested this specific four-peptide combination in a person.",
    },
    {
      question: "Are there KLOW peptide before-and-after results?",
      answer:
        "None that Tetrava Labs stands behind. No controlled trial has tested this four-peptide combination in humans, so before-and-after posts you find elsewhere are anecdotes, not data.",
    },
    {
      question: "Is there a KLOW dosage chart, or how much KLOW peptide should I take per day?",
      answer:
        "There isn't one on this page, on purpose. KLOW Blend is a laboratory reagent, not a product with a human dosing schedule. Concentration and volume for a given assay belong in your lab's own protocol.",
    },
    {
      question:
        "How much KLOW peptide to take per day, and how often should it be taken?",
      answer:
        "Tetrava Labs doesn't publish a daily amount or a frequency, because that's a human-dosing question and this is a Research Use Only catalog listing. Your lab's protocol sets concentration, volume, and frequency for whatever assay you're running.",
    },
    {
      question:
        "How do you reconstitute KLOW 80mg, and is there a KLOW 80mg reconstitution and dosage chart?",
      answer:
        "For lab prep: reconstitute the lyophilized powder under sterile technique with whatever diluent your protocol specifies, right before use, and log the diluent lot, concentration, and operator in your ELN. There's no milliliter-to-dose chart here, because that would pair a lab reagent with a human dose, and this listing doesn't support that.",
    },
    {
      question: "How do you dose or take KLOW peptide, and where do you inject it?",
      answer:
        "None of that is on this page. Tetrava Labs doesn't give dosing instructions, administration guidance, or injection sites for KLOW Blend. It's sold to qualified researchers for laboratory use, not for administering to a person or an animal.",
    },
    {
      question: "What purity and COA documentation come with KLOW Blend?",
      answer:
        "Independent third-party HPLC-MS testing resolves all four peaks per lot: BPC-157, TB-500, GHK-Cu, KPV. The published Certificate of Analysis lists identity and purity for each one. Match the batch number on the COA to the vial before you start comparative work.",
    },
    {
      question: "How is KLOW Blend stored and shipped?",
      answer:
        "Keep the lyophilized vial at -20°C. Once you reconstitute it, skip repeated freeze-thaw cycles. Orders go out in cold-chain-aware packaging where the route requires it, with tracking emailed after dispatch. See the Shipping page for delivery windows by region.",
    },
    {
      question: "Is KLOW Blend Research Use Only?",
      answer:
        "Yes. Laboratory research only, for qualified institutions and researchers. Not for a person, not for an animal, and no dosing or outcome claims attach to this listing.",
    },
  ],
  "glow-bpc-157-tb500-ghk-cu": [
    {
      question: "What is the GLOW blend (BPC-157 + TB-500 + GHK-Cu)?",
      answer:
        "GLOW is a multi-component research blend combining tissue-repair and copper-peptide reagents for laboratories studying combination protocols. RUO only — not a therapeutic cocktail.",
    },
    {
      question: "How should blend composition be verified?",
      answer:
        "Use the lot COA and labeled component strengths as the source of truth. Record each component identity in the ELN before reconstitution.",
    },
    {
      question: "How is GLOW reconstituted?",
      answer:
        "Reconstitute under sterile technique per your multi-peptide SOP. Keep vehicle and concentration controls consistent across study arms.",
    },
    {
      question: "Storage for GLOW blend vials?",
      answer:
        "Store lyophilized blend at -20°C. After reconstitution, refrigerate at 4°C and avoid repeated freeze–thaw cycles.",
    },
    {
      question: "How is GLOW shipped?",
      answer:
        "Temperature-controlled packaging where required; discreet shipping; email tracking.",
    },
    {
      question: "Is the GLOW blend for human use?",
      answer: "No. Research Use Only for qualified laboratories.",
    },
  ],
  "bpc-157-tb500-blend": [
    {
      question: "What is the BPC-157 + TB-500 research blend?",
      answer:
        "A two-component tissue-repair research blend for laboratories evaluating combination peptide protocols. Distinct from single-SKU BPC-157 or TB-500 — document identity carefully.",
    },
    {
      question: "How do I read the COA for a blend?",
      answer:
        "Confirm the COA lists the expected components and batch. File analytical data with your material ID before comparative work.",
    },
    {
      question: "Reconstitution notes?",
      answer:
        "Sterile technique, SOP-defined diluent, and ELN documentation of concentration targets for each study arm.",
    },
    {
      question: "Storage?",
      answer:
        "Lyophilized at -20°C; reconstituted at 4°C with limited freeze–thaw cycling.",
    },
    {
      question: "Shipping?",
      answer:
        "Cold-chain-aware packaging where required; tracking emailed after labeling.",
    },
    {
      question: "Is this blend Research Use Only?",
      answer: "Yes. Not for human or veterinary administration.",
    },
  ],
  sermorelin: [
    {
      question: "Where can you buy sermorelin peptide for qualified research?",
      answer:
        "You can buy sermorelin peptide online from Tetrava Labs in 5mg and 10mg vials. Every order ships to qualified researchers with lot-linked COA documentation confirming identity and HPLC purity for the exact batch received, not a generic catalog claim.",
    },
    {
      question: "What makes a supplier the best place to buy sermorelin?",
      answer:
        "The best place to buy sermorelin publishes a lot-specific Certificate of Analysis, not just a purity percentage, confirms sequence and molecular-weight identity for GHRH(1-29)-NH2, documents cold-chain-aware storage and shipping, and gives you direct access to that documentation before and after purchase. Price alone says nothing about research-grade quality.",
    },
    {
      question:
        'What does "sermorelin for sale" mean on an RUO catalog like this one?',
      answer:
        'On this page, "sermorelin for sale" means a Research Use Only (RUO) laboratory reagent sold to qualified researchers and institutions for in vitro and in vivo study. It is not a prescription, not a compounded medication, and it is not sold or represented as fit for human or veterinary use.',
    },
    {
      question: "Is sermorelin peptide sold near me, or only online?",
      answer:
        'Tetrava Labs sells sermorelin peptide for sale strictly online, shipped from a single documented source rather than a local retail or pharmacy channel. If you are searching "sermorelin peptide near me," the question that actually matters is whether a batch has a matching lot-specific COA, not whether a vendor has a storefront near your zip code.',
    },
    {
      question:
        "What should you verify when reading sermorelin Reddit discussions?",
      answer:
        "Treat sermorelin Reddit threads as unverified, self-reported anecdotes, not clinical evidence. Check whether a poster references an actual third-party COA or HPLC-MS report, whether the vendor they name still lists that lot, and whether the effect they describe (sleep, recovery, dosing) is a subjective report rather than a controlled measurement. The threads can point you toward good questions. They are not a substitute for lot-specific documentation.",
    },
    {
      question:
        "How does sermorelin differ from CJC-1295, ipamorelin, and tesamorelin?",
      answer:
        "Sermorelin and CJC-1295 both target the GHRH receptor, but CJC-1295 is structurally modified for a longer plasma half-life. Ipamorelin targets the separate ghrelin receptor (GHS-R1a), which makes it mechanistically distinct rather than a substitute. Tesamorelin is a stabilized GHRH(1-44) analog and the only one of the four with an active FDA-approved indication. They share GH-axis relevance. They are not interchangeable as experimental controls.",
    },
    {
      question: "How is sermorelin purity and identity verified?",
      answer:
        "Each lot gets checked by independent third-party HPLC-MS analysis reporting both purity and sequence/mass identity consistent with GHRH(1-29)-NH2. Match the COA batch number in the COA library to the vial you actually received before starting comparative research work.",
    },
    {
      question: "How should sermorelin be reconstituted and stored?",
      answer:
        "Store lyophilized vials at -20°C and skip repeated freeze-thaw cycles. Reconstitute under sterile technique with a protocol-appropriate diluent right before use, then hold the reconstituted solution at 4°C and use it within your lab's defined window. Log diluent lot, reconstitution date, and operator in your ELN alongside the batch COA.",
    },
    {
      question:
        "What is sermorelin's regulatory history, and is it FDA-approved today?",
      answer:
        "Sermorelin acetate was FDA-approved under the brand name Geref for pediatric growth hormone deficiency, then the manufacturer voluntarily pulled it in 2008. A 2013 FDA Federal Register determination confirmed the withdrawal was not for safety or effectiveness reasons, but that finding is not a current marketing approval. Tetrava Labs' sermorelin listing is Research Use Only, and it is not sold, marketed, or dispensed as a medication.",
    },
  ],
  tesamorelin: [
    {
      question: "What is tesamorelin in a research context?",
      answer:
        "Tesamorelin is a GHRH analogue examined in growth-hormone axis and metabolic research models. Catalogued here as Research Use Only.",
    },
    {
      question: "COA documentation for tesamorelin?",
      answer:
        "Third-party HPLC-MS data is published per lot when available. Match batch numbers before locking experimental design.",
    },
    {
      question: "Laboratory handling after reconstitution?",
      answer:
        "Sterile preparation, refrigerated storage of working solutions, and limited freeze–thaw cycles per SOP.",
    },
    {
      question: "Lyophilized storage?",
      answer: "Keep sealed vials at -20°C.",
    },
    {
      question: "Shipping?",
      answer:
        "Cold-chain-aware packaging where required; tracking emailed when labeled.",
    },
    {
      question: "Human use?",
      answer: "Not permitted. Research Use Only.",
    },
  ],
  "igf-1-lr3": [
    {
      question: "What is IGF-1 LR3 used for in research?",
      answer:
        "IGF-1 LR3 is a long-arginine-3 insulin-like growth factor analogue studied in cell growth and signaling models. Supplied as RUO material only.",
    },
    {
      question: "How is IGF-1 LR3 purity confirmed?",
      answer:
        "Review lot-linked third-party analytical documentation when published and retain it with inventory records.",
    },
    {
      question: "Reconstitution guidance?",
      answer:
        "Follow sterile technique and your assay SOP for growth-factor reagents. Document vehicle and concentration carefully.",
    },
    {
      question: "Storage?",
      answer:
        "Lyophilized at -20°C; reconstituted stocks typically refrigerated with strict freeze–thaw control.",
    },
    {
      question: "Shipping?",
      answer:
        "Temperature-controlled packaging where required; email tracking after dispatch.",
    },
    {
      question: "Is IGF-1 LR3 for human use?",
      answer: "No. Research Use Only for qualified laboratories.",
    },
  ],
  kpv: [
    {
      question: "What is KPV studied for in research?",
      answer:
        "KPV is an alpha-MSH-derived tripeptide examined in inflammation and barrier-model research. Tetrava Labs lists it as Research Use Only.",
    },
    {
      question: "Purity and COA for KPV?",
      answer:
        "Lots are supported by independent HPLC-MS analysis. Cross-check the COA batch with the vial.",
    },
    {
      question: "How should KPV be reconstituted?",
      answer:
        "Sterile reconstitution per SOP; ELN documentation of concentration and diluent. Not dosing advice.",
    },
    {
      question: "Storage conditions?",
      answer:
        "Lyophilized at -20°C; reconstituted at 4°C with minimal freeze–thaw cycles.",
    },
    {
      question: "Shipping?",
      answer:
        "Cold-chain-aware packaging where required; tracking emailed after labeling.",
    },
    {
      question: "Is KPV Research Use Only?",
      answer: "Yes.",
    },
  ],
  "thymosin-alpha-1": [
    {
      question: "What is Thymosin Alpha-1 in research catalogs?",
      answer:
        "Thymosin Alpha-1 is a thymic peptide studied in immune-modulation research models. Offered here strictly as an RUO reagent.",
    },
    {
      question: "How is Thymosin Alpha-1 documented?",
      answer:
        "Lot COAs with HPLC-MS summaries are published when available. File them with your material ID.",
    },
    {
      question: "Reconstitution and handling?",
      answer:
        "Prepare under sterile technique per SOP. Record operator, diluent, and concentration in the ELN.",
    },
    {
      question: "Storage?",
      answer:
        "Lyophilized at -20°C; reconstituted typically at 4°C with limited freeze–thaw cycling.",
    },
    {
      question: "Shipping?",
      answer:
        "Temperature-controlled packaging where required; email tracking.",
    },
    {
      question: "Human therapeutic use?",
      answer: "Not allowed. Research Use Only.",
    },
  ],
  "5-amino-1mq": [
    {
      question: "What is 5-Amino-1MQ studied for?",
      answer:
        "5-Amino-1MQ is a small-molecule NNMT-pathway research tool used in metabolic laboratory models. Catalogued as Research Use Only.",
    },
    {
      question: "How is 5-Amino-1MQ purity verified?",
      answer:
        "Independent analytical testing supports lot identity and purity when a COA is published.",
    },
    {
      question: "How should 5-Amino-1MQ be prepared?",
      answer:
        "Follow your SOP for small-molecule research reagents (solvent choice, sterile filtration if required, and ELN documentation). Not human-use guidance.",
    },
    {
      question: "Storage?",
      answer:
        "Store per the product specifications — typically cold, dry, and sealed. Protect from unnecessary moisture.",
    },
    {
      question: "Shipping?",
      answer:
        "Shipped with appropriate packaging; tracking emailed after dispatch.",
    },
    {
      question: "Is 5-Amino-1MQ for human consumption?",
      answer: "No. Research Use Only.",
    },
  ],
  "ss-31": [
    {
      question: "What is SS-31 (Elamipretide) in research?",
      answer:
        "SS-31 is a mitochondria-targeting peptide studied in bioenergetics and oxidative-stress models. Tetrava Labs supplies it as RUO material.",
    },
    {
      question: "COA expectations for SS-31?",
      answer:
        "Third-party HPLC-MS documentation is published per lot when available. Match batch identity before assays.",
    },
    {
      question: "Reconstitution guidance?",
      answer:
        "Sterile technique and SOP-defined diluent; record concentration in the ELN. Not clinical dosing advice.",
    },
    {
      question: "Storage?",
      answer:
        "Lyophilized at -20°C; reconstituted at 4°C with minimal freeze–thaw cycles.",
    },
    {
      question: "Shipping?",
      answer:
        "Cold-chain-aware packaging where required; tracking emailed after labeling.",
    },
    {
      question: "Is SS-31 Research Use Only?",
      answer: "Yes. Not for human or veterinary administration.",
    },
  ],
};

/** Curated FAQs if present; otherwise unique auto FAQs from catalog context. */
export function getProductFaqs(
  parentHandle: string,
  context?: Omit<ProductFaqContext, "parentHandle">,
): FaqItem[] {
  const raw = parentHandle.trim().toLowerCase();
  const key = getCompoundParentHandle(raw) || raw;
  const curated = productFaqsByHandle[key];
  if (curated?.length) return curated;

  const auto = buildAutoProductFaqs({
    parentHandle: key,
    productName: context?.productName,
    category: context?.category,
    appearance: context?.appearance,
  });
  return auto.length ? auto : productFaqItems;
}
