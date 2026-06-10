import dotenv from "dotenv"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..", "..", "..", "..")
dotenv.config({ path: path.join(workspaceRoot, "apps", "medusa", ".env") })

const MEDUSA_ADMIN_URL = process.env.MEDUSA_ADMIN_URL || "http://localhost:9000"
const MEDUSA_ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL
const MEDUSA_ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD
let MEDUSA_ADMIN_TOKEN = process.env.MEDUSA_ADMIN_TOKEN

const requireCredentials = () => {
  if (MEDUSA_ADMIN_TOKEN) return
  if (!MEDUSA_ADMIN_EMAIL || !MEDUSA_ADMIN_PASSWORD) {
    console.error(
      "Set MEDUSA_ADMIN_TOKEN or MEDUSA_ADMIN_EMAIL + MEDUSA_ADMIN_PASSWORD in apps/medusa/.env"
    )
    process.exit(1)
  }
}

const request = async (token, method, route, body) => {
  const response = await fetch(`${MEDUSA_ADMIN_URL}${route}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  })

  const text = await response.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      throw new Error(`${method} ${route} failed: ${text.slice(0, 200)}`)
    }
  }
  if (!response.ok) {
    const message = data?.message || data?.type || text?.slice(0, 200) || response.statusText
    throw new Error(`${method} ${route} failed: ${message}`)
  }
  return data
}

const getStockLocationDetails = async (token, stockLocationId) => {
  const response = await request(
    token,
    "GET",
    `/admin/stock-locations/${stockLocationId}?fields=*fulfillment_sets,*fulfillment_sets.service_zones,*fulfillment_providers`
  )
  return response.stock_location
}

const ensureFulfillmentProvider = async (token, stockLocationId) => {
  const stockLocation = await getStockLocationDetails(token, stockLocationId)
  const hasManualProvider = stockLocation.fulfillment_providers?.some(
    (provider) => provider.id === "manual_manual"
  )

  if (hasManualProvider) {
    console.log("Fulfillment provider ready: manual_manual")
    return
  }

  await request(
    token,
    "POST",
    `/admin/stock-locations/${stockLocationId}/fulfillment-providers`,
    { add: ["manual_manual"] }
  )
  console.log("Enabled fulfillment provider: manual_manual")
}

const login = async () => {
  const response = await fetch(`${MEDUSA_ADMIN_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: MEDUSA_ADMIN_EMAIL,
      password: MEDUSA_ADMIN_PASSWORD
    })
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.message || "Admin login failed")
  }
  return data.token
}

const resolveAdminToken = async () => {
  if (MEDUSA_ADMIN_TOKEN) return MEDUSA_ADMIN_TOKEN
  return login()
}

const ensureRegion = async (token) => {
  const existing = await request(token, "GET", "/admin/regions?limit=20")
  const region =
    existing.regions?.find((item) =>
      item.countries?.some((country) => country.iso_2?.toLowerCase() === "us")
    ) || existing.regions?.[0]

  if (region) {
    console.log(`Region ready: ${region.name} (${region.id})`)
    return region
  }

  const created = await request(token, "POST", "/admin/regions", {
    name: "United States",
    currency_code: "usd",
    countries: ["us"],
    automatic_taxes: false,
    payment_providers: ["pp_system_default"]
  })
  console.log(`Created region: ${created.region.name} (${created.region.id})`)
  return created.region
}

const ensureSalesChannel = async (token) => {
  const existing = await request(token, "GET", "/admin/sales-channels?limit=20")
  const channel = existing.sales_channels?.[0]
  if (channel) {
    console.log(`Sales channel ready: ${channel.name} (${channel.id})`)
    return channel
  }

  const created = await request(token, "POST", "/admin/sales-channels", {
    name: "Tetrava Storefront",
    description: "Default web sales channel"
  })
  console.log(`Created sales channel: ${created.sales_channel.name}`)
  return created.sales_channel
}

const ensureStockLocation = async (token, salesChannelId) => {
  const existing = await request(token, "GET", "/admin/stock-locations?limit=20")
  let location = existing.stock_locations?.[0]

  if (!location) {
    const created = await request(token, "POST", "/admin/stock-locations", {
      name: "US Fulfillment"
    })
    location = created.stock_location
    console.log(`Created stock location: ${location.name}`)
  } else {
    console.log(`Stock location ready: ${location.name}`)
  }

  await request(token, "POST", `/admin/stock-locations/${location.id}/sales-channels`, {
    add: [salesChannelId]
  })

  return location
}

const ensureShippingOption = async (token, region, stockLocationId) => {
  let stockLocation = await getStockLocationDetails(token, stockLocationId)
  let fulfillmentSet = stockLocation.fulfillment_sets?.[0]

  if (!fulfillmentSet) {
    try {
      const createdSet = await request(
        token,
        "POST",
        `/admin/stock-locations/${stockLocationId}/fulfillment-sets`,
        {
          name: "US Shipping",
          type: "shipping"
        }
      )
      stockLocation = createdSet.stock_location || stockLocation
    } catch (error) {
      if (!String(error.message).toLowerCase().includes("already exists")) {
        throw error
      }
      stockLocation = await getStockLocationDetails(token, stockLocationId)
    }

    if (!stockLocation.fulfillment_sets?.length) {
      stockLocation = await getStockLocationDetails(token, stockLocationId)
    }
    fulfillmentSet = stockLocation.fulfillment_sets?.[0]
    if (!fulfillmentSet) {
      throw new Error("Failed to resolve fulfillment set for stock location.")
    }
    console.log(`Fulfillment set ready: ${fulfillmentSet.name}`)
  } else {
    console.log(`Fulfillment set ready: ${fulfillmentSet.name}`)
  }

  let serviceZone = fulfillmentSet.service_zones?.[0]
  if (!serviceZone) {
    try {
      const createdZone = await request(
        token,
        "POST",
        `/admin/fulfillment-sets/${fulfillmentSet.id}/service-zones`,
        {
          name: "United States",
          geo_zones: [{ type: "country", country_code: "us" }]
        }
      )
      serviceZone = createdZone.fulfillment_set?.service_zones?.[0]
    } catch (error) {
      if (!String(error.message).toLowerCase().includes("already exists")) {
        throw error
      }
    }

    if (!serviceZone) {
      serviceZone = (await getStockLocationDetails(token, stockLocationId)).fulfillment_sets?.[0]
        ?.service_zones?.[0]
    }
    if (!serviceZone) {
      throw new Error("Failed to resolve service zone for fulfillment set.")
    }
    console.log(`Service zone ready: ${serviceZone.name}`)
  } else {
    console.log(`Service zone ready: ${serviceZone.name}`)
  }

  await ensureFulfillmentProvider(token, stockLocationId)

  const options = await request(
    token,
    "GET",
    `/admin/shipping-options?service_zone_id=${serviceZone.id}&limit=20`
  )
  if (options.shipping_options?.length) {
    console.log(`Shipping options ready (${options.shipping_options.length})`)
    return options.shipping_options[0]
  }

  const profiles = await request(token, "GET", "/admin/shipping-profiles?limit=20")
  const profile = profiles.shipping_profiles?.[0]
  if (!profile) {
    throw new Error("No shipping profile found after migrations.")
  }

  const createdOption = await request(token, "POST", "/admin/shipping-options", {
    name: "Standard Research Shipping",
    price_type: "flat",
    provider_id: "manual_manual",
    service_zone_id: serviceZone.id,
    shipping_profile_id: profile.id,
    type: {
      label: "Standard",
      description: "Flat-rate research material shipping",
      code: "standard"
    },
    prices: [
      { currency_code: "usd", amount: 1500 },
      { region_id: region.id, amount: 1500 }
    ]
  })

  console.log(`Created shipping option: ${createdOption.shipping_option.name}`)
  return createdOption.shipping_option
}

const ensurePublishableKey = async (token, salesChannelId) => {
  const rotate = process.argv.includes("--rotate-key")
  const keys = await request(token, "GET", "/admin/api-keys?type=publishable&limit=50")
  let key = keys.api_keys?.find((item) => item.title === "Tetrava Storefront")
  let publishableToken = null

  if (!key || rotate) {
    const title = rotate && key ? "Tetrava Storefront (rotated)" : "Tetrava Storefront"
    const created = await request(token, "POST", "/admin/api-keys", {
      title,
      type: "publishable"
    })
    key = created.api_key
    publishableToken = created.api_key?.token || created.token
    console.log(`Created publishable API key: ${key.title}`)
  } else {
    console.log(`Publishable API key ready: ${key.title}`)
  }

  await request(token, "POST", `/admin/api-keys/${key.id}/sales-channels`, {
    add: [salesChannelId]
  })

  if (publishableToken) {
    console.log("\nAdd to apps/storefront/.env.local and Vercel:")
    console.log(`NEXT_PUBLIC_MEDUSA_URL=${MEDUSA_ADMIN_URL}`)
    console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableToken}`)
  } else {
    console.log("\nPublishable key exists but token is not returned by Medusa.")
    console.log("Re-run with --rotate-key to create a new key and print the token:")
    console.log("  npm run medusa:bootstrap -- --rotate-key")
  }

  return key
}

const run = async () => {
  requireCredentials()
  MEDUSA_ADMIN_TOKEN = await resolveAdminToken()

  const region = await ensureRegion(MEDUSA_ADMIN_TOKEN)
  const salesChannel = await ensureSalesChannel(MEDUSA_ADMIN_TOKEN)
  const stockLocation = await ensureStockLocation(MEDUSA_ADMIN_TOKEN, salesChannel.id)
  await ensureShippingOption(MEDUSA_ADMIN_TOKEN, region, stockLocation.id)
  await ensurePublishableKey(MEDUSA_ADMIN_TOKEN, salesChannel.id)

  console.log("\nStore bootstrap complete.")
  console.log(`Region ID: ${region.id}`)
  console.log(`Sales channel ID: ${salesChannel.id}`)
  console.log("Optional: set MEDUSA_SALES_CHANNEL_ID in apps/medusa/.env for catalog import.")
}

run().catch((error) => {
  console.error("Store bootstrap failed:", error.message || error)
  process.exit(1)
})
