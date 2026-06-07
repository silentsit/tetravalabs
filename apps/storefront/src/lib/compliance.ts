import { cookies } from "next/headers"

export const RUO_COOKIE = "tetrava_ruo_ack"
export const DISCLAIMER_VERSION = "v1"

export async function hasRuoAcknowledged() {
  const jar = await cookies()
  return jar.get(RUO_COOKIE)?.value === DISCLAIMER_VERSION
}
