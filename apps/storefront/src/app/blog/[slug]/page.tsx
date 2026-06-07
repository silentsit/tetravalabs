type Props = { params: Promise<{ slug: string }> }

export const revalidate = 600

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-semibold">Article: {slug}</h1>
      <p className="text-[#8A8AA0]">
        Blog article template with FAQ and related products blocks. Wire this route to Sanity
        data and article schema.
      </p>
    </article>
  )
}
