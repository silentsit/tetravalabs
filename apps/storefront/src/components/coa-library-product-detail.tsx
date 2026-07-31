import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CoaLibraryCard } from "@/components/coa-library-card"
import { getProductHref } from "@/lib/compound-product"
import type { CoaLibraryProduct } from "@/lib/coa-library"

type Props = {
  product: CoaLibraryProduct
}

export function CoaLibraryProductDetail({ product }: Props) {
  const shopHref = getProductHref(product.parentHandle)

  return (
    <div className="page-container space-y-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "COA Library", href: "/coa-library" },
          { label: product.displayName }
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/coa-library"
            className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0D9488]"
          >
            <ArrowLeft className="h-4 w-4" />
            All products
          </Link>
          <span className="section-label mt-4 block">Quality</span>
          <h1 className="mt-2 font-serif text-4xl text-[#0F172A] md:text-5xl">
            {product.displayName}
          </h1>
          <p className="mt-4 max-w-2xl text-[#475569]">
            Lot-linked Certificates of Analysis for this catalog product.
            {product.documentCount > 0
              ? ` ${product.documentCount} document${product.documentCount === 1 ? "" : "s"} available.`
              : ""}
          </p>
        </div>
        <Link href={shopHref} className="btn-secondary px-4 py-2 text-sm">
          View product
        </Link>
      </div>

      {product.documentsByStrength.map((group) => (
        <section key={group.strengthLabel} className="space-y-4">
          <div className="flex items-baseline justify-between gap-3 border-b border-[#E2E8F0] pb-2">
            <h2 className="font-serif text-2xl text-[#0F172A]">
              {group.strengthLabel === "Standard" ? "Documents" : group.strengthLabel}
            </h2>
            <span className="text-xs text-[#94A3B8]">
              {group.documents.length} file{group.documents.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {group.documents.map((document) => (
              <CoaLibraryCard key={document.id} document={document} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
