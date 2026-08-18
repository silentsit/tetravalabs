import { NextResponse } from "next/server"
import Medusa from "@medusajs/js-sdk"
import { isCheckoutCountry } from "@/lib/checkout-countries"
import { resolveShippingUsd } from "@/lib/checkout-shipping"
import { createCryptoPaymentIntent } from "@/lib/medusa-crypto-checkout"
import { registerLabRestocksFromCheckout } from "@/lib/medusa-lab-restock-register"
import { createPeptidepayPaymentIntent } from "@/lib/medusa-peptidepay-checkout"
import { isValidRestockCadence, LAB_RESTOCK_COPY, applyLabRestockPrice } from "@/lib/lab-restock"
import { buildPeptidepayProductName } from "@/lib/product-sku"
import { scheduleOrderEmails } from "@/lib/schedule-order-emails"

type CheckoutItem = {
  variantId: string
  quantity: number
  handle?: string
  title?: string
  variantTitle?: string
  unitPrice?: number
  productId?: string
  fulfillment?: "one_time" | "lab_restock"
  restockCadenceDays?: number
  oneTimeUnitPrice?: number
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

  const restockItems = items.filter((item) => item.fulfillment === "lab_restock")
  const hasLabRestock = restockItems.length > 0

  if (hasLabRestock) {
    if (body.payment_method === "crypto") {
      return NextResponse.json(
        {
          ok: false,
          message: LAB_RESTOCK_COPY.cryptoBlocked,
          code: "lab_restock_card_required"
        },
        { status: 400 }
      )
    }

    const cadences = new Set(
      restockItems
        .map((item) => item.restockCadenceDays)
        .filter((days): days is number => isValidRestockCadence(days))
    )
    if (cadences.size === 0) {
      return NextResponse.json(
        { ok: false, message: "Peptide Refill items require a valid cadence (30, 60, or 90 days)." },
        { status: 400 }
      )
    }
    if (cadences.size > 1) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "All Peptide Refill items in one checkout must share the same refill cadence. Update your cart and try again."
        },
        { status: 400 }
      )
    }

    for (const item of restockItems) {
      const oneTime = item.oneTimeUnitPrice
      if (oneTime == null || item.unitPrice == null) {
        return NextResponse.json(
          { ok: false, message: "Peptide Refill items require one-time reference pricing." },
          { status: 400 }
        )
      }
      if (Math.abs(item.unitPrice - oneTime) > 0.02) {
        return NextResponse.json(
          {
            ok: false,
            message:
              "Peptide Refill first shipment is full price. The 12% discount applies from your second refill onward.",
            code: "lab_restock_first_order_full_price"
          },
          { status: 400 }
        )
      }
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

    // Peptide Refill includes free cold-chain shipping; first charge uses Medusa catalog totals.
    const shippingUsd = hasLabRestock ? 0 : resolveShippingUsd(items)
    const cartSubtotalUsd = items.reduce(
      (sum, item) => sum + (item.unitPrice || 0) * item.quantity,
      0
    )
    const catalogRestockSubtotalUsd = restockItems.reduce((sum, item) => {
      const catalog = catalogUnitUsdByVariant.get(item.variantId)
      const unit = catalog ?? item.oneTimeUnitPrice ?? item.unitPrice ?? 0
      return sum + unit * item.quantity
    }, 0)
    const subtotalUsd = hasLabRestock
      ? medusaSubtotalCents > 0
        ? medusaSubtotalCents / 100
        : catalogRestockSubtotalUsd || cartSubtotalUsd
      : medusaSubtotalCents / 100
    const totalUsd = hasLabRestock
      ? subtotalUsd + shippingUsd
      : shippingUsd === medusaShippingCents / 100
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

    const paymentMethod = hasLabRestock
      ? "card"
      : body.payment_method === "crypto"
        ? "crypto"
        : "card"
    const cryptoAsset = body.crypto_asset?.trim().toUpperCase() || "USDT"
    const peptidepayProductName = buildPeptidepayProductName(items)

    let paymentUrl: string | null = null
    let paymentProvider: string | null = null
    let paymentError: string | null = null

    if (hasLabRestock) {
      const mappedRestockItems = restockItems
        .filter(
          (item) =>
            item.handle &&
            item.title &&
            item.unitPrice != null &&
            isValidRestockCadence(item.restockCadenceDays)
        )
        .map((item) => {
          const oneTime =
            catalogUnitUsdByVariant.get(item.variantId) ??
            item.oneTimeUnitPrice ??
            item.unitPrice!
          return {
            variantId: item.variantId,
            quantity: item.quantity,
            handle: item.handle!,
            title: item.title!,
            variantTitle: item.variantTitle,
            unitPrice: applyLabRestockPrice(oneTime),
            oneTimeUnitPrice: oneTime,
            cadenceDays: item.restockCadenceDays!,
            productId: item.productId
          }
        })

      const registered = await registerLabRestocksFromCheckout({
        orderId: order.id,
        email,
        customerId: body.customer_id,
        shippingAddress: {
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
        },
        restockItems: mappedRestockItems
      })

      if (!registered.ok) {
        return NextResponse.json(
          { ok: false, message: registered.message || "Peptide Refill registration failed" },
          { status: 502 }
        )
      }

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
    } else if (paymentMethod === "card") {
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

    if (paymentUrl && !paymentUrl.includes("example.com")) {
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
    }

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
      lab_restock: hasLabRestock,
      crypto_asset: paymentMethod === "crypto" ? cryptoAsset : null
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Medusa checkout failed"
    return NextResponse.json({ ok: false, message, source: "medusa" }, { status: 503 })
  }
}
