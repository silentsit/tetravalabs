type JsonLdGraph = Record<string, unknown>

type Props = {
  graph: JsonLdGraph | JsonLdGraph[]
}

function serializeJsonLd(data: JsonLdGraph) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

/** Renders JSON-LD `<script>` tags for injection in `<head>`. */
export function JsonLd({ graph }: Props) {
  const graphs = Array.isArray(graph) ? graph : [graph]
  if (graphs.length === 0) return null

  return (
    <>
      {graphs.map((item, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(item) }}
        />
      ))}
    </>
  )
}
