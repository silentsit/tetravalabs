"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react"
import { ArrowLeftRight, Check, Copy, Search, X } from "lucide-react"
import {
  comparePeptideIdentities,
  confusedWith,
  formatMass,
  formatMz,
  ionLabel,
  observedMassSummary,
  searchPeptideIdentities,
  type ConfusionPair,
  type PeptideIdentity
} from "@/lib/peptide-identity"

type Props = {
  featuredPairs: ConfusionPair[]
  initialLeft: PeptideIdentity | null
  initialRight: PeptideIdentity | null
  initialObserved?: string | null
}

function kindLabel(kind: PeptideIdentity["kind"]): string {
  if (kind === "small-molecule") return "Small molecule"
  if (kind === "reference") return "Reference identity"
  if (kind === "blend") return "Mixture"
  if (kind === "solvent") return "Lab supply"
  if (kind === "mixture") return "Mixture"
  return "Peptide"
}

function IdentityPicker({
  label,
  selected,
  onSelect,
  excludeId
}: {
  label: string
  selected: PeptideIdentity | null
  onSelect: (identity: PeptideIdentity | null) => void
  excludeId?: string | null
}) {
  const listId = useId()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const results = useMemo(
    () => searchPeptideIdentities(query, 10).filter((item) => item.id !== excludeId),
    [query, excludeId]
  )

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onPointer)
    return () => document.removeEventListener("mousedown", onPointer)
  }, [])

  return (
    <div ref={rootRef} className="relative">
      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#64748B]">
        {label}
      </label>
      {selected ? (
        <div className="flex h-12 items-center justify-between gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#0F172A]">{selected.name}</p>
            <p className="truncate font-mono text-[11px] text-[#94A3B8]">
              {selected.casNumber ||
                (selected.computed ? `${formatMass(selected.computed.averageDa)} Da` : kindLabel(selected.kind))}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-[#64748B] hover:text-[#0F172A]"
            aria-label={`Clear ${label}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="search"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            value={query}
            placeholder="Name, CAS, alias, or sequence"
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            className="input-field pl-10"
          />
        </div>
      )}
      {open && !selected && query.trim() ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-[#E2E8F0] bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
        >
          {results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-[#64748B]">No identity matches that query.</li>
          ) : (
            results.map((item) => (
              <li key={item.id} role="option">
                <button
                  type="button"
                  className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-[#F8FAFC]"
                  onClick={() => {
                    onSelect(item)
                    setQuery("")
                    setOpen(false)
                  }}
                >
                  <span className="text-sm font-medium text-[#0F172A]">{item.name}</span>
                  <span className="font-mono text-[11px] text-[#94A3B8]">
                    {[item.casNumber, kindLabel(item.kind)].filter(Boolean).join(" · ")}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  )
}

function SpecRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-3 border-t border-[#E2E8F0] py-2 first:border-t-0 first:pt-0 sm:grid-cols-[9rem_1fr]">
      <dt className="text-xs uppercase tracking-wider text-[#94A3B8]">{label}</dt>
      <dd className="min-w-0 break-words font-mono text-sm text-[#0F172A]">{children}</dd>
    </div>
  )
}

function IdentityCard({
  identity,
  observed
}: {
  identity: PeptideIdentity
  observed?: number | null
}) {
  const related = confusedWith(identity)

  return (
    <article className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="section-label">{kindLabel(identity.kind)}</p>
          <p className="mt-2 font-serif text-2xl text-[#0F172A]">{identity.name}</p>
        </div>
        {identity.inCatalog && identity.shopPath ? (
          <Link href={identity.shopPath} className="btn-secondary px-3 py-2 text-sm">
            View specs
          </Link>
        ) : (
          <span className="rounded-full border border-[#E2E8F0] px-2.5 py-1 text-xs text-[#64748B]">
            Not in catalog
          </span>
        )}
      </div>

      {identity.note ? (
        <p className="mt-4 text-sm leading-relaxed text-[#475569]">{identity.note}</p>
      ) : null}

      <dl className="mt-5">
        <SpecRow label="CAS">{identity.casNumber || "Not assigned to this listing"}</SpecRow>
        <SpecRow label="Formula">{identity.formula || "—"}</SpecRow>
        <SpecRow label="Catalog mass">
          {identity.catalogMassDa
            ? `${formatMass(identity.catalogMassDa)} Da`
            : identity.catalogMassLabel || "—"}
        </SpecRow>
        <SpecRow label="Sequence avg">
          {identity.computed ? `${formatMass(identity.computed.averageDa)} Da` : "Not computed"}
        </SpecRow>
        <SpecRow label="Monoisotopic">
          {identity.computed ? `${formatMass(identity.computed.monoisotopicDa, 4)} Da` : "Not computed"}
        </SpecRow>
        <SpecRow label="Sequence">{identity.sequence || "—"}</SpecRow>
      </dl>

      {identity.computed?.notes.length ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-[#64748B]">
          {identity.computed.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}

      {identity.ions.length ? (
        <div className="mt-5">
          <p className="text-xs uppercase tracking-wider text-[#94A3B8]">Expected ions</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {identity.ions.map((ion) => (
              <div key={ion.charge} className="rounded-lg bg-[#F8FAFC] px-3 py-2">
                <p className="font-mono text-[11px] text-[#94A3B8]">{ionLabel(ion.charge)}</p>
                <p className="font-mono text-sm text-[#0F172A]">{formatMz(ion.mz)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-[#64748B]">
          {identity.kind === "peptide"
            ? "Sequence notation is too modified to compute ions here. Use the catalog mass and the COA report together."
            : "No sequence-derived ions for this entry. Compare the catalog mass to the COA report."}
        </p>
      )}

      {observed ? (
        <p className="mt-4 text-sm text-[#0F172A]">{observedMassSummary(identity, observed)}</p>
      ) : null}

      {identity.presentations.length ? (
        <div className="mt-5">
          <p className="text-xs uppercase tracking-wider text-[#94A3B8]">Presentations</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {identity.presentations.map((item) =>
              item.shopPath ? (
                <li key={item.handle}>
                  <Link
                    href={item.shopPath}
                    className="inline-flex rounded-full border border-[#E2E8F0] px-3 py-1 text-xs text-[#475569] hover:border-[#0D9488] hover:text-[#0D9488]"
                  >
                    {item.label}
                  </Link>
                </li>
              ) : (
                <li
                  key={item.handle}
                  className="rounded-full border border-[#E2E8F0] px-3 py-1 text-xs text-[#475569]"
                >
                  {item.label}
                </li>
              )
            )}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {identity.coaPath && identity.inCatalog ? (
          <Link href={identity.coaPath} className="text-[#0D9488] hover:text-[#0F766E]">
            COA documents
          </Link>
        ) : null}
        {identity.pubchemCid ? (
          <a
            href={`https://pubchem.ncbi.nlm.nih.gov/compound/${identity.pubchemCid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:text-[#0F766E]"
          >
            PubChem CID {identity.pubchemCid}
          </a>
        ) : identity.casNumber ? (
          <a
            href={`https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(identity.casNumber)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] hover:text-[#0F766E]"
          >
            PubChem CAS search
          </a>
        ) : null}
      </div>

      {related.length ? (
        <div className="mt-5">
          <p className="text-xs uppercase tracking-wider text-[#94A3B8]">Often confused with</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {related.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/tools/peptide-identity?a=${encodeURIComponent(identity.id)}&b=${encodeURIComponent(item.id)}`}
                  className="inline-flex rounded-full bg-[#F1F5F9] px-3 py-1 text-xs text-[#334155] hover:bg-[#E2E8F0]"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  )
}

export function PeptideIdentityIndex({
  featuredPairs,
  initialLeft,
  initialRight,
  initialObserved
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [left, setLeft] = useState<PeptideIdentity | null>(initialLeft)
  const [right, setRight] = useState<PeptideIdentity | null>(initialRight)
  const [observedInput, setObservedInput] = useState(initialObserved || "")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setLeft(initialLeft)
    setRight(initialRight)
    // Re-sync when the shareable query changes, not when the server reprints the same objects.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- identity objects are recreated each render
  }, [initialLeft?.id, initialRight?.id])

  const observed = Number(observedInput)
  const observedValue = Number.isFinite(observed) && observed > 0 ? observed : null

  useEffect(() => {
    const params = new URLSearchParams()
    if (left) params.set("a", left.id)
    if (right) params.set("b", right.id)
    if (observedValue) params.set("obs", String(observedValue))
    const query = params.toString()
    const next = query ? `${pathname}?${query}` : pathname
    const current = `${pathname}${window.location.search}`
    if (current !== next) router.replace(next, { scroll: false })
  }, [left, right, observedValue, pathname, router])

  const verdict = left && right ? comparePeptideIdentities(left, right) : null

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="card p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <IdentityPicker label="Compound A" selected={left} onSelect={setLeft} excludeId={right?.id} />
          <button
            type="button"
            className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#475569] hover:border-[#0D9488] hover:text-[#0D9488]"
            aria-label="Swap compounds"
            onClick={() => {
              setLeft(right)
              setRight(left)
            }}
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
          <IdentityPicker label="Compound B" selected={right} onSelect={setRight} excludeId={left?.id} />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label htmlFor="observed-mass" className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#64748B]">
              Observed mass from a COA
            </label>
            <input
              id="observed-mass"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.0001"
              placeholder="Optional. Average Da or m/z"
              value={observedInput}
              onChange={(event) => setObservedInput(event.target.value)}
              className="input-field"
            />
          </div>
          <button type="button" onClick={copyLink} className="btn-secondary inline-flex items-center justify-center gap-2 px-4">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      </div>

      {!left && !right ? (
        <section>
          <h2 className="font-serif text-2xl text-[#0F172A]">Often confused pairs</h2>
          <p className="mt-2 max-w-2xl text-sm text-[#475569]">
            These are the name collisions that show up in papers, forums, and supplier tables.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {featuredPairs.map((pair) => (
              <li key={`${pair.a}-${pair.b}`}>
                <Link
                  href={`/tools/peptide-identity?a=${encodeURIComponent(pair.a)}&b=${encodeURIComponent(pair.b)}`}
                  className="card card-hover block p-4"
                >
                  <p className="font-medium text-[#0F172A]">{pair.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">{pair.blurb}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {verdict ? (
        <section
          className={`rounded-xl border px-5 py-4 sm:px-6 ${
            verdict.status === "not-same"
              ? "border-[#E2E8F0] bg-white"
              : "border-[#99F6E4]/80 bg-[#F0FDFA]"
          }`}
        >
          <h2 className="font-serif text-2xl text-[#0F172A]">{verdict.headline}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#475569]">{verdict.reason}</p>
        </section>
      ) : null}

      {left || right ? (
        <section className={`grid gap-5 ${left && right ? "lg:grid-cols-2" : ""}`}>
          {left ? <IdentityCard identity={left} observed={observedValue} /> : null}
          {right ? <IdentityCard identity={right} observed={observedValue} /> : null}
        </section>
      ) : null}
    </div>
  )
}
