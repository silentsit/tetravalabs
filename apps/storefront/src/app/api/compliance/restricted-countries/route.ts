import { NextResponse } from "next/server"
import { getRestrictedCountries } from "@/lib/shipping-compliance"

export async function GET() {
  return NextResponse.json({
    ok: true,
    countries: getRestrictedCountries()
  })
}
