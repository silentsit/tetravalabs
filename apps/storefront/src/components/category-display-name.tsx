function splitCategoryDisplayName(name: string) {
  const match = name.match(/^(.*?)\s+(\([^)]+\))$/)
  if (!match) return { primary: name, consumer: null as string | null }
  return { primary: match[1], consumer: match[2] }
}

type Props = {
  name: string
  consumerClassName?: string
}

export function CategoryDisplayName({
  name,
  consumerClassName = "font-sans text-[0.72em] font-medium tracking-normal text-[#64748B]"
}: Props) {
  const { primary, consumer } = splitCategoryDisplayName(name)
  if (!consumer) return name
  return (
    <>
      {primary} <span className={consumerClassName}>{consumer}</span>
    </>
  )
}
