import { NextResponse } from "next/server"
import Medusa from "@medusajs/js-sdk"
import { isCheckoutCountry } from "@/lib/checkout-countries"
import { resolveShippingUsd } from "@/lib/checkout-shipping"
import { createCryptoPaymentIntent } from "@/lib/medusa-crypto-checkout"
import {
  isPeptidepayOnrampId,
  peptidepayBuyerIpCountry,
  PEPTIDEPAY_ONRAMPS,
  peptidepayOnrampAvailableForIp,
  peptidepayOnrampLocationError,
  resolvePeptidepayOnramp
} from "@/lib/peptidepay-onramps"
import { scheduleOrderEmails } from "@/lib/schedule-order-emails"
import {
  bindCheckoutCustomerOnMedusa,
  transferCartToAuthenticatedCustomer
} from "@/lib/checkout-customer-bind"

export const maxDuration = 60

type CheckoutItem = {
  variantId: string
  quantity: number
  handle?: string
  title?: string
  variantTitle?: string
  unitPrice?: number
  productId?: string
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
  peptidepay_provider?: string
  customer_id?: string
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

  if (!isCheckoutCountry(country)) {
    return NextResponse.json(
      { ok: false, message: "Select a valid shipping country." },
      { status: 400 }
    )
  }

  const ipCountry = peptidepayBuyerIpCountry(
    req.headers.get("cf-ipcountry") ||
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("x-country-code")
  )
  const intendedPaymentMethod = body.payment_method === "crypto" ? "crypto" : "card"
  if (intendedPaymentMethod === "card") {
    const requestedOnramp = body.peptidepay_provider?.trim().toLowerCase()
    if (requestedOnramp && !isPeptidepayOnrampId(requestedOnramp)) {
      return NextResponse.json({ ok: false, message: "Choose a supported card processor." }, { status: 400 })
    }
    const requestedOption = PEPTIDEPAY_ONRAMPS.find((option) => option.id === requestedOnramp)
    if (requestedOption && !peptidepayOnrampAvailableForIp(requestedOption, ipCountry)) {
      return NextResponse.json(
        { ok: false, message: peptidepayOnrampLocationError(requestedOption) },
        { status: 400 }
      )
    }
  }

  try {
    const sdk = createSdk(authToken)
    const { regions } = await sdk.store.region.list()
    const regionId = regions?.[0]?.id

    if (!regionId) {
      return NextResponse.json(
        { ok: false, message: "Checkout is temporarily unavailable. Please try again in a few minutes." },
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
          message:
            "Shipping is not available for this destination. Try another country or contact support.",
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

    if (authToken) {
      try {
        const { customer } = await sdk.store.customer.retrieve()
        const accountEmail = customer?.email?.trim().toLowerCase()
        if (accountEmail && accountEmail === email.trim().toLowerCase()) {
          await transferCartToAuthenticatedCustomer(cart.id, authToken)
        }
      } catch {
        // Non-blocking; bind-customer still links when emails match.
      }
    }

    await bindCheckoutCustomerOnMedusa({
      email,
      cartId: cart.id,
      authToken
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
    await bindCheckoutCustomerOnMedusa({
      email,
      orderId: order.id,
      authToken
    })
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

    // Prefer Medusa catalog unit prices (cents → USD) over client-supplied cart prices.
    const catalogUnitUsdByVariant = new Map<string, number>()
    const orderItems = Array.isArray(order.items) ? order.items : []
    for (const line of orderItems) {
      const variantId =
        typeof line?.variant_id === "string"
          ? line.variant_id
          : typeof line?.variant?.id === "string"
            ? line.variant.id
            : null
      const unitCents =
        typeof line?.unit_price === "number"
          ? line.unit_price
          : typeof line?.unit_price === "string"
            ? Number(line.unit_price)
            : NaN
      if (variantId && Number.isFinite(unitCents) && unitCents > 0) {
        catalogUnitUsdByVariant.set(variantId, Math.round(unitCents) / 100)
      }
    }

    const shippingUsd = resolveShippingUsd(items)
    const subtotalUsd = medusaSubtotalCents / 100
    const totalUsd =
      shippingUsd === medusaShippingCents / 100
        ? (typeof order.total === "number" ? order.total : medusaSubtotalCents + medusaShippingCents) /
          100
        : subtotalUsd + shippingUsd

    const emailItems = items
      .filter((item) => item.title && item.unitPrice != null)
      .map((item) => {
        const catalog = catalogUnitUsdByVariant.get(item.variantId)
        return {
          title: item.title!,
          variantTitle: item.variantTitle,
          quantity: item.quantity,
          unitPrice: catalog ?? item.unitPrice!,
          handle: item.handle,
          variantId: item.variantId,
          productId: item.productId
        }
      })

    const paymentMethod = body.payment_method === "crypto" ? "crypto" : "card"
    const cryptoAsset = body.crypto_asset?.trim().toUpperCase() || "USDT"
    const cardOnramp =
      paymentMethod === "card"
        ? resolvePeptidepayOnramp({
            requested: body.peptidepay_provider,
            country,
            amountUsd: totalUsd,
            ipCountry
          })
        : null

    const peptidepayProvider = cardOnramp?.ok ? cardOnramp.provider : null

    let paymentUrl: string | null = null
    let paymentProvider: string | null = null
    let paymentError: string | null = null

    if (paymentMethod === "card") {
      if (!peptidepayProvider) {
        paymentError =
          cardOnramp && !cardOnramp.ok ? cardOnramp.error : "Choose a card processor."
      } else {
        // Peptide Pay session is minted on the handoff page (Pay Now), not here.
        // Avoids blocking checkout on an external API round-trip (often 3–15s+).
        paymentProvider = "peptidepay"
      }
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

    void scheduleOrderEmails({
      orderId: order.id,
      email,
      displayId: order.display_id,
      totalUsd,
      paymentMethod,
      items: emailItems
    }).catch(() => {
      // Email scheduling failure must not block checkout.
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
      card_onramp: paymentMethod === "card" ? peptidepayProvider : null,
      crypto_asset: paymentMethod === "crypto" ? cryptoAsset : null
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Medusa checkout failed"
    return NextResponse.json({ ok: false, message, source: "medusa" }, { status: 503 })
  }
}
