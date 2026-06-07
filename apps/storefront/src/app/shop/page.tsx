import Link from "next/link"
import { listProducts } from "@/lib/medusa"

export const revalidate = 300

export default async function ShopPage() {
  const products = await listProducts()

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Shop</h1>
      <p className="text-[#8A8AA0]">
        SEO-ready product listing page. Data is sourced from Medusa Store API.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.handle}`}
            className="rounded-lg border border-white/10 bg-[#0A0A10] p-4 hover:border-[#5EEAD4]/50"
          >
            <h2 className="text-lg font-medium">{product.title}</h2>
            <p className="mt-2 text-xs text-[#8A8AA0]">
              {String(product.metadata?.source_category || "Research Product")}
            </p>
          </Link>
        ))}
      </div>
      {products.length === 0 && (
        <p className="rounded-md border border-white/10 bg-[#0A0A10] p-4 text-[#8A8AA0]">
          No products found. Run catalog normalization and Medusa import, then connect
          `NEXT_PUBLIC_MEDUSA_URL` and publishable key.
        </p>
      )}
    </section>
  )
}
