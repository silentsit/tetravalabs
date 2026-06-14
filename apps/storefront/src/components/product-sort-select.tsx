import type { ProductSort } from "@/lib/sort-products"
import { PRODUCT_SORT_OPTIONS } from "@/lib/sort-products"

type Props = {
  name?: string
  defaultValue?: ProductSort
  className?: string
}

export function ProductSortSelect({ name = "sort", defaultValue = "featured", className = "" }: Props) {
  return (
    <label className={`block text-xs text-[#64748B] ${className}`}>
      Sort by
      <select name={name} defaultValue={defaultValue} className="input-field mt-1">
        {PRODUCT_SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
