import path from "node:path"

/**
 * Opaque SKU scheme: TV-{product}-{pack}
 * - product: stable 4-digit catalog ID (no product name)
 * - pack: 2-digit pack quantity (01, 05, 10, 20, …)
 */

export function formatOpaqueSku(productCode, packQty = 1) {
  const code = Number(productCode)
  const qty = Number(packQty)
  if (!Number.isFinite(code) || code < 1) {
    throw new Error(`Invalid product code: ${productCode}`)
  }
  const safeQty = Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 1
  return `TV-${String(code).padStart(4, "0")}-${String(safeQty).padStart(2, "0")}`
}

export function packQtyFromOpaqueSku(sku) {
  const match = String(sku || "").match(/^TV-\d{4}-(\d{2})$/i)
  if (!match) return null
  return Number(match[1])
}

/**
 * Load/create stable handle → product code registry.
 * Existing codes are never renumbered; new handles get max+1 in sorted order.
 */
export async function resolveProductCodeRegistry(handles, registryPath, fs) {
  let registry = { version: 1, next_code: 1, products: {} }

  try {
    const raw = await fs.readFile(registryPath, "utf8")
    const parsed = JSON.parse(raw.replace(/^\uFEFF/, ""))
    if (parsed && typeof parsed === "object" && parsed.products) {
      registry = {
        version: 1,
        next_code: Number(parsed.next_code) > 0 ? Number(parsed.next_code) : 1,
        products: { ...parsed.products }
      }
    }
  } catch {
    // First run — empty registry.
  }

  const used = new Set(
    Object.values(registry.products)
      .map((code) => Number(code))
      .filter((code) => Number.isFinite(code) && code > 0)
  )
  let nextCode = Math.max(registry.next_code, 1)
  while (used.has(nextCode)) nextCode += 1

  const uniqueHandles = [...new Set(handles.filter(Boolean))].sort()
  for (const handle of uniqueHandles) {
    if (registry.products[handle] != null) continue
    registry.products[handle] = nextCode
    used.add(nextCode)
    nextCode += 1
    while (used.has(nextCode)) nextCode += 1
  }

  registry.next_code = nextCode
  await fs.mkdir(path.dirname(registryPath), { recursive: true })
  await fs.writeFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`, "utf8")
  return registry
}
