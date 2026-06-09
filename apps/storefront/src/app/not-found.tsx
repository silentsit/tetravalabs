import Link from "next/link"

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-semibold text-[#E8E8F0]">Page not found</h1>
      <p className="mt-3 text-sm text-[#8A8AA0]">The page you requested does not exist.</p>
      <Link href="/" className="mt-6 inline-block text-sm text-[#7AA2FF] hover:underline">
        Back to home
      </Link>
    </div>
  )
}
