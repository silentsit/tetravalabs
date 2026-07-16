export function AnnouncementBar() {
  return (
    <div className="border-b border-white/10 bg-[#0D9488]" role="region" aria-label="Promotions">
      <div className="page-container flex items-center justify-center py-2">
        <p className="font-jost text-center text-[11px] font-normal leading-snug text-white sm:text-xs">
          FREE shipping on all orders above $180
        </p>
      </div>
    </div>
  )
}
