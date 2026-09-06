export function WiseMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full bg-[#9FE870] px-2.5 ${className}`}
      aria-hidden
    >
      <span className="text-[13px] font-bold leading-none tracking-tight text-[#163300]">wise</span>
    </span>
  )
}
