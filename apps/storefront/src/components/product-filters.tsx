import Link from "next/link"
import { CategoryDisplayName } from "@/components/category-display-name"
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
  const counts: Record<string, number> = { all: products.length }

  for (const pill of storefrontPills) {
    if (pill.key === "all") continue
    counts[pill.key] = filterByPill(products, pill.key).length
  }

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-hide">
      {storefrontPills.map((pill) => {
        const isActive =
          pill.key === "all"
            ? !activePill || activePill === "all"
            : activePill === pill.key
        const href = pill.key === "all" ? "/shop" : `/category/${pill.key}`

        return (
          <Link
            key={pill.key}
            href={href}
            className={cn(
              "relative min-h-11 max-w-[16rem] flex-shrink-0 whitespace-normal rounded-full px-4 py-2.5 text-center text-sm font-medium leading-snug transition-all duration-200",
              isActive
                ? "bg-[#0F172A] text-white shadow-sm"
                : "bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
            )}
          >
            <CategoryDisplayName
              name={pill.label}
              consumerClassName={
                isActive
                  ? "font-sans text-[0.85em] font-medium tracking-normal text-[#CBD5E1]"
                  : "font-sans text-[0.85em] font-medium tracking-normal text-[#94A3B8]"
              }
            />
            <span
              className={cn(
                "ml-1.5 text-xs",
                isActive ? "text-[#CBD5E1]" : "text-[#94A3B8]"
              )}
            >
              {counts[pill.key] ?? 0}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
