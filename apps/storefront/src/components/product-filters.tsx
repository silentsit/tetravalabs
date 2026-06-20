"use client"

import { useRouter, useSearchParams } from "next/navigation"

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ")
}

const storefrontPills: {
  key: string
  label: string
  matches: string[]
}[] = [
  { key: "all", label: "All Products", matches: [] },
  {
    key: "glp-1",
    label: "GLP-1 Research",
    matches: ["GLP-1 Research", "GLP-1 / Incretin"]
  },
  {
    key: "growth-factors",
    label: "Growth Factors",
    matches: [
      "Growth Factors",
      "BPC-157 / TB500",
      "CJC / Ipamorelin / GHRP",
      "Growth Hormone Axis",
      "Longevity / Thymic / Neuropeptides",
      "Mitochondrial / Metabolic Other",
      "Cosmetic / Copper / Tanning",
      "Vitamins & Injectables",
      "Legacy Catalog"
    ]
  },
  {
    key: "blends",
    label: "Research Blends",
    matches: ["Research Blends", "Blends"]
  },
  {
    key: "supplies",
    label: "Lab Supplies",
    matches: ["Lab Supplies", "Supplies & Reconstitution"]
  }
]

const LEGACY_PILL_ALIASES: Record<string, string> = {
  "glp-1-research": "glp-1",
  "glp-1-incretin": "glp-1",
  "research-blends": "blends",
  "lab-supplies": "supplies",
  "supplies-reconstitution": "supplies"
}

export function isShopPillKey(value: string): boolean {
  return storefrontPills.some((pill) => pill.key === value)
}

export function normalizeShopCategoryPill(category?: string): string | undefined {
  if (!category) return undefined
  if (isShopPillKey(category)) return category
  return LEGACY_PILL_ALIASES[category]
}

export interface FilterableProduct {
  id: string
  handle: string
  title: string
  metadata?: {
    source_category?: string
    [key: string]: unknown
  } | null
  collection?: {
    handle: string
    title: string
  } | null
}

interface ProductFiltersProps {
  products: FilterableProduct[]
  activePill?: string
}

function matchesPill(product: FilterableProduct, pillCategories: string[]): boolean {
  const sourceCategory =
    product.metadata?.source_category || product.collection?.title || ""

  return pillCategories.some(
    (cat) => sourceCategory.toLowerCase() === cat.toLowerCase()
  )
}

export function ProductFilters({ products, activePill = "all" }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const counts: Record<string, number> = { all: products.length }

  for (const pill of storefrontPills) {
    if (pill.key === "all") continue
    counts[pill.key] = products.filter((p) => matchesPill(p, pill.matches)).length
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

export function filterByPill<T extends FilterableProduct>(
  products: T[],
  activePill: string | undefined
): T[] {
  const pillKey = normalizeShopCategoryPill(activePill)
  if (!pillKey || pillKey === "all") return products

  const pill = storefrontPills.find((p) => p.key === pillKey)
  if (!pill || pill.key === "all") return products

  return products.filter((p) => matchesPill(p, pill.matches))
}

export function groupBySourceCategory(
  products: FilterableProduct[]
): Record<string, FilterableProduct[]> {
  const groups: Record<string, FilterableProduct[]> = {}

  for (const product of products) {
    const cat =
      product.metadata?.source_category ||
      product.collection?.title ||
      "Uncategorized"

    if (!groups[cat]) groups[cat] = []
    groups[cat].push(product)
  }

  return groups
}
