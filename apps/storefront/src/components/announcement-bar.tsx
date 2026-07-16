export function AnnouncementBar() {
  return (
    <div className="border-b border-white/10 bg-[#0F172A]" role="region" aria-label="Promotions">
      <div className="page-container flex items-center justify-between gap-3 py-2">
        <p className="min-w-0 text-left text-[11px] leading-snug text-white sm:text-xs">
          <span className="font-semibold tracking-wide">FREE</span>
          {" shipping on all orders above $180"}
        </p>
        <p className="min-w-0 shrink-0 text-right text-[11px] leading-snug text-white/80 sm:text-xs">
          We accept payments via credit card &amp; crypto.
        </p>
      </div>
    </div>
  )
}
