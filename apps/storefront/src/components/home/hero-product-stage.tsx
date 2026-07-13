import Image from "next/image"
import Link from "next/link"

const HERO_PRODUCTS = [
  {
    slot: "back" as const,
    src: "/products/v2/hero/bpc157-capsules.png",
    href: "/product/bpc-157-capsules-100-count-500mcg",
    label: "BPC-157 Capsules",
    width: 503,
    height: 1002,
    priority: false
  },
  {
    slot: "mid" as const,
    src: "/products/v2/hero/selank-nasal-spray-10mg.png",
    href: "/product/selank-nasal-spray-10mg",
    label: "Selank Nasal Spray 10mg",
    width: 289,
    height: 1090,
    priority: false
  },
  {
    slot: "front" as const,
    src: "/products/v2/hero/retatrutide-5mg.png",
    href: "/product/retatrutide-5mg",
    label: "Retatrutide 5mg",
    width: 361,
    height: 717,
    priority: true
  }
]

export function HeroProductStage() {
  return (
    <div className="hero-stage">
      <div className="hero-stage-glow" aria-hidden="true" />
      <div className="hero-stage-cluster">
        {HERO_PRODUCTS.map((product) => (
          <Link
            key={product.slot}
            href={product.href}
            className={`hero-prod hero-prod-${product.slot}`}
            aria-label={product.label}
          >
            <Image
              src={product.src}
              alt=""
              width={product.width}
              height={product.height}
              priority={product.priority}
              sizes="(max-width: 980px) 44vw, 300px"
              className="hero-prod-img"
            />
          </Link>
        ))}
        <div className="hero-stage-floor" aria-hidden="true" />
      </div>
    </div>
  )
}
