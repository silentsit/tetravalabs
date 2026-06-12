import { Breadcrumbs } from "@/components/breadcrumbs"

type Props = {
  eyebrow: string
  title: string
  children: React.ReactNode
}

export function LegalPageShell({ eyebrow, title, children }: Props) {
  return (
    <article className="page-container mx-auto max-w-3xl space-y-8 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      <div>
        <span className="section-label">{eyebrow}</span>
        <h1 className="mt-4 font-serif text-4xl text-[#0F172A]">{title}</h1>
      </div>
      <div className="space-y-4 text-sm leading-relaxed text-[#475569]">{children}</div>
    </article>
  )
}
