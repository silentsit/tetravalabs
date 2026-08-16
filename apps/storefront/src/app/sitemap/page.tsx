import Link from "next/link"
import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { getHtmlSitemapData, type HtmlSitemapLink } from "@/lib/html-sitemap"
import { buildPageMetadata, webPageJsonLd } from "@/lib/seo"

const META_DESCRIPTION =
  "HTML sitemap of Tetrava Labs: research peptide product pages, categories, Research Hub articles, and policy pages. XML index at /sitemap_index.xml."

export const revalidate = 3600

export const metadata: Metadata = buildPageMetadata({
  title: "Sitemap",
  absoluteTitle: "Sitemap | Tetrava Labs",
  description: META_DESCRIPTION,
  path: "/sitemap",
  registerWebPage: false,
  jsonLd: webPageJsonLd({
    title: "Sitemap",
    description: META_DESCRIPTION,
    path: "/sitemap"
  })
})

function LinkList({ links, columns = false }: { links: HtmlSitemapLink[]; columns?: boolean }) {
  return (
    <ul
      className={
        columns
          ? "columns-1 gap-x-10 sm:columns-2 lg:columns-3 [column-fill:_balance]"
          : "space-y-2"
      }
    >
      {links.map((link) => (
        <li key={link.href} className={columns ? "mb-2 break-inside-avoid" : undefined}>
          <Link href={link.href} className="text-[#0D9488] underline-offset-2 hover:underline">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default async function SitemapPage() {
  const data = await getHtmlSitemapData()

  return (
    <section className="page-container mx-auto max-w-5xl space-y-10 py-8 pb-20">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sitemap" }]} />

      <div>
        <h1 className="font-serif text-4xl text-[#0F172A] md:text-5xl">Sitemap</h1>
        <p className="mt-4 max-w-2xl text-[16px] leading-7 text-[#475569]">
          Every public page on tetravalabs.com, grouped the way the catalog is organized. Search
          engines should use the{" "}
          <Link href="/sitemap_index.xml" className="text-[#0D9488] underline-offset-2 hover:underline">
            XML sitemap index
          </Link>
          . A markdown copy lives at{" "}
          <Link href="/sitemap.md" className="text-[#0D9488] underline-offset-2 hover:underline">
            /sitemap.md
          </Link>
          .
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#0F172A]">Pages</h2>
        <LinkList links={data.pages} columns />
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#0F172A]">Categories</h2>
        <LinkList links={data.categories} />
      </section>

      <section className="space-y-8">
        <h2 className="font-serif text-2xl text-[#0F172A]">Products by category</h2>
        {data.productsByCategory.map((group) => (
          <div key={group.heading} className="space-y-3">
            <h3 className="font-serif text-lg text-[#0F172A]">
              {group.href ? (
                <Link href={group.href} className="text-[#0F172A] underline-offset-2 hover:underline">
                  {group.heading}
                </Link>
              ) : (
                group.heading
              )}
            </h3>
            <LinkList links={group.links} columns />
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#0F172A]">Research Hub</h2>
        {data.posts.length ? (
          <LinkList links={data.posts} />
        ) : (
          <p className="text-[16px] leading-7 text-[#475569]">
            No published Research Hub articles right now. See the{" "}
            <Link href="/blog" className="text-[#0D9488] underline-offset-2 hover:underline">
              Research Hub
            </Link>
            .
          </p>
        )}
      </section>
    </section>
  )
}
