"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
  className?: string
  placeholder?: string
}

export function SearchBar({
  className = "",
  placeholder = "Search compounds, CAS, sequence..."
}: Props) {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = query.trim()
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search")
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#050508] px-3 py-1.5 transition focus-within:border-[#5EEAD4]/40">
        <span className="text-xs text-[#8A8AA0]" aria-hidden="true">
          ⌕
        </span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          aria-label="Search catalog"
          className="w-full min-w-[10rem] bg-transparent text-sm text-[#E8E8F0] outline-none placeholder:text-[#8A8AA0] sm:min-w-[12rem]"
        />
      </div>
    </form>
  )
}
