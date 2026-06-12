import Link from "next/link"

export default function NotFound() {
  return (
    <div className="page-container py-24 text-center">
      <h1 className="font-serif text-4xl text-[#0F172A]">Page not found</h1>
      <p className="mt-3 text-sm text-[#475569]">The page you requested does not exist.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-primary">
          Back to home
        </Link>
        <Link href="/shop" className="btn-secondary">
          Browse shop
        </Link>
      </div>
    </div>
  )
}
