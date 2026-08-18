import dotenv from "dotenv"
import fs from "node:fs"
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

const loadShippableCountryCodes = () => {
  const countriesPath = path.join(
    workspaceRoot,
    "apps",
    "storefront",
    "src",
    "lib",
    "world-countries.json"
  )
  const countries = JSON.parse(fs.readFileSync(countriesPath, "utf8"))
  return countries
    .map((country) => String(country.code || "").toLowerCase())
    .filter(Boolean)
}

const SHIPPABLE_COUNTRY_CODES = loadShippableCountryCodes()

const getStockLocationDetails = async (token, stockLocationId) => {
  const response = await request(
    token,
    "GET",
    `/admin/stock-locations/${stockLocationId}?fields=*fulfillment_sets,*fulfillment_sets.service_zones,*fulfillment_sets.service_zones.geo_zones,*fulfillment_providers`
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
    const detailed =
      (await request(token, "GET", `/admin/regions/${region.id}`)).region || region
    const existingCodes = new Set(
      (detailed.countries || []).map((country) =>
        String(country.iso_2 || country).toLowerCase()
      )
    )
    const missing = SHIPPABLE_COUNTRY_CODES.filter((code) => !existingCodes.has(code))
    if (missing.length) {
      const updated = await request(token, "POST", `/admin/regions/${detailed.id}`, {
        countries: SHIPPABLE_COUNTRY_CODES
      })
      console.log(
        `Region updated with ${missing.length} checkout countries: ${updated.region.name} (${updated.region.id})`
      )
      return updated.region
    }
    console.log(`Region ready: ${detailed.name} (${detailed.id})`)
    return detailed
  }

  const created = await request(token, "POST", "/admin/regions", {
    name: "International (USD)",
    currency_code: "usd",
    countries: SHIPPABLE_COUNTRY_CODES,
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

const ensureServiceZoneCountries = async (token, fulfillmentSetId, serviceZone) => {
  const existingZones = serviceZone.geo_zones || []
  const existingCodes = new Set(
    existingZones.map((zone) => String(zone.country_code || "").toLowerCase()).filter(Boolean)
  )
  const missing = SHIPPABLE_COUNTRY_CODES.filter((code) => !existingCodes.has(code))
  if (!missing.length) {
    return serviceZone
  }

  const geo_zones = [
    ...existingZones
      .filter((zone) => zone.id)
      .map((zone) => ({
        id: zone.id,
        type: zone.type,
        country_code: zone.country_code
      })),
    ...missing.map((country_code) => ({ type: "country", country_code }))
  ]

  const updated = await request(
    token,
    "POST",
    `/admin/fulfillment-sets/${fulfillmentSetId}/service-zones/${serviceZone.id}`,
    {
      name: serviceZone.name || "Research destinations",
      geo_zones
    }
  )

  const nextZone =
    updated.fulfillment_set?.service_zones?.find((zone) => zone.id === serviceZone.id) ||
    updated.fulfillment_set?.service_zones?.[0] ||
    serviceZone
  console.log(`Service zone updated with ${missing.length} checkout countries`)
  return nextZone
}

const ensureProductShippingProfiles = async (token, profileId) => {
  const limit = 100
  let offset = 0
  let linked = 0
  let alreadyLinked = 0

  while (true) {
    const page = await request(
      token,
      "GET",
      `/admin/products?limit=${limit}&offset=${offset}&fields=id,handle,*shipping_profile`
    )
    const products = page.products || []
    if (!products.length) break

    for (const product of products) {
      if (product.shipping_profile?.id) {
        alreadyLinked += 1
        continue
      }
      await request(token, "POST", `/admin/products/${product.id}`, {
        shipping_profile_id: profileId
      })
      linked += 1
    }

    offset += products.length
    if (products.length < limit || offset >= (page.count || offset)) break
  }

  console.log(
    `Product shipping profiles ready (${alreadyLinked} already linked, ${linked} linked)`
  )
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
          name: "Research destinations",
          geo_zones: SHIPPABLE_COUNTRY_CODES.map((country_code) => ({
            type: "country",
            country_code
          }))
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

  serviceZone = await ensureServiceZoneCountries(token, fulfillmentSet.id, serviceZone)

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
  console.log(`Shippable checkout countries: ${SHIPPABLE_COUNTRY_CODES.length}`)
  requireCredentials()
  MEDUSA_ADMIN_TOKEN = await resolveAdminToken()

  const region = await ensureRegion(MEDUSA_ADMIN_TOKEN)
  const salesChannel = await ensureSalesChannel(MEDUSA_ADMIN_TOKEN)
  const stockLocation = await ensureStockLocation(MEDUSA_ADMIN_TOKEN, salesChannel.id)
  const shippingOption = await ensureShippingOption(
    MEDUSA_ADMIN_TOKEN,
    region,
    stockLocation.id
  )
  if (shippingOption?.shipping_profile_id) {
    await ensureProductShippingProfiles(
      MEDUSA_ADMIN_TOKEN,
      shippingOption.shipping_profile_id
    )
  } else {
    const profiles = await request(MEDUSA_ADMIN_TOKEN, "GET", "/admin/shipping-profiles?limit=20")
    const profile = profiles.shipping_profiles?.[0]
    if (!profile?.id) {
      throw new Error("No shipping profile found after migrations.")
    }
    await ensureProductShippingProfiles(MEDUSA_ADMIN_TOKEN, profile.id)
  }
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
