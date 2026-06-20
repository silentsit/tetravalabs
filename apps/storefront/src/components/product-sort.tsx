"use client"

import { useRouter, useSearchParams } from "next/navigation"

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "name-desc", label: "Name: Z–A" }
]

interface ProductSortProps {
  currentSort?: string
}

export function ProductSort({ currentSort = "featured" }: ProductSortProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === "featured") {
      params.delete("sort")
    } else {
      params.set("sort", value)
    }

    router.push(`/shop?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="shop-sort" className="hidden text-sm text-[#64748B] sm:inline">
        Sort by
      </label>
      <select
        id="shop-sort"
        value={currentSort}
        onChange={(e) => handleSort(e.target.value)}
        className="rounded-lg border border-[#E2E8F0] bg-white py-2 pl-3 pr-8 text-sm text-[#0F172A] shadow-sm focus:border-[#0D9488] focus:outline-none focus:ring-1 focus:ring-[#0D9488]"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
