import Image from "next/image"
import Link from "next/link"

const HERO_PRODUCTS = [
  {
    slot: "left" as const,
    src: "/products/v2/hero/retatrutide-20mg.png",
    href: "/product/retatrutide-20mg",
    label: "Retatrutide 20mg",
    width: 334,
    height: 750,
    priority: false
  },
  {
    slot: "center" as const,
    src: "/products/v2/hero/selank-nasal-spray-10mg.png",
    href: "/product/selank-nasal-spray-10mg",
    label: "Selank Nasal Spray 10mg",
    width: 314,
    height: 1125,
    priority: false
  },
  {
    slot: "right" as const,
    src: "/products/v2/hero/bpc-157-capsules.png",
    href: "/product/bpc-157-capsules-100-count-500mcg",
    label: "BPC-157 Capsules",
    width: 540,
    height: 1028,
    priority: true
  }
]

export function HeroProductStage() {
  return (
    <div className="hero-stage">
      <div className="hero-stage-glow" aria-hidden="true" />
      <div className="hero-stage-cluster">
        {HERO_PRODUCTS.map((product) => (
          <div key={product.slot} className={`hero-slot hero-slot-${product.slot}`}>
            <Link href={product.href} aria-label={product.label}>
              <Image
                src={product.src}
                alt={product.label}
                width={product.width}
                height={product.height}
                priority={product.priority}
                unoptimized
                sizes="(max-width: 980px) 44vw, 360px"
                className="hero-prod-img"
              />
            </Link>
          </div>
        ))}
        <div className="hero-stage-floor" aria-hidden="true" />
      </div>
    </div>
  )
}
