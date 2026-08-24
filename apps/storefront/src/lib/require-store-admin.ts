import "server-only"

import Medusa from "@medusajs/js-sdk"
import { isStoreAdminEmail } from "@/lib/admin-access"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export type StoreAdminAuth =
  | { ok: true; email: string }
  | { ok: false; status: 401 | 403; message: string }

export async function requireStoreAdmin(req: Request): Promise<StoreAdminAuth> {
  const authToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || null
  if (!authToken) {
    return { ok: false, status: 401, message: "Sign in required" }
  }

  try {
    const sdk = new Medusa({
      baseUrl: MEDUSA_URL,
      publishableKey: PUBLISHABLE_KEY,
      globalHeaders: { Authorization: `Bearer ${authToken}` }
    })
    const { customer } = await sdk.store.customer.retrieve()
    const email = customer?.email?.trim() || ""
    if (!isStoreAdminEmail(email)) {
      return { ok: false, status: 403, message: "Admin access required" }
    }
    return { ok: true, email }
  } catch {
    return { ok: false, status: 401, message: "Sign in required" }
  }
}
