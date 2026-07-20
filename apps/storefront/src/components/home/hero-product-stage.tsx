import Image from "next/image"
import Link from "next/link"

const HERO_PRODUCTS = [
  {
    slot: "left" as const,
    src: "/products/v2/hero/retatrutide-20mg.png",
    href: "/product/retatrutide-20mg",
    label: "Retatrutide 20mg",
    width: 280,
    height: 560,
    priority: false
  },
  {
    slot: "center" as const,
    src: "/products/v2/hero/selank-nasal-spray-10mg.png",
    href: "/product/selank-nasal-spray-10mg",
    label: "Selank Nasal Spray 10mg",
    width: 220,
    height: 420,
    priority: false
  },
  {
    slot: "right" as const,
    src: "/products/v2/hero/bpc-157-capsules.png",
    href: "/product/bpc-157-capsules-100-count-500mcg",
    label: "BPC-157 Capsules",
    width: 320,
    height: 480,
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
                fetchPriority={product.priority ? "high" : "auto"}
                sizes="(max-width: 640px) 38vw, (max-width: 1024px) 30vw, 280px"
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
