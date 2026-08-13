import { JsonLd } from "@/components/json-ld"
import { resolvePageJsonLd } from "@/lib/json-ld-store"

type Props = {
  pathname: string
}

/**
 * Emits route-specific structured data without making the root layout depend on
 * request headers, which would force every public page into dynamic rendering.
 */
export async function PageJsonLd({ pathname }: Props) {
  const graph = await resolvePageJsonLd(pathname)
  return <JsonLd graph={graph} />
}
