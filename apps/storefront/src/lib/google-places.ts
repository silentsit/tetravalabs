export type ParsedAddress = {
  address1: string
  city: string
  province: string
  postalCode: string
  country: string
}

type AddressComponent = {
  long_name: string
  short_name: string
  types: string[]
}

type PlaceResult = {
  address_components?: AddressComponent[]
}

let placesLoader: Promise<void> | null = null

export function isGooglePlacesConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY?.trim())
}

export function loadGooglePlaces(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve()

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY?.trim()
  if (!apiKey) return Promise.reject(new Error("Google Places API key is not configured"))

  const googleMaps = (window as Window & { google?: { maps?: { places?: unknown } } }).google
  if (googleMaps?.maps?.places) return Promise.resolve()

  if (placesLoader) return placesLoader

  placesLoader = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-places="true"]')
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true })
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Places")), {
        once: true
      })
      return
    }

    const script = document.createElement("script")
    script.dataset.googlePlaces = "true"
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load Google Places"))
    document.head.appendChild(script)
  })

  return placesLoader
}

function component(components: AddressComponent[], type: string) {
  return components.find((entry) => entry.types.includes(type))
}

export function parseGoogleAddressComponents(components: AddressComponent[]): ParsedAddress {
  const streetNumber = component(components, "street_number")?.long_name ?? ""
  const route = component(components, "route")?.long_name ?? ""
  const subpremise = component(components, "subpremise")?.long_name ?? ""
  const city =
    component(components, "locality")?.long_name ??
    component(components, "postal_town")?.long_name ??
    component(components, "administrative_area_level_2")?.long_name ??
    ""
  const province = component(components, "administrative_area_level_1")?.short_name ?? ""
  const postalCode = component(components, "postal_code")?.long_name ?? ""
  const country = component(components, "country")?.short_name ?? ""

  const line1 = [streetNumber, route].filter(Boolean).join(" ").trim()

  return {
    address1: line1 || subpremise,
    city,
    province,
    postalCode,
    country
  }
}

export function parsePlaceResult(place: PlaceResult): ParsedAddress | null {
  if (!place.address_components?.length) return null
  return parseGoogleAddressComponents(place.address_components)
}
