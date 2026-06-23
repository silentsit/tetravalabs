import { NextResponse } from "next/server"

type NominatimResult = {
  display_name: string
  address?: {
    house_number?: string
    road?: string
    city?: string
    town?: string
    village?: string
    hamlet?: string
    state?: string
    postcode?: string
    country_code?: string
  }
}

function parseNominatimResult(result: NominatimResult) {
  const address = result.address ?? {}
  const line1 = [address.house_number, address.road].filter(Boolean).join(" ").trim()
  const city = address.city ?? address.town ?? address.village ?? address.hamlet ?? ""
  const province = address.state ?? ""
  const postalCode = address.postcode ?? ""
  const country = address.country_code?.toUpperCase() ?? ""

  return {
    label: result.display_name,
    address1: line1 || result.display_name.split(",")[0]?.trim() || "",
    city,
    province,
    postalCode,
    country
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")?.trim() ?? ""
  const country = searchParams.get("country")?.trim().toLowerCase() ?? ""

  if (query.length < 3) {
    return NextResponse.json({ ok: true, suggestions: [] })
  }

  const params = new URLSearchParams({
    q: query,
    format: "json",
    addressdetails: "1",
    limit: "5"
  })
  if (country) params.set("countrycodes", country)

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "TetravaLabs-Checkout/1.0 (support@tetravalabs.com)"
      },
      next: { revalidate: 0 }
    })

    if (!response.ok) {
      return NextResponse.json({ ok: false, suggestions: [] }, { status: 502 })
    }

    const results = (await response.json()) as NominatimResult[]
    const suggestions = results.map(parseNominatimResult).filter((entry) => entry.address1)

    return NextResponse.json({ ok: true, suggestions })
  } catch {
    return NextResponse.json({ ok: false, suggestions: [] }, { status: 502 })
  }
}
