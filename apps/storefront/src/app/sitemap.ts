import type { MetadataRoute } from "next"
import { getSitemapEntriesById, getSitemapIds, toMetadataSitemap } from "@/lib/sitemap-entries"

export const revalidate = 3600

export async function generateSitemaps() {
  return getSitemapIds()
}

export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id
  return toMetadataSitemap(await getSitemapEntriesById(id))
}
