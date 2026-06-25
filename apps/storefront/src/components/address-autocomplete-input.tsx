"use client"

import { useEffect, useRef, useState } from "react"
import {
  isGooglePlacesConfigured,
  loadGooglePlaces,
  parsePlaceResult,
  type ParsedAddress
} from "@/lib/google-places"

type GoogleAutocomplete = {
  addListener: (event: string, handler: () => void) => void
  setComponentRestrictions: (restrictions: { country: string | string[] }) => void
  getPlace: () => { address_components?: Array<{ long_name: string; short_name: string; types: string[] }> }
}

type Suggestion = ParsedAddress & { label: string }

type Props = {
  id: string
  value: string
  onChange: (value: string) => void
  onAddressSelect: (address: ParsedAddress) => void
  countryCode?: string
  required?: boolean
  placeholder?: string
  className?: string
  onBlur?: () => void
  invalid?: boolean
  errorId?: string
}

export function AddressAutocompleteInput({
  id,
  value,
  onChange,
  onAddressSelect,
  countryCode,
  required,
  placeholder,
  className = "input-field",
  onBlur,
  invalid = false,
  errorId
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<GoogleAutocomplete | null>(null)
  const onChangeRef = useRef(onChange)
  const onAddressSelectRef = useRef(onAddressSelect)
  const [autocompleteReady, setAutocompleteReady] = useState(false)
  const [autocompleteFailed, setAutocompleteFailed] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [suggestOpen, setSuggestOpen] = useState(false)
  const [suggestLoading, setSuggestLoading] = useState(false)
  const useGoogle = isGooglePlacesConfigured()

  useEffect(() => {
    onChangeRef.current = onChange
    onAddressSelectRef.current = onAddressSelect
  }, [onChange, onAddressSelect])

  useEffect(() => {
    if (!useGoogle || !inputRef.current) return

    let cancelled = false

    void loadGooglePlaces()
      .then(() => {
        if (cancelled || !inputRef.current) return

        const googleMaps = (
          window as Window & {
            google?: {
              maps?: {
                places?: {
                  Autocomplete: new (
                    input: HTMLInputElement,
                    options?: { types?: string[]; fields?: string[] }
                  ) => GoogleAutocomplete
                }
              }
            }
          }
        ).google

        const Autocomplete = googleMaps?.maps?.places?.Autocomplete
        if (!Autocomplete) {
          setAutocompleteFailed(true)
          return
        }

        const instance = new Autocomplete(inputRef.current, {
          types: ["address"],
          fields: ["address_components"]
        })

        instance.addListener("place_changed", () => {
          const parsed = parsePlaceResult(instance.getPlace())
          if (!parsed) return
          onChangeRef.current(parsed.address1)
          onAddressSelectRef.current(parsed)
          setSuggestOpen(false)
        })

        autocompleteRef.current = instance
        setAutocompleteReady(true)
      })
      .catch(() => {
        if (!cancelled) setAutocompleteFailed(true)
      })

    return () => {
      cancelled = true
      autocompleteRef.current = null
    }
  }, [useGoogle])

  useEffect(() => {
    if (!autocompleteReady || !autocompleteRef.current || !countryCode) return
    autocompleteRef.current.setComponentRestrictions({ country: countryCode.toLowerCase() })
  }, [autocompleteReady, countryCode])

  useEffect(() => {
    if (useGoogle || value.trim().length < 3) {
      setSuggestions([])
      setSuggestOpen(false)
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      setSuggestLoading(true)
      const params = new URLSearchParams({ q: value.trim() })
      if (countryCode) params.set("country", countryCode)

      void fetch(`/api/address-suggest?${params.toString()}`, { signal: controller.signal })
        .then((response) => response.json())
        .then((data) => {
          const nextSuggestions = Array.isArray(data?.suggestions) ? (data.suggestions as Suggestion[]) : []
          setSuggestions(nextSuggestions)
          setSuggestOpen(nextSuggestions.length > 0)
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setSuggestions([])
            setSuggestOpen(false)
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setSuggestLoading(false)
        })
    }, 300)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [countryCode, useGoogle, value])

  const pickSuggestion = (suggestion: Suggestion) => {
    onChange(suggestion.address1)
    onAddressSelect({
      address1: suggestion.address1,
      city: suggestion.city,
      province: suggestion.province,
      postalCode: suggestion.postalCode,
      country: suggestion.country
    })
    setSuggestions([])
    setSuggestOpen(false)
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        required={required}
        autoComplete="address-line1"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => {
          if (!useGoogle && suggestions.length) setSuggestOpen(true)
        }}
        onBlur={() => {
          onBlur?.()
          window.setTimeout(() => setSuggestOpen(false), 150)
        }}
        className={className}
        aria-autocomplete="list"
        aria-expanded={suggestOpen}
        aria-controls={`${id}-suggestions`}
        aria-invalid={invalid}
        aria-describedby={invalid && errorId ? errorId : undefined}
      />

      {!useGoogle && suggestOpen ? (
        <ul
          id={`${id}-suggestions`}
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-[#E2E8F0] bg-white py-1 shadow-lg"
          role="listbox"
        >
          {suggestions.map((suggestion) => (
            <li key={suggestion.label} role="option">
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm text-[#334155] hover:bg-[#F8FAFC]"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pickSuggestion(suggestion)}
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {useGoogle && autocompleteReady ? (
        <p className="mt-1.5 text-xs text-[#94A3B8]">Start typing for address suggestions.</p>
      ) : null}
      {!useGoogle && !suggestLoading ? (
        <p className="mt-1.5 text-xs text-[#94A3B8]">Start typing for address suggestions.</p>
      ) : null}
      {useGoogle && autocompleteFailed ? (
        <p className="mt-1.5 text-xs text-[#94A3B8]">Address suggestions unavailable. Enter manually.</p>
      ) : null}
    </div>
  )
}
