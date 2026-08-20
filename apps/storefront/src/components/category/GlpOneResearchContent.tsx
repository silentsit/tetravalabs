import Image from "next/image"
import Link from "next/link"

/**
 * Longform editorial content for /category/glp-1-research.
 * Rendered below the product grid. ~1700 words. RUO-compliant. Fully cited.
 */
export function GlpOneResearchContent() {
  return (
    <article className="mx-auto max-w-4xl space-y-12 py-4 text-[#0F172A]">
      {/* ── Section 1: Receptor pharmacology ── */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#0F172A]">What GLP-1 receptors actually do</h2>
        <p className="leading-relaxed text-[#475569]">
          Glucagon-like peptide-1 is a 30-amino-acid incretin hormone secreted by intestinal L-cells in
          response to nutrient ingestion. Its receptor (GLP-1R) is a class B G protein-coupled receptor
          expressed across a wider tissue distribution than the original diabetes literature suggested.
          Beyond pancreatic beta cells, GLP-1R expression has been confirmed in the hypothalamus and
          brainstem (appetite regulation), cardiac myocytes and vascular endothelium (cardioprotection),
          proximal tubule cells of the kidney (natriuresis, renoprotection), hepatocytes (lipid flux), and
          multiple CNS nuclei including the substantia nigra and cortex (neuroprotection).{" "}
          <a
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12653004/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [1]
          </a>
        </p>
        <p className="leading-relaxed text-[#475569]">
          When a GLP-1R agonist binds, the receptor couples primarily to G&alpha;s, activating adenylyl
          cyclase and elevating intracellular cAMP. This triggers protein kinase A and exchange protein
          activated by cAMP (Epac2), which together close ATP-sensitive potassium channels, depolarize the
          cell membrane, and — in beta cells — gate calcium influx to drive glucose-dependent insulin
          secretion. The same cAMP cascade in hypothalamic neurons suppresses neuropeptide Y signaling,
          reducing food intake. In cardiomyocytes it improves contractile function and attenuates
          ischaemia-reperfusion injury. In the kidney it reduces albuminuria through haemodynamic and
          anti-inflammatory mechanisms. One receptor, one ligand class, at least six physiologically
          distinct research targets.
        </p>
        <p className="leading-relaxed text-[#475569]">
          The peptide's native half-life is under two minutes in vivo — it is rapidly cleaved by dipeptidyl
          peptidase-4 (DPP-4) and neutral endopeptidase 24.11. Synthetic research analogues extend that
          window through fatty acid conjugation (liraglutide: 13h), albumin-binding side chains (semaglutide:
          ~168h), or by building agonist activity into a single hybrid peptide backbone that targets two or
          three receptors simultaneously. These structural modifications are themselves active areas of
          preclinical investigation.{" "}
          <a
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12668848/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [2]
          </a>
        </p>

        <figure className="overflow-hidden rounded-xl">
          <Image
            src="/images/category/glp-1-research-1.jpg"
            alt="GLP-1 receptor protein embedded in lipid bilayer membrane showing peptide ligand binding site for incretin research"
            width={1200}
            height={675}
            className="w-full object-cover"
            priority
          />
          <figcaption className="mt-2 text-center text-xs text-[#94A3B8]">
            Molecular model of GLP-1R transmembrane domain with bound peptide agonist. Research use only.
          </figcaption>
        </figure>
      </section>

      {/* ── Section 2: Compound generations ── */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#0F172A]">Three generations of GLP-1 research compounds</h2>
        <p className="leading-relaxed text-[#475569]">
          The GLP-1 research landscape in 2026 spans three pharmacological generations, each building on
          evidence from the previous. Understanding the distinctions matters for designing experiments that
          ask the right mechanistic questions.
        </p>

        <h3 className="text-lg font-semibold text-[#0F172A]">
          First generation: selective GLP-1R agonists
        </h3>
        <p className="leading-relaxed text-[#475569]">
          Semaglutide remains the reference single-receptor GLP-1R agonist. The STEP clinical programme
          established ~14.9% mean body weight reduction over 68 weeks in non-diabetic subjects.{" "}
          <a
            href="https://www.sciencedirect.com/science/article/abs/pii/S2451847626000047"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [3]
          </a>{" "}
          In preclinical models it reduces amyloid-beta (A&beta;) deposition, attenuates neuroinflammation
          via AMP-activated protein kinase activation, and inhibits TLR4/NF-&kappa;B signalling.{" "}
          <a
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12653004/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [1]
          </a>{" "}
          Two Phase 3 trials (EVOKE and EVOKE+) are currently evaluating semaglutide as a disease-modifying
          agent in Alzheimer's disease — a direct translation of the preclinical neuroprotection signal.{" "}
          <a
            href="https://www.sciencedirect.com/science/article/pii/S2590112526000411"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [4]
          </a>
        </p>

        <h3 className="text-lg font-semibold text-[#0F172A]">
          Second generation: dual GLP-1/GIP receptor agonists
        </h3>
        <p className="leading-relaxed text-[#475569]">
          Tirzepatide co-activates the glucose-dependent insulinotropic polypeptide receptor (GIPR)
          alongside GLP-1R. GIPR agonism adds distinct mechanisms: increased energy expenditure through
          brown adipose tissue activation, improved postprandial insulin secretion, and — in preclinical
          models — attenuation of Alzheimer's pathology through cerebral glucose metabolism normalisation and
          neurotrophic factor upregulation.{" "}
          <a
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12653004/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [1]
          </a>{" "}
          The SURMOUNT-1 trial recorded mean weight loss of 22.5% at the highest dose — approximately 7.6
          percentage points more than semaglutide in comparable populations.{" "}
          <a
            href="https://www.sciencedirect.com/science/article/abs/pii/S2451847626000047"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [3]
          </a>{" "}
          For laboratory research, the added GIPR component makes tirzepatide useful for dissecting
          incretin co-operativity: experiments comparing tirzepatide vs. semaglutide head-to-head in the
          same in-vitro system can isolate the marginal effect of GIPR activation.
        </p>

        <h3 className="text-lg font-semibold text-[#0F172A]">
          Third generation: triple GLP-1/GIP/glucagon receptor agonists
        </h3>
        <p className="leading-relaxed text-[#475569]">
          Retatrutide adds glucagon receptor (GCGR) agonism to the dual backbone. Glucagon drives hepatic
          glucose output and thermogenesis; GCGR co-activation amplifies energy expenditure beyond what the
          incretin axis alone can achieve. In a Phase 2 dose-ranging trial, retatrutide produced 24.2% mean
          weight reduction over 48 weeks — the largest reported in a GLP-class trial to date.{" "}
          <a
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12304053/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [5]
          </a>{" "}
          Phase 3 data are anticipated in 2026. As an investigational compound, retatrutide is available for
          preclinical research use; it is not approved for human administration.
        </p>
        <p className="leading-relaxed text-[#475569]">
          The generation map is also a mechanistic map. Each successive receptor addition changes the
          downstream signal profile in a way that produces distinct readouts in glucose tolerance tests,
          adipose tissue histology, hepatic lipid panels, and — increasingly — neurological endpoint assays.
        </p>

        <figure className="overflow-hidden rounded-xl">
          <Image
            src="/images/category/glp-1-research-2.jpg"
            alt="Pharmaceutical-grade lyophilized semaglutide, tirzepatide, and retatrutide GLP-1 research peptide vials on stainless steel laboratory surface"
            width={1200}
            height={675}
            className="w-full object-cover"
          />
          <figcaption className="mt-2 text-center text-xs text-[#94A3B8]">
            Semaglutide, tirzepatide (dual-agonist), and retatrutide (triple-agonist) lyophilized research
            compounds. All compounds for research use only (RUO).
          </figcaption>
        </figure>
      </section>

      {/* ── Section 3: Neuroprotection frontier ── */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#0F172A]">The neuroprotection frontier</h2>
        <p className="leading-relaxed text-[#475569]">
          GLP-1 receptor expression in the CNS was first described in 2002. For over a decade the finding
          was a footnote. By 2026 it has become one of the most actively funded research directions in
          neuroscience, with a mechanistic rationale grounded in at least four distinct pathways.{" "}
          <a
            href="https://www.sciencedirect.com/science/article/pii/S2590112526000411"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [4]
          </a>
        </p>
        <ul className="space-y-3 pl-5 text-[#475569]">
          <li className="list-disc leading-relaxed">
            <span className="font-medium text-[#0F172A]">Amyloid-beta and tau reduction.</span> In APP/PS1
            transgenic mouse models, liraglutide reduced cerebral A&beta; plaque burden and improved spatial
            learning. Semaglutide reduced A&beta; deposition and tau hyperphosphorylation in multiple rodent
            paradigms.{" "}
            <a
              href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12653004/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              [1]
            </a>
          </li>
          <li className="list-disc leading-relaxed">
            <span className="font-medium text-[#0F172A]">Neuroinflammation suppression.</span> GLP-1R
            agonism inhibits microglial activation and reduces pro-inflammatory cytokine release (IL-1&beta;,
            TNF-&alpha;, IL-6) in in-vitro neuroinflammation models. The TLR4/NF-&kappa;B pathway is a
            primary target.{" "}
            <a
              href="https://www.mdpi.com/1422-0067/26/21/10743"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              [6]
            </a>
          </li>
          <li className="list-disc leading-relaxed">
            <span className="font-medium text-[#0F172A]">Mitochondrial function and oxidative stress.</span>{" "}
            Preclinical data show GLP-1R agonists reduce ROS production, inhibit neuronal apoptosis, and
            improve mitochondrial membrane potential in stressed dopaminergic neurons — a key mechanism for
            Parkinson's disease models.{" "}
            <a
              href="https://www.mdpi.com/1422-0067/26/21/10743"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              [6]
            </a>
          </li>
          <li className="list-disc leading-relaxed">
            <span className="font-medium text-[#0F172A]">Cerebral insulin resistance.</span> Type 2
            diabetes and Alzheimer's disease share overlapping insulin signalling deficits in the brain. GLP-1R
            agonists restore cerebral glucose utilisation in FDG-PET studies and normalise downstream
            PI3K/Akt activity.{" "}
            <a
              href="https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2025.1708565/full"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              [7]
            </a>
          </li>
        </ul>
        <p className="leading-relaxed text-[#475569]">
          The Phase 3 EVOKE programme (semaglutide vs. placebo in early Alzheimer's) is the first
          large-scale clinical test of this preclinical signal. Results, when published, will define whether
          GLP-1R agonism produces a measurable cognitive benefit or whether the preclinical effect sizes
          were an artefact of rodent models. Either outcome significantly advances the field. Researchers
          running parallel preclinical work now — using semaglutide,{" "}
          <Link href="/shop" className="text-[#0D9488] hover:underline">
            tirzepatide, or retatrutide
          </Link>{" "}
          as tools — are building the interpretive framework that will contextualise those results.
        </p>

        <figure className="overflow-hidden rounded-xl">
          <Image
            src="/images/category/glp-1-research-3.jpg"
            alt="Neural synapse network research workstation showing GLP-1 neuroprotection study data and neuroscience laboratory analysis"
            width={1200}
            height={675}
            className="w-full object-cover"
          />
          <figcaption className="mt-2 text-center text-xs text-[#94A3B8]">
            Preclinical GLP-1 neuroprotection research: synaptic modelling and in-vitro neuroinflammation
            analysis. Research use only.
          </figcaption>
        </figure>
      </section>

      {/* ── Section 4: Microdosing question ── */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#0F172A]">The microdosing question</h2>
        <p className="leading-relaxed text-[#475569]">
          A prevalent discussion in the research community concerns sub-therapeutic dosing: whether very low
          concentrations of GLP-1R agonists retain meaningful receptor activity while reducing off-target
          effects. The current evidence base is instructive precisely because it is mixed.
        </p>
        <p className="leading-relaxed text-[#475569]">
          The SURMOUNT-1 dose-response data for tirzepatide show a classic diminishing-returns curve: 5 mg
          produced 15% weight loss, 10 mg produced 19.5%, and 15 mg produced 20.9% — a 100% dose increase
          from 5 to 10 mg added 4.5 percentage points, while a 50% increase from 10 to 15 mg added only 1.4
          percentage points.{" "}
          <a
            href="https://formblends.com/articles/glp1-hub/glp1-microdosing-low-dose-protocol"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [8]
          </a>{" "}
          This curve has led some researchers to hypothesise that much of the pharmacodynamic effect is
          captured at relatively low receptor occupancy. A 2025 ClinicalTrials.gov registration
          (NCT07092605) is evaluating sub-therapeutic dosing in metabolic models.{" "}
          <a
            href="https://clinicaltrials.gov/study/NCT07092605"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [9]
          </a>
        </p>
        <p className="leading-relaxed text-[#475569]">
          STAT News (2025) reviewed the microdosing literature and concluded there is no robust clinical
          evidence that semaglutide or tirzepatide produce clinically significant effects at sub-therapeutic
          doses in randomised trials.{" "}
          <a
            href="https://www.statnews.com/2025/11/04/microdosing-glp-1-drugs-no-clinical-evidence-effective/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [10]
          </a>{" "}
          This is not the same as evidence of absence. What it reflects is that the controlled trials do not
          yet exist. For in-vitro and rodent model researchers, dose-response characterisation across a wide
          range — including sub-therapeutic concentrations — remains an open and scientifically productive
          question. The mechanistic readouts in cell culture (cAMP accumulation, downstream kinase activity,
          gene expression) can be quantified at concentrations below those used in clinical dosing. The
          relationship between those in-vitro signals and in-vivo pharmacology is part of what GLP-1
          research is actively working to clarify.
        </p>
      </section>

      {/* ── Section 5: Analytical standards ── */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#0F172A]">Analytical standards for GLP-1 research compounds</h2>
        <p className="leading-relaxed text-[#475569]">
          GLP-1 class peptides are structurally complex: semaglutide is a 31-residue peptide with a C-18
          fatty diacid side chain via a linker; tirzepatide is a 39-amino-acid dual-agonist; retatrutide
          adds a C-20 fatty diacid to a 39-residue backbone. Minor sequence errors, incomplete conjugation,
          or aggregate formation change pharmacodynamic profiles in ways that plain UV absorbance assays
          cannot detect. For research where mechanistic conclusions depend on compound identity, the minimum
          analytical documentation should include:
        </p>
        <ul className="space-y-2 pl-5 text-[#475569]">
          <li className="list-disc leading-relaxed">
            <span className="font-medium text-[#0F172A]">HPLC purity trace</span> — identifies peptide
            degradation products and confirms &ge;99% area-under-curve purity at the lot level.
          </li>
          <li className="list-disc leading-relaxed">
            <span className="font-medium text-[#0F172A]">Mass spectrometry identity</span> — confirms
            molecular mass to &lt;5 ppm, ruling out sequence scrambles, truncations, or adducts that HPLC
            alone misses.
          </li>
          <li className="list-disc leading-relaxed">
            <span className="font-medium text-[#0F172A]">Lot-linked documentation</span> — each shipped
            vial traceable to the specific analytical batch, not a generic COA from a different production
            run.
          </li>
          <li className="list-disc leading-relaxed">
            <span className="font-medium text-[#0F172A]">Storage format</span> — lyophilized (
            <em>not</em> pre-dissolved) for shelf stability at -20°C; solubilisation per lab SOP immediately
            before experiment.
          </li>
        </ul>
        <p className="leading-relaxed text-[#475569]">
          All GLP-1 research compounds in this catalogue ship as lyophilized powder with{" "}
          <Link href="/coa-library" className="text-[#0D9488] hover:underline">
            lot-linked COA documentation
          </Link>{" "}
          including HPLC-MS analytical data. Browse compound specifications, purity traces, and batch
          records in the{" "}
          <Link href="/coa-library" className="text-[#0D9488] hover:underline">
            COA Library
          </Link>{" "}
          before committing to an experimental design.
        </p>
      </section>

      {/* ── Section 6: CTA + RUO ── */}
      <section className="space-y-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
        <h2 className="font-serif text-xl text-[#0F172A]">GLP-1 research compounds at Tetrava</h2>
        <p className="leading-relaxed text-[#475569]">
          All compounds are for <strong>research use only (RUO)</strong> — not for human consumption,
          diagnosis, or therapy. The catalogue includes semaglutide, tirzepatide, and retatrutide at
          multiple mass points, all shipped lyophilized with lot-linked HPLC-MS documentation and cold-chain
          packaging.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/shop" className="btn-primary text-sm">
            Browse all GLP-1 compounds
          </Link>
          <Link href="/coa-library" className="btn-secondary text-sm">
            View COA library
          </Link>
        </div>
      </section>

      {/* ── References ── */}
      <section className="space-y-2 border-t border-[#E2E8F0] pt-6 text-xs text-[#94A3B8]">
        <p className="font-medium text-[#475569]">References</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            Pharmacological mechanisms of GLP-1/GIP receptor agonists.{" "}
            <a
              href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12653004/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              PMC12653004
            </a>
          </li>
          <li>
            GLP-1RA prospects and obstacles — FDA approvals pipeline.{" "}
            <a
              href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12668848/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              PMC12668848
            </a>
          </li>
          <li>
            Revolutionizing obesity treatment — semaglutide and tirzepatide efficacy data.{" "}
            <a
              href="https://www.sciencedirect.com/science/article/abs/pii/S2451847626000047"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              ScienceDirect S2451847626000047
            </a>
          </li>
          <li>
            GLP-1 agonists in movement disorders and the CNS — Phase 3 context.{" "}
            <a
              href="https://www.sciencedirect.com/science/article/pii/S2590112526000411"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              ScienceDirect S2590112526000411
            </a>
          </li>
          <li>
            Triple agonism therapies for obesity — retatrutide Phase 2 data.{" "}
            <a
              href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12304053/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              PMC12304053
            </a>
          </li>
          <li>
            GLP-1 and the degenerating brain — oxidative stress and mitochondrial mechanisms.{" "}
            <a
              href="https://www.mdpi.com/1422-0067/26/21/10743"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              MDPI IJMS 26(21):10743
            </a>
          </li>
          <li>
            GLP-1 receptor agonists in Alzheimer's and Parkinson's disease.{" "}
            <a
              href="https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2025.1708565/full"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              Frontiers Endocrinology 10.3389/fendo.2025.1708565
            </a>
          </li>
          <li>
            Tirzepatide dose-response and microdosing analysis.{" "}
            <a
              href="https://formblends.com/articles/glp1-hub/glp1-microdosing-low-dose-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              FormBlends GLP-1 microdosing review
            </a>
          </li>
          <li>
            Microdosing GLP-1 in metabolic models — ClinicalTrials.gov NCT07092605.{" "}
            <a
              href="https://clinicaltrials.gov/study/NCT07092605"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              ClinicalTrials.gov NCT07092605
            </a>
          </li>
          <li>
            No robust clinical evidence for microdosing at sub-therapeutic doses — STAT News 2025.{" "}
            <a
              href="https://www.statnews.com/2025/11/04/microdosing-glp-1-drugs-no-clinical-evidence-effective/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              STAT News, November 2025
            </a>
          </li>
        </ol>
      </section>
    </article>
  )
}
