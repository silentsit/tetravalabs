import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { productPath } from "@/lib/compound-product"
import { submitIndexNow } from "@/lib/indexnow"
import { legalPathForType } from "@/lib/sanity"

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret")
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let payload: Record<string, unknown>
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 })
  }

  const handle = payload?.handle as string | undefined
  const category = payload?.category as string | undefined
  const categorySlug = payload?.categorySlug as string | undefined
  const slug = payload?.slug as string | undefined
  const docType = payload?.type as string | undefined
  const legalType = payload?.legalType as string | undefined

  const indexNowPaths: string[] = ["/shop"]

  revalidatePath("/shop")
  revalidateTag("products")
  revalidateTag("sanity")

  if (handle) {
    const path = productPath(handle)
    revalidatePath(path)
    revalidatePath(`/${handle}`)
    revalidatePath(`/product/${handle}`)
    revalidateTag(`product:${handle}`)
    indexNowPaths.push(path)
  }

  const categoryPath = categorySlug || category
  if (categoryPath) {
    revalidatePath(`/category/${categoryPath}`)
    revalidateTag(`sanity:category:${categoryPath}`)
    indexNowPaths.push(`/category/${categoryPath}`)
  }

  if (docType === "researchArticle") {
    revalidatePath("/blog")
    revalidateTag("sanity:blog")
    indexNowPaths.push("/blog")
    if (slug) {
      revalidatePath(`/blog/${slug}`)
      revalidateTag(`sanity:blog:${slug}`)
      indexNowPaths.push(`/blog/${slug}`)
    }
  }

  if (docType === "categorySeoBlock" && categorySlug) {
    revalidatePath(`/category/${categorySlug}`)
    revalidateTag(`sanity:category:${categorySlug}`)
    indexNowPaths.push(`/category/${categorySlug}`)
  }

  if (legalType) {
    const path = legalPathForType(legalType)
    if (path) {
      revalidatePath(path)
      revalidateTag(`sanity:legal:${legalType}`)
      indexNowPaths.push(path)
    }
  }

  const indexNow = await submitIndexNow(indexNowPaths)
  if (!indexNow.ok && !indexNow.skipped) {
    console.warn("[indexnow]", indexNow.message || indexNow.status)
  }

  return NextResponse.json({ revalidated: true, indexNow })
}
