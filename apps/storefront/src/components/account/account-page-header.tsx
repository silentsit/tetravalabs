type Props = {
  title: string
  description?: string
}

export function AccountPageHeader({ title, description }: Props) {
  return (
    <div className="mb-6">
      <h1 className="font-serif text-3xl text-[#0F172A] sm:text-4xl">{title}</h1>
      {description ? <p className="mt-2 text-sm leading-relaxed text-[#475569]">{description}</p> : null}
    </div>
  )
}
