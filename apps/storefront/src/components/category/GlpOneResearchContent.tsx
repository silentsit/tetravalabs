import Image from "next/image"
import Link from "next/link"

/**
 * Longform editorial for /category/glp-1-research.
 * Rendered below the product grid. ~1700–1900 words. RUO. Cited.
 */
export function GlpOneResearchContent() {
  return (
    <article className="mx-auto max-w-4xl space-y-12 py-4 text-[#0F172A]">
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#0F172A]">What research shows about GLP-1 drugs</h2>
        <p className="leading-relaxed text-[#475569]">
          GLP-1 research peptides are tools for studying incretin signalling. The short answer to "what does
          research show about GLP-1 drugs?" is that the clinical and preclinical records do not say the same
          thing in every tissue. In metabolic trials, selective GLP-1 receptor agonists cut mean body weight
          by roughly 15%. Dual GLP-1/GIP agonists cut it further. Triple agonists that also hit the glucagon
          receptor have posted still higher Phase 2 means. In the brain, the same receptor class reduces
          amyloid load and inflammatory markers in rodents, and Phase 3 Alzheimer's programmes are now
          testing whether that signal survives in people.{" "}
          <a
            href="https://www.sciencedirect.com/science/article/abs/pii/S2451847626000047"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [1]
          </a>{" "}
          <a
            href="https://www.sciencedirect.com/science/article/pii/S2590112526000411"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [2]
          </a>
        </p>
        <p className="leading-relaxed text-[#475569]">
          This page is for laboratory buyers of GLP-1 research compounds. It covers receptor biology, the
          three agonist generations you will see on a product list, neuroprotection data, the microdosing
          debate, free tools that actually help bench work, and what to demand on a certificate of analysis
          before you buy GLP-1 research peptides online.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#0F172A]">What GLP-1 receptors do in tissue</h2>
        <p className="leading-relaxed text-[#475569]">
          Glucagon-like peptide-1 is a 30-amino-acid incretin made by intestinal L-cells after a meal. Its
          receptor, GLP-1R, is a class B G protein-coupled receptor. Early diabetes papers treated it as a
          beta-cell story. That was incomplete.
        </p>
        <p className="leading-relaxed text-[#475569]">
          GLP-1R is also found in the hypothalamus and brainstem, in cardiac myocytes and vascular
          endothelium, in proximal tubule cells, in hepatocytes, and in CNS nuclei such as the substantia
          nigra and cortex.{" "}
          <a
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12653004/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [3]
          </a>{" "}
          Agonist binding couples mainly to G&alpha;s, raises cAMP, and turns on protein kinase A and Epac2.
          In beta cells that closes KATP channels, opens calcium channels, and releases insulin only when
          glucose is high. In hypothalamic neurons the same cascade damps neuropeptide Y signalling. In
          heart muscle it changes contractile behaviour after ischaemia. In kidney it lowers albuminuria in
          model systems.
        </p>
        <p className="leading-relaxed text-[#475569]">
          Native GLP-1 lasts under two minutes in vivo. DPP-4 and neutral endopeptidase 24.11 cut it. Research
          analogues stretch that window with fatty-acid conjugation (liraglutide, about 13 hours) or
          albumin-binding side chains (semaglutide, roughly a week). Dual and triple agonists fold a second or
          third receptor into one peptide backbone.{" "}
          <a
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12668848/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [4]
          </a>
        </p>
        <p className="leading-relaxed text-[#475569]">
          Those side chains matter for lab work. Fatty-acylated GLP-1 research peptides adsorb to plastic
          more than bare peptides. Labs that tip reconstituted stock into untreated polypropylene tubes often
          measure a lower free concentration than the nominal dilution implies. Glass or low-bind plastic
          and a documented stock protocol fix most of that noise.
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

      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#0F172A]">GLP-1 research compounds by generation</h2>
        <p className="leading-relaxed text-[#475569]">
          Most GLP-1 research products fall into three agonist classes. Pick the class that matches the
          receptor question you are asking, not the class with the loudest clinical headline.
        </p>

        <h3 className="text-lg font-semibold text-[#0F172A]">Selective GLP-1R agonists</h3>
        <p className="leading-relaxed text-[#475569]">
          Semaglutide is still the reference single-receptor agonist. The STEP programme reported about 14.9%
          mean weight reduction over 68 weeks in non-diabetic subjects.{" "}
          <a
            href="https://www.sciencedirect.com/science/article/abs/pii/S2451847626000047"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [1]
          </a>{" "}
          In rodent models it lowers amyloid-beta deposition, slows neuroinflammation through AMPK, and
          dampens TLR4/NF-&kappa;B signalling.{" "}
          <a
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12653004/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [3]
          </a>{" "}
          The Phase 3 EVOKE and EVOKE+ trials are testing whether that CNS signal shows up as a cognitive
          endpoint in early Alzheimer's disease.{" "}
          <a
            href="https://www.sciencedirect.com/science/article/pii/S2590112526000411"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [2]
          </a>
        </p>

        <h3 className="text-lg font-semibold text-[#0F172A]">
          Dual GLP-1/GIP agonists and the tirzepatide research peptide
        </h3>
        <p className="leading-relaxed text-[#475569]">
          Tirzepatide activates GIPR as well as GLP-1R. GIPR activity changes energy expenditure and
          postprandial insulin release in ways a pure GLP-1 agonist does not. Preclinical work also links
          dual agonism to cerebral glucose metabolism and neurotrophic factor expression in Alzheimer model
          rats.{" "}
          <a
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12653004/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [3]
          </a>
        </p>
        <p className="leading-relaxed text-[#475569]">
          SURMOUNT-1 reported mean weight loss of 22.5% at the highest tirzepatide dose, several percentage
          points above semaglutide in similar populations.{" "}
          <a
            href="https://pubmed.ncbi.nlm.nih.gov/35658024/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [5]
          </a>{" "}
          For a GLP-1 research lab that wants the marginal GIPR contribution, the clean design is
          tirzepatide versus semaglutide in the same assay, same buffer, same readout. That isolates
          co-operativity without inventing a new endpoint.
        </p>

        <h3 className="text-lg font-semibold text-[#0F172A]">Triple GLP-1/GIP/glucagon agonists</h3>
        <p className="leading-relaxed text-[#475569]">
          Retatrutide adds glucagon receptor agonism. Glucagon raises hepatic glucose output and
          thermogenesis. In Phase 2 dose-ranging work, retatrutide produced 24.2% mean weight reduction over
          48 weeks.{" "}
          <a
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12304053/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [6]
          </a>{" "}
          Phase 3 packages are still in progress. Retatrutide is investigational. It is sold here as a
          research compound, not as a drug.
        </p>
        <p className="leading-relaxed text-[#475569]">
          Pipeline neighbours such as survodutide (GLP-1/glucagon) and cagrilintide plus semaglutide
          combinations show the same pattern: more receptors, different hepatic and adipose readouts. If your
          endpoint is hepatic lipid flux, a triple agonist is a different tool from a selective GLP-1R peptide.
          If your endpoint is GLP-1R-only signalling, start with semaglutide.
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
            Semaglutide, tirzepatide (dual agonist), and retatrutide (triple agonist) lyophilized research
            compounds. Research use only.
          </figcaption>
        </figure>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#0F172A]">GLP-1 research updates in the CNS</h2>
        <p className="leading-relaxed text-[#475569]">
          CNS expression of GLP-1R was reported in 2002. For years it sat in review footnotes. By 2025–2026 it
          is a funded neuroscience line, not a metabolic side note.{" "}
          <a
            href="https://www.sciencedirect.com/science/article/pii/S2590112526000411"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [2]
          </a>
        </p>
        <p className="leading-relaxed text-[#475569]">
          In APP/PS1 mice, liraglutide cut cerebral amyloid plaque load and improved spatial learning.
          Semaglutide reduced amyloid deposition and tau hyperphosphorylation in several rodent paradigms.{" "}
          <a
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12653004/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [3]
          </a>{" "}
          In vitro, GLP-1R agonism lowers microglial activation and cuts IL-1&beta;, TNF-&alpha;, and IL-6 release;
          TLR4/NF-&kappa;B is a frequent pathway hit.{" "}
          <a
            href="https://www.mdpi.com/1422-0067/26/21/10743"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [7]
          </a>
        </p>
        <p className="leading-relaxed text-[#475569]">
          Stressed dopaminergic neurons show less ROS, less apoptosis, and better mitochondrial membrane
          potential under GLP-1R agonists in Parkinson model systems.{" "}
          <a
            href="https://www.mdpi.com/1422-0067/26/21/10743"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [7]
          </a>{" "}
          Type 2 diabetes and Alzheimer's disease share overlapping cerebral insulin signalling failures.
          FDG-PET work and pathway studies report restored glucose use and more normal PI3K/Akt activity after
          GLP-1R agonism.{" "}
          <a
            href="https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2025.1708565/full"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [8]
          </a>
        </p>
        <p className="leading-relaxed text-[#475569]">
          EVOKE is the first large clinical test of that preclinical pile. Until those results land, parallel
          in-vitro and rodent work with{" "}
          <Link href="/shop" className="text-[#0D9488] hover:underline">
            tirzepatide or retatrutide
          </Link>{" "}
          still needs a fixed assay design, a documented stock concentration, and a lot number on every figure.
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
            Preclinical GLP-1 neuroprotection work: synaptic modelling and neuroinflammation assays. Research
            use only.
          </figcaption>
        </figure>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#0F172A]">Microdosing GLP-1 research</h2>
        <p className="leading-relaxed text-[#475569]">
          "Microdosing GLP-1 research" usually means testing concentrations well below the clinical maintenance
          range. The clinical evidence for that practice in people is thin.
        </p>
        <p className="leading-relaxed text-[#475569]">
          SURMOUNT-1 dose arms for tirzepatide were 5 mg, 10 mg, and 15 mg, with mean weight losses of 15%,
          19.5%, and 20.9%. Doubling from 5 mg to 10 mg added 4.5 percentage points. Raising from 10 mg to 15
          mg added 1.4.{" "}
          <a
            href="https://pubmed.ncbi.nlm.nih.gov/35658024/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [5]
          </a>{" "}
          That curve invites low-occupancy hypotheses. It does not prove them.
        </p>
        <p className="leading-relaxed text-[#475569]">
          ClinicalTrials.gov lists NCT07092605 for microdosed GLP-1 work in metabolic endpoints.{" "}
          <a
            href="https://clinicaltrials.gov/study/NCT07092605"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [9]
          </a>{" "}
          A November 2025 STAT News review of the clinical literature found no solid randomised evidence that
          semaglutide or tirzepatide produce clinically meaningful effects at sub-therapeutic doses.{" "}
          <a
            href="https://www.statnews.com/2025/11/04/microdosing-glp-1-drugs-no-clinical-evidence-effective/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:underline"
          >
            [10]
          </a>
        </p>
        <p className="leading-relaxed text-[#475569]">
          Cell culture is a different problem. cAMP assays, kinase panels, and transcript readouts can be
          run across a wide concentration range, including levels far below human trial doses. That is
          legitimate GLP-1 research. It is not a dosing protocol for people, and this catalogue does not
          supply one.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#0F172A]">Free tools for a GLP-1 research lab</h2>
        <p className="leading-relaxed text-[#475569]">
          Search traffic for "best free GLP-1 research tools and calculators" and "top peptide dosage
          calculators for GLP-1 research" usually wants a human dosing widget. That is the wrong tool class
          for RUO reagents. What helps at the bench is different.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-[#475569]">
          <li className="leading-relaxed">
            <a
              href="https://clinicaltrials.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              ClinicalTrials.gov
            </a>{" "}
            with filters for semaglutide, tirzepatide, retatrutide, Alzheimer, HFpEF, MASH, and CKD. Use it to
            track GLP-1 research news and protocol designs, not to invent a lab dose from a trial arm.
          </li>
          <li className="leading-relaxed">
            <a
              href="https://pubchem.ncbi.nlm.nih.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              PubChem
            </a>{" "}
            for molecular weight, structure, and synonyms when you write a materials section.
          </li>
          <li className="leading-relaxed">
            A molarity calculator that converts mg of lyophilized peptide into molar stock for in-vitro
            media. That is volume and concentration math for assays. It is not a human reconstitution or
            injection schedule.
          </li>
          <li className="leading-relaxed">
            Lot-linked COA PDFs from the supplier you actually ordered. A generic purity claim with no batch
            ID is not a tool. It is a risk.
          </li>
        </ul>
        <p className="leading-relaxed text-[#475569]">
          Named-entity searches such as "professor peptides GLP-1 research compounds" or "Rebecca Diamond
          GLP-1 research" often land on third-party blogs or other sellers. Treat those as navigation noise.
          Match your order to compound identity, HPLC-MS data, and a lot number instead.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#0F172A]">Storage before the assay</h2>
        <p className="leading-relaxed text-[#475569]">
          Keep lyophilized GLP-1 research peptides at -20°C, dry, and dark until you open the vial. Once
          reconstituted under your lab SOP, aliquot. Avoid repeated freeze-thaw. Fatty-acylated analogues
          (semaglutide, tirzepatide, retatrutide) are more prone to surface loss and aggregation than short
          linear peptides, so document solvent, concentration, and hold time on every aliquot label.
        </p>
        <p className="leading-relaxed text-[#475569]">
          Do not treat a "dosage calculator" screenshot as a stability study. If you need working-concentration
          guidance, derive it from your assay's EC50 literature and your own titration curve.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#0F172A]">
          Analytical checks before you buy GLP-1 research peptides
        </h2>
        <p className="leading-relaxed text-[#475569]">
          Semaglutide is a 31-residue peptide with a C-18 fatty diacid on a linker. Tirzepatide is a
          39-amino-acid dual agonist. Retatrutide adds a C-20 fatty diacid to a 39-residue backbone. A UV
          absorbance number alone will not catch a truncated sequence, a missing side chain, or an aggregate
          that still looks "pure" on a crude chromatogram.
        </p>
        <p className="leading-relaxed text-[#475569]">
          Ask for an HPLC purity trace at the lot level (aim for &ge;99% area under curve), mass spectrometry
          identity within a few ppm of the theoretical mass, and a COA tied to the vial you receive, not a
          stock PDF from another run. Prefer lyophilized powder over pre-dissolved liquid for shelf life.
        </p>
        <p className="leading-relaxed text-[#475569]">
          Tetrava ships GLP-1 research peptides lyophilized with{" "}
          <Link href="/coa-library" className="text-[#0D9488] hover:underline">
            lot-linked COA
          </Link>{" "}
          files that include HPLC-MS data. Read the batch record before you lock an experimental design.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#0F172A]">
          Where to buy GLP-1 research peptides online
        </h2>
        <p className="leading-relaxed text-[#475569]">
          If the query is "GLP-1 research peptides where to buy" or "where to buy online," the useful filter
          is documentation, not a discount code. Confirm the compound name and strength match your protocol,
          open the COA for that lot, check cold-chain shipping, and keep the order for research use only.
        </p>
        <p className="leading-relaxed text-[#475569]">
          This catalogue lists GLP-1 research peptides for sale as RUO reagents. They are not for human
          consumption, diagnosis, or therapy. Browse the products above for semaglutide, tirzepatide, and
          related incretin compounds, then cross-check purity in the{" "}
          <Link href="/coa-library" className="text-[#0D9488] hover:underline">
            COA Library
          </Link>
          .
        </p>
      </section>

      <section className="space-y-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
        <h2 className="font-serif text-xl text-[#0F172A]">GLP-1 research compounds at Tetrava</h2>
        <p className="leading-relaxed text-[#475569]">
          All compounds are for <strong>research use only (RUO)</strong>. Not for human consumption,
          diagnosis, or therapy. Semaglutide, tirzepatide, and retatrutide ship lyophilized with lot-linked
          HPLC-MS documentation and cold-chain packaging.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/shop" className="btn-primary text-sm">
            Browse GLP-1 research products
          </Link>
          <Link href="/coa-library" className="btn-secondary text-sm">
            View COA library
          </Link>
        </div>
      </section>

      <section className="space-y-2 border-t border-[#E2E8F0] pt-6 text-xs text-[#94A3B8]">
        <p className="font-medium text-[#475569]">References</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            Semaglutide and tirzepatide efficacy summary.{" "}
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
            GLP-1 agonists in movement disorders and CNS Phase 3 context.{" "}
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
            GLP-1RA pipeline and related indications.{" "}
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
            Jastreboff et al., SURMOUNT-1 (tirzepatide dose response).{" "}
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/35658024/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              PubMed 35658024
            </a>
          </li>
          <li>
            Triple agonism and retatrutide Phase 2 data.{" "}
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
            GLP-1 and neurodegeneration mechanisms.{" "}
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
            Microdosing GLP-1 metabolic study registration.{" "}
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
            STAT News review of microdosing evidence, November 2025.{" "}
            <a
              href="https://www.statnews.com/2025/11/04/microdosing-glp-1-drugs-no-clinical-evidence-effective/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0D9488] hover:underline"
            >
              STAT News
            </a>
          </li>
        </ol>
      </section>
    </article>
  )
}
