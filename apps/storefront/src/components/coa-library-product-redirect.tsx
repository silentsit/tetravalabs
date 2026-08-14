"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  coaLibraryProductPath,
  findCoaLibraryProduct,
  type CoaLibraryProduct
} from "@/lib/coa-library"

export function CoaLibraryProductRedirect({ products }: { products: CoaLibraryProduct[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productParam = searchParams.get("product")?.trim() || ""

  useEffect(() => {
    if (!productParam) return
    const match = findCoaLibraryProduct(products, productParam)
    if (match) router.replace(coaLibraryProductPath(match.parentHandle))
  }, [productParam, products, router])

  return null
}
