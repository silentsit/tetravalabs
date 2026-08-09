type TableRow = {
  cells?: string[] | null
}

export type BlogTableValue = {
  caption?: string | null
  hasHeaderRow?: boolean | null
  rows?: TableRow[] | null
}

export function BlogTable({ value }: { value: BlogTableValue }) {
  const rows = (value.rows || [])
    .map((row) => (row?.cells || []).map((cell) => cell?.trim() || ""))
    .filter((cells) => cells.some(Boolean))

  if (!rows.length) return null

  const columnCount = Math.max(...rows.map((cells) => cells.length), 1)
  const normalizedRows = rows.map((cells) => {
    const padded = [...cells]
    while (padded.length < columnCount) padded.push("")
    return padded
  })

  const hasHeader = value.hasHeaderRow !== false && normalizedRows.length > 1
  const header = hasHeader ? normalizedRows[0] : null
  const bodyRows = hasHeader ? normalizedRows.slice(1) : normalizedRows

  return (
    <figure className="my-8 overflow-x-auto">
      {value.caption?.trim() ? (
        <figcaption className="mb-3 font-serif text-lg text-[#0F172A]">{value.caption.trim()}</figcaption>
      ) : null}
      <table className="min-w-full border-collapse text-sm text-[#475569]">
        {header ? (
          <thead>
            <tr className="border-b border-[#CBD5E1] bg-[#F8FAFC]">
              {header.map((cell, index) => (
                <th
                  key={`${cell}-${index}`}
                  scope="col"
                  className="px-4 py-3 text-left font-semibold text-[#0F172A]"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {bodyRows.map((cells, rowIndex) => (
            <tr key={cells.join("|") || rowIndex} className="border-b border-[#E2E8F0] last:border-b-0">
              {cells.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="px-4 py-3 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
