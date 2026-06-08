import { NextResponse } from "next/server"
import Medusa from "@medusajs/js-sdk"

type CheckoutItem = {
  variantId: string
  quantity: number
}

type CheckoutBody = {
  email?: string
  country?: string
  items?: CheckoutItem[]
}

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

function createSdk() {
  return new Medusa({
    baseUrl: MEDUSA_URL,
    publishableKey: PUBLISHABLE_KEY
  })
}

export async function POST(req: Request) {
  const body = (await req.json()) as CheckoutBody
  const email = body.email?.trim()
  const country = body.country?.trim().toUpperCase()
  const items = body.items || []

  if (!email || !country || !items.length) {
    return NextResponse.json(
      { ok: false, message: "email, country, and items are required" },
      { status: 400 }
    )
  }

  try {
    const sdk = createSdk()
    const { regions } = await sdk.store.region.list()
    const regionId = regions?.[0]?.id

    if (!regionId) {
      return NextResponse.json(
        { ok: false, message: "No Medusa region configured" },
        { status: 503 }
      )
    }

    const { cart } = await sdk.store.cart.create({
      region_id: regionId,
      email,
      shipping_address: {
        country_code: country.toLowerCase()
      }
    })

    for (const item of items) {
      await sdk.store.cart.createLineItem(cart.id, {
        variant_id: item.variantId,
        quantity: item.quantity
      })
    }

    return NextResponse.json({
      ok: true,
      order_id: cart.id,
      cart_id: cart.id,
      source: "medusa"
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Medusa checkout failed"
    return NextResponse.json({ ok: false, message, source: "fallback" }, { status: 503 })
  }
}
