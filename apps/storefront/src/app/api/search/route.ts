import { NextResponse } from "next/server"
import { searchProducts } from "@/lib/search"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""
  const results = await searchProducts(q)
  return NextResponse.json({ q, count: results.length, results })
}
