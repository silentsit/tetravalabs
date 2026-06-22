"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  filterByPill,
  storefrontPills,
  type FilterableProduct
} from "@/lib/shop-filters"

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ")
}

interface ProductFiltersProps {
  products: FilterableProduct[]
  activePill?: string
}

export function ProductFilters({ products, activePill = "all" }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const counts: Record<string, number> = { all: products.length }

  for (const pill of storefrontPills) {
    if (pill.key === "all") continue
    counts[pill.key] = filterByPill(products, pill.key).length
  }

  const handlePillClick = (key: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (key === "all") {
      params.delete("category")
    } else {
      params.set("category", key)
    }

    params.delete("page")
    router.push(`/shop?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide">
      {storefrontPills.map((pill) => {
        const isActive =
          pill.key === "all"
            ? !activePill || activePill === "all"
            : activePill === pill.key

        return (
          <button
            key={pill.key}
            type="button"
            onClick={() => handlePillClick(pill.key)}
            className={cn(
              "relative flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-[#0F172A] text-white shadow-sm"
                : "bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
            )}
          >
            {pill.label}
            <span
              className={cn(
                "ml-1.5 text-xs",
                isActive ? "text-[#CBD5E1]" : "text-[#94A3B8]"
              )}
            >
              {counts[pill.key] ?? 0}
            </span>
          </button>
        )
      })}
    </div>
  )
}
