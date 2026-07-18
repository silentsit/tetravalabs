import { NextResponse } from "next/server"
import Medusa from "@medusajs/js-sdk"
import { isRestrictedCountry } from "@/lib/shipping-compliance"
import { resolveShippingUsd } from "@/lib/checkout-shipping"
import { createCryptoPaymentIntent } from "@/lib/medusa-crypto-checkout"
import { createPeptidepayPaymentIntent } from "@/lib/medusa-peptidepay-checkout"
import { buildPeptidepayProductName } from "@/lib/product-sku"
import { sendOrderConfirmationEmail, type OrderEmailItem } from "@/lib/send-order-confirmation"

type CheckoutItem = {
  variantId: string
  quantity: number
  handle?: string
  title?: string
  variantTitle?: string
  unitPrice?: number
}

type CheckoutBody = {
  email?: string
  firstName?: string
  lastName?: string
  company?: string
  address1?: string
  address2?: string
  city?: string
  province?: string
  postalCode?: string
  phone?: string
  country?: string
  orderNotes?: string
  payment_method?: "card" | "crypto"
  crypto_asset?: string
  items?: CheckoutItem[]
}

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

function createSdk(authToken?: string | null) {
  return new Medusa({
    baseUrl: MEDUSA_URL,
    publishableKey: PUBLISHABLE_KEY,
    globalHeaders: authToken ? { Authorization: `Bearer ${authToken}` } : {}
  })
}

export async function POST(req: Request) {
  const authToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || null
  const body = (await req.json()) as CheckoutBody
  const email = body.email?.trim()
  const firstName = body.firstName?.trim() || "Research"
  const lastName = body.lastName?.trim() || "Customer"
  const company = body.company?.trim() || undefined
  const address1 = body.address1?.trim() || "Laboratory Address"
  const address2 = body.address2?.trim() || undefined
  const city = body.city?.trim() || "Research City"
  const province = body.province?.trim() || undefined
  const postalCode = body.postalCode?.trim() || "00000"
  const phone = body.phone?.trim() || undefined
  const country = body.country?.trim().toUpperCase()
  const items = body.items || []

  if (!email || !country || !items.length) {
    return NextResponse.json(
      { ok: false, message: "email, country, and items are required" },
      { status: 400 }
    )
  }

  if (isRestrictedCountry(country)) {
    return NextResponse.json(
      {
        ok: false,
        message: `Shipping to ${country} is restricted under our research compliance policy.`,
        code: "shipping_restricted"
      },
      { status: 403 }
    )
  }

  try {
    const sdk = createSdk(authToken)
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
        company,
        address_1: address1,
        address_2: address2,
        city,
        province,
        postal_code: postalCode,
        phone,
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

    const shippingTotal =
      cartWithShipping.shipping_total ??
      shippingOption.amount ??
      shippingOption.prices?.[0]?.amount ??
      1500

    const { payment_providers } = await sdk.store.payment.listPaymentProviders({
      region_id: regionId
    })
    const medusaPaymentProviderId = payment_providers?.[0]?.id || "pp_system_default"

    await sdk.store.payment.initiatePaymentSession(cartWithShipping, {
      provider_id: medusaPaymentProviderId
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
    const medusaSubtotalCents =
      typeof order.subtotal === "number"
        ? order.subtotal
        : typeof order.item_total === "number"
          ? order.item_total
          : 0
    const medusaShippingCents =
      typeof shippingTotal === "number"
        ? shippingTotal
        : typeof order.shipping_total === "number"
          ? order.shipping_total
          : 1500
    const shippingUsd = resolveShippingUsd(items)
    const subtotalUsd = medusaSubtotalCents / 100
    // Selank Nasal Spray-only carts use $9 shipping for payment; Medusa flat rate stays $15 for other carts.
    const totalUsd =
      shippingUsd === medusaShippingCents / 100
        ? (typeof order.total === "number" ? order.total : medusaSubtotalCents + medusaShippingCents) / 100
        : subtotalUsd + shippingUsd

    const emailItems: OrderEmailItem[] = items
      .filter((item) => item.title && item.unitPrice != null)
      .map((item) => ({
        title: item.title!,
        variantTitle: item.variantTitle,
        quantity: item.quantity,
        unitPrice: item.unitPrice!
      }))

    const paymentMethod = body.payment_method === "crypto" ? "crypto" : "card"
    const cryptoAsset = body.crypto_asset?.trim().toUpperCase() || "BTC"
    // Card processor descriptor: SKU codes only — never human product names.
    const peptidepayProductName = buildPeptidepayProductName(items)

    let paymentUrl: string | null = null
    let paymentProvider: string | null = null
    let paymentError: string | null = null

    if (paymentMethod === "card") {
      const cardIntent = await createPeptidepayPaymentIntent({
        orderId: order.id,
        email,
        amountUsd: totalUsd,
        currency: "USD",
        productName: peptidepayProductName
      })
      paymentUrl = cardIntent?.ok === false ? null : cardIntent?.provider_url || null
      paymentProvider = cardIntent?.ok === false ? null : cardIntent?.provider || "peptidepay"
      paymentError =
        cardIntent?.ok === false ? cardIntent.message || "Card payment setup failed" : null
    } else {
      const intent = await createCryptoPaymentIntent({
        orderId: order.id,
        email,
        amountUsd: totalUsd,
        cryptoAsset
      })
      paymentUrl = intent?.ok === false ? null : intent?.provider_url || null
      paymentProvider = intent?.ok === false ? null : intent?.provider || null
      paymentError = intent?.ok === false ? intent.message || "Crypto payment setup failed" : null
    }

    void sendOrderConfirmationEmail({
      email,
      orderId: order.id,
      displayId: order.display_id,
      total: totalUsd,
      paymentUrl,
      items: emailItems
    }).catch(() => {
      // Email failure must not block checkout.
    })

    return NextResponse.json({
      ok: true,
      order_id: order.id,
      display_id: order.display_id,
      cart_id: cart.id,
      total: totalUsd,
      shipping: shippingUsd,
      source: "medusa",
      payment_url: paymentUrl,
      payment_provider: paymentProvider,
      payment_method: paymentMethod,
      payment_error: paymentError,
      crypto_asset: paymentMethod === "crypto" ? cryptoAsset : null
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Medusa checkout failed"
    return NextResponse.json({ ok: false, message, source: "medusa" }, { status: 503 })
  }
}
