import { Breadcrumbs } from "@/components/breadcrumbs"
import { PageJsonLd } from "@/components/page-json-ld"

type Props = {
  eyebrow?: string
  title: string
  pathname?: string
  children: React.ReactNode
}

export function LegalPageShell({ eyebrow, title, pathname, children }: Props) {
  return (
    <article className="page-container mx-auto max-w-3xl space-y-8 pt-8 pb-20">
      {pathname ? <PageJsonLd pathname={pathname} /> : null}
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      <div>
        {eyebrow ? <span className="section-label">{eyebrow}</span> : null}
        <h1 className={`font-serif text-3xl text-[#0F172A] sm:text-4xl${eyebrow ? " mt-4" : ""}`}>
          {title}
        </h1>
      </div>
      <div className="space-y-4 text-sm leading-relaxed text-[#475569]">{children}</div>
    </article>
  )
}
