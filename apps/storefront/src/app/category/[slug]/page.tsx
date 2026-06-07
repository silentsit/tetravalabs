type Props = { params: Promise<{ slug: string }> }

export const revalidate = 300

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Category: {slug}</h1>
      <p className="text-[#8A8AA0]">
        Category landing is wired for ISR and should render Medusa category data plus
        supporting SEO copy.
      </p>
    </section>
  )
}
