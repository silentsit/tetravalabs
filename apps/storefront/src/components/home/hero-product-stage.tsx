import Image from "next/image"
import Link from "next/link"

const HERO_VIALS = [
  {
    slot: "left" as const,
    src: "/products/v2/bpc-157-5mg.png",
    href: "/product/bpc-157-5mg",
    label: "BPC-157 5mg",
    width: 400,
    height: 600,
    priority: false
  },
  {
    slot: "center" as const,
    src: "/products/v2/semaglutide-5mg.png",
    href: "/product/semaglutide-5mg",
    label: "Semaglutide 5mg",
    width: 400,
    height: 600,
    priority: false
  },
  {
    slot: "right" as const,
    src: "/products/v2/retatrutide-5mg.png",
    href: "/product/retatrutide-5mg",
    label: "Retatrutide 5mg",
    width: 400,
    height: 600,
    priority: true
  }
]

export function HeroProductStage() {
  return (
    <div className="hero-vial-stage" aria-hidden="true">
      {HERO_VIALS.map((vial) => (
        <Link
          key={vial.slot}
          href={vial.href}
          className={`hero-vial-slot hero-vial-${vial.slot}`}
          tabIndex={-1}
        >
          <Image
            src={vial.src}
            alt=""
            width={vial.width}
            height={vial.height}
            priority={vial.priority}
            sizes="(max-width: 980px) 40vw, 220px"
            className="hero-vial-prod"
          />
          <span className="sr-only">{vial.label}</span>
        </Link>
      ))}
    </div>
  )
}
