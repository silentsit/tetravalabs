import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { PageJsonLd } from "@/components/page-json-ld"
import { PeptideIdentityIndex } from "@/components/peptide-identity-index"
import {
  CONFUSION_PAIRS,
  FEATURED_PAIR_IDS,
  resolvePeptideIdentityQuery
} from "@/lib/peptide-identity"
import { buildPageMetadata, META_DESCRIPTION_MAX } from "@/lib/seo"

export const revalidate = 3600

const PATH = "/tools/peptide-identity"
const DEFAULT_TITLE = "Peptide identity index"
const DEFAULT_DESCRIPTION =
  "Peptide identity index for research peptides: sequence, CAS, mass, and expected MS ions. Compare two names to see if they are the same molecule. RUO."

type Props = {
  searchParams: Promise<{ a?: string; b?: string; obs?: string }>
}

function featuredPairs() {
  const byKey = new Map(CONFUSION_PAIRS.map((pair) => [`${pair.a}/${pair.b}`, pair]))
  return FEATURED_PAIR_IDS.map((key) => byKey.get(key)).filter(
    (pair): pair is (typeof CONFUSION_PAIRS)[number] => Boolean(pair)
  )
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const left = resolvePeptideIdentityQuery(params.a)
  const right = resolvePeptideIdentityQuery(params.b)

  if (left && right && left.id !== right.id) {
    const title = `${left.name} vs ${right.name} | peptide identity`
    const description =
      `Are ${left.name} and ${right.name} the same molecule? The peptide identity index compares sequence, CAS, and mass for research-use peptides. RUO.`
    return buildPageMetadata({
      title,
      description: description.slice(0, META_DESCRIPTION_MAX),
      path: PATH,
      ogTitle: `${left.name} vs ${right.name}`,
      ogEyebrow: "Peptide identity",
      ogKicker: "Same molecule or not."
    })
  }

  if (left) {
    return buildPageMetadata({
      title: `${left.name} peptide identity`,
      description: `${left.name} in the peptide identity index: sequence, CAS, mass, and expected MS ions for research-use documentation. RUO.`,
      path: PATH,
      ogTitle: `${left.name} identity`,
      ogEyebrow: "Peptide identity",
      ogKicker: "Sequence, CAS, mass."
    })
  }

  return buildPageMetadata({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: PATH,
    ogTitle: "Peptide identity index",
    ogEyebrow: "Lab tools",
    ogKicker: "Same molecule or not."
  })
}

export default async function PeptideIdentityPage({ searchParams }: Props) {
  const params = await searchParams
  const left = resolvePeptideIdentityQuery(params.a)
  const right = resolvePeptideIdentityQuery(params.b)

  return (
    <div className="page-container max-w-5xl space-y-8 py-8 pb-20">
      <PageJsonLd pathname={PATH} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Peptide identity index" }
        ]}
      />

      <header>
        <span className="section-label">Lab tools</span>
        <h1 className="mt-4 font-serif text-4xl text-[#0F172A] md:text-5xl">Peptide identity index</h1>
        <p className="mt-4 max-w-2xl text-[#475569]">
          The peptide identity index tells you whether two names used for{" "}
          <Link href="/" className="text-[#0D9488] hover:text-[#0F766E]">
            research peptides
          </Link>{" "}
          refer to the same molecule. Look up a catalog name, a CAS number, or an alias. Compare a
          second name when a vial, a paper, or a COA uses a different label.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#475569]">
          Mass values computed from sequence are for checking an HPLC-MS report. This page does not
          calculate reconstitution volumes or human doses. Pair it with a lot-linked{" "}
          <Link href="/coa-library" className="text-[#0D9488] hover:text-[#0F766E]">
            Certificate of Analysis
          </Link>{" "}
          and the{" "}
          <Link
            href="/blog/why-manufacturing-source-and-verification-matter-in-research-peptide-quality"
            className="text-[#0D9488] hover:text-[#0F766E]"
          >
            12-point COA audit
          </Link>
          .
        </p>
      </header>

      <PeptideIdentityIndex
        featuredPairs={featuredPairs()}
        initialLeft={left}
        initialRight={right}
        initialObserved={params.obs || null}
      />

      <section className="space-y-3 text-sm leading-relaxed text-[#475569]">
        <h2 className="font-serif text-2xl text-[#0F172A]">How the index decides</h2>
        <p>
          Catalog CAS, formula, and sequence come from Tetrava lot identity tables. Monoisotopic mass
          and expected ions are calculated only when the sequence parses as standard residues plus
          common caps (acetyl, amide, Aib, Nle, pGlu). Heavily modified GLP-1 analogs stay as catalog
          text.
        </p>
        <p>
          TB-500 is the main trap. Supplier tables often reuse the CAS and 4,963 Da mass of
          full-length thymosin beta-4 on a vial whose sequence is Ac-LKKTETQ. This index splits those
          identities on purpose.
        </p>
        <p>
          Research use only. Not for human or veterinary consumption.
        </p>
      </section>
    </div>
  )
}
