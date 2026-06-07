export const revalidate = 300

export default function CoaLibraryPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">COA Library</h1>
      <p className="text-[#8A8AA0]">
        Batch-level Certificate of Analysis and HPLC documents should be sourced from R2/S3
        and linked to Medusa variant + batch metadata.
      </p>
    </section>
  )
}
