import { NextResponse } from "next/server"
import Medusa from "@medusajs/js-sdk"

type CheckoutItem = {
  variantId: string
  quantity: number
}

type CheckoutBody = {
  email?: string
  firstName?: string
  lastName?: string
  address1?: string
  city?: string
  postalCode?: string
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
  const firstName = body.firstName?.trim() || "Research"
  const lastName = body.lastName?.trim() || "Customer"
  const address1 = body.address1?.trim() || "Laboratory Address"
  const city = body.city?.trim() || "Research City"
  const postalCode = body.postalCode?.trim() || "00000"
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
        { ok: false, message: "No Medusa region configured. Run bootstrap:store on the backend." },
        { status: 503 }
      )
    }

    const { cart: createdCart } = await sdk.store.cart.create({
      region_id: regionId,
      email,
      shipping_address: {
        first_name: firstName,
        last_name: lastName,
        address_1: address1,
        city,
        postal_code: postalCode,
        country_code: country.toLowerCase()
      }
    })

    let cart = createdCart
    for (const item of items) {
      const { cart: updatedCart } = await sdk.store.cart.createLineItem(cart.id, {
        variant_id: item.variantId,
        quantity: item.quantity
      })
      cart = updatedCart
    }

    const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
      cart_id: cart.id
    })

    const shippingOption = shipping_options?.[0]
    if (!shippingOption?.id) {
      return NextResponse.json(
        {
          ok: false,
          message: "No shipping options available for this cart. Run bootstrap:store on Medusa.",
          cart_id: cart.id
        },
        { status: 503 }
      )
    }

    const { cart: cartWithShipping } = await sdk.store.cart.addShippingMethod(cart.id, {
      option_id: shippingOption.id
    })

    const { payment_providers } = await sdk.store.payment.listPaymentProviders({
      region_id: regionId
    })
    const paymentProvider = payment_providers?.[0]?.id || "pp_system_default"

    await sdk.store.payment.initiatePaymentSession(cartWithShipping, {
      provider_id: paymentProvider
    })

    const completion = await sdk.store.cart.complete(cart.id)

    if (completion.type === "cart") {
      return NextResponse.json(
        {
          ok: false,
          message: completion.error?.message || "Unable to complete order",
          cart_id: cart.id
        },
        { status: 422 }
      )
    }

    const order = completion.order
    const total = order.total ?? order.subtotal ?? 0

    return NextResponse.json({
      ok: true,
      order_id: order.id,
      display_id: order.display_id,
      cart_id: cart.id,
      total: typeof total === "number" ? total / 100 : 0,
      source: "medusa"
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Medusa checkout failed"
    return NextResponse.json({ ok: false, message, source: "medusa" }, { status: 503 })
  }
}
