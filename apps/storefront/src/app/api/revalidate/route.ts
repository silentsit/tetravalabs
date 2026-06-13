import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret")
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const payload = await req.json()
  const handle = payload?.handle as string | undefined
  const category = payload?.category as string | undefined
  const slug = payload?.slug as string | undefined
  const docType = payload?.type as string | undefined

  revalidatePath("/shop")
  revalidateTag("products")

  if (handle) {
    revalidatePath(`/product/${handle}`)
    revalidateTag(`product:${handle}`)
  }

  if (category) {
    revalidatePath(`/category/${category}`)
  }

  if (docType === "researchArticle" || slug) {
    revalidatePath("/blog")
    if (slug) {
      revalidatePath(`/blog/${slug}`)
    }
  }

  return NextResponse.json({ revalidated: true })
}
