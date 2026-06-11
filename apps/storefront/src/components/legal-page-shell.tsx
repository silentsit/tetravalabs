import { Breadcrumbs } from "@/components/breadcrumbs"

type Props = {
  eyebrow: string
  title: string
  children: React.ReactNode
}

export function LegalPageShell({ eyebrow, title, children }: Props) {
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-4xl text-[#E8E8F0]">{title}</h1>
      </div>
      {children}
    </article>
  )
}
