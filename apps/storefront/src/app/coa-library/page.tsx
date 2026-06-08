export const revalidate = 300

import { listRecentCoas } from "@/lib/medusa"

export default async function CoaLibraryPage() {
  const docs = await listRecentCoas(100)

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">COA Library</h1>
      <p className="text-[#8A8AA0]">
        Batch-level COA and HPLC documents indexed by variant and batch number.
      </p>
      {docs.length === 0 ? (
        <p className="text-sm text-[#8A8AA0]">No batch documents available yet.</p>
      ) : (
        <ul className="space-y-2">
          {docs.map((doc) => (
            <li key={doc.id} className="rounded border border-white/10 bg-[#0A0A10] p-3 text-sm">
              <p className="text-[#E8E8F0]">
                Batch {doc.batch_number} - {doc.document_type.toUpperCase()}
              </p>
              <p className="text-xs text-[#8A8AA0]">Variant: {doc.variant_id}</p>
              <a
                href={doc.document_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#5EEAD4]"
              >
                Open document
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
