import { withDb } from "./db"

type RegisteredCustomer = {
  id: string
  email: string
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function findRegisteredCustomerByEmail(email: string) {
  const normalized = normalizeEmail(email)
  if (!normalized) return null

  return withDb(
    async (db) => {
      const result = await db.query<RegisteredCustomer>(
        `
        SELECT id, email
        FROM customer
        WHERE lower(email) = $1
          AND has_account IS TRUE
          AND deleted_at IS NULL
        ORDER BY created_at ASC
        LIMIT 1
        `,
        [normalized]
      )
      return result.rows[0] || null
    },
    async () => null
  )
}

export async function findRegisteredCustomerById(customerId: string) {
  const id = customerId.trim()
  if (!id) return null

  return withDb(
    async (db) => {
      const result = await db.query<RegisteredCustomer>(
        `
        SELECT id, email
        FROM customer
        WHERE id = $1
          AND has_account IS TRUE
          AND deleted_at IS NULL
        LIMIT 1
        `,
        [id]
      )
      return result.rows[0] || null
    },
    async () => null
  )
}

async function cartEmailMatches(db: import("pg").Pool, cartId: string, email: string) {
  const normalized = normalizeEmail(email)
  const result = await db.query<{ email: string | null }>(
    `
    SELECT lower(COALESCE(email, '')) AS email
    FROM cart
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [cartId]
  )
  const cartEmail = result.rows[0]?.email || ""
  return cartEmail === normalized
}

async function orderEmailMatches(db: import("pg").Pool, orderId: string, email: string) {
  const normalized = normalizeEmail(email)
  const result = await db.query<{ email: string | null }>(
    `
    SELECT lower(COALESCE(email, '')) AS email
    FROM "order"
    WHERE id = $1
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [orderId]
  )
  const orderEmail = result.rows[0]?.email || ""
  return orderEmail === normalized
}

async function linkCartCustomer(db: import("pg").Pool, cartId: string, customerId: string) {
  await db.query(
    `
    UPDATE cart
    SET customer_id = $1, updated_at = NOW()
    WHERE id = $2
      AND deleted_at IS NULL
    `,
    [customerId, cartId]
  )
}

async function linkOrderCustomer(db: import("pg").Pool, orderId: string, customerId: string) {
  await db.query(
    `
    UPDATE "order"
    SET customer_id = $1, updated_at = NOW()
    WHERE id = $2
      AND deleted_at IS NULL
    `,
    [customerId, orderId]
  )

  await db.query(
    `
    UPDATE lab_restocks
    SET customer_id = $1, updated_at = NOW()
    WHERE order_id = $2
      AND (customer_id IS NULL OR customer_id <> $1)
    `,
    [customerId, orderId]
  )
}

export async function bindCheckoutCustomer(input: {
  email: string
  cartId?: string | null
  orderId?: string | null
  authenticatedCustomerId?: string | null
}) {
  const normalizedEmail = normalizeEmail(input.email)
  if (!normalizedEmail) {
    return { ok: false as const, linked: false, reason: "email required" }
  }

  let customerId = input.authenticatedCustomerId?.trim() || null

  if (customerId) {
    const registered = await findRegisteredCustomerById(customerId)
    if (!registered || normalizeEmail(registered.email) !== normalizedEmail) {
      return { ok: false as const, linked: false, reason: "authenticated customer email mismatch" }
    }
  } else {
    const registered = await findRegisteredCustomerByEmail(normalizedEmail)
    if (!registered) {
      return { ok: true as const, linked: false, customer_id: null as string | null }
    }
    customerId = registered.id
  }

  const cartId = input.cartId?.trim() || null
  const orderId = input.orderId?.trim() || null
  if (!cartId && !orderId) {
    return { ok: true as const, linked: false, customer_id: customerId }
  }

  const linked = await withDb(
    async (db) => {
      let didLink = false

      if (cartId && (await cartEmailMatches(db, cartId, normalizedEmail))) {
        await linkCartCustomer(db, cartId, customerId!)
        didLink = true
      }

      if (orderId && (await orderEmailMatches(db, orderId, normalizedEmail))) {
        await linkOrderCustomer(db, orderId, customerId!)
        didLink = true
      }

      return didLink
    },
    async () => false
  )

  return {
    ok: true as const,
    linked,
    customer_id: customerId
  }
}

/** Attach historical guest orders to a registered customer after login/register. */
export async function linkGuestOrdersToRegisteredCustomer(input: {
  email: string
  customerId: string
}) {
  const normalizedEmail = normalizeEmail(input.email)
  const customerId = input.customerId.trim()
  if (!normalizedEmail || !customerId) {
    return { ok: false as const, linked: 0 }
  }

  const registered = await findRegisteredCustomerById(customerId)
  if (!registered || normalizeEmail(registered.email) !== normalizedEmail) {
    return { ok: false as const, linked: 0 }
  }

  const linked = await withDb(
    async (db) => {
      const result = await db.query<{ id: string }>(
        `
        UPDATE "order" o
        SET customer_id = $1, updated_at = NOW()
        FROM customer c
        WHERE o.deleted_at IS NULL
          AND lower(o.email) = $2
          AND o.customer_id = c.id
          AND c.has_account IS FALSE
          AND c.deleted_at IS NULL
          AND (o.customer_id IS DISTINCT FROM $1)
        RETURNING o.id
        `,
        [customerId, normalizedEmail]
      )

      const orderIds = result.rows.map((row) => row.id)
      if (orderIds.length) {
        await db.query(
          `
          UPDATE lab_restocks
          SET customer_id = $1, updated_at = NOW()
          WHERE order_id = ANY($2::text[])
            AND (customer_id IS NULL OR customer_id <> $1)
          `,
          [customerId, orderIds]
        )
      }

      return orderIds.length
    },
    async () => 0
  )

  return { ok: true as const, linked }
}
