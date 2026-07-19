import Link from "next/link"
import { JsonLd } from "@/components/json-ld"
import { breadcrumbJsonLd } from "@/lib/seo"

export type BreadcrumbItem = {
  label: string
  href?: string
}

type Props = {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: Props) {
  if (!items.length) return null

  return (
    <>
      <JsonLd graph={breadcrumbJsonLd(items)} />
      <nav aria-label="Breadcrumb" className="text-sm text-[#94A3B8]">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-[#0D9488]">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-[#0F172A]" : undefined}>{item.label}</span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
