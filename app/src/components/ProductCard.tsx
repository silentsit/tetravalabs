import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import type { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-[#0A0A10] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(120,160,220,0.3)] hover:shadow-xl hover:shadow-black/40">
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[#050508]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* RUO Badge */}
        <span className="absolute left-3 top-3 rounded bg-[#FBBF24]/20 px-2 py-0.5 font-mono text-[10px] font-medium text-[#FBBF24]">
          RUO
        </span>
        {product.isBlend && (
          <span className="absolute right-3 top-3 rounded bg-[#A78BFA]/20 px-2 py-0.5 font-mono text-[10px] font-medium text-[#A78BFA]">
            BLEND
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-5">
        {/* Top row */}
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded bg-[#5EEAD4]/10 px-1.5 py-0.5 font-mono text-[10px] text-[#5EEAD4]">
            {product.purity}
          </span>
          {product.molecularWeight && (
            <span className="font-mono text-[10px] text-[#5A5A70]">
              MW: {product.molecularWeight.split(' ')[0]}
            </span>
          )}
        </div>

        {/* Name */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-serif text-lg leading-tight text-[#E8E8F0] transition-colors hover:text-[#5EEAD4]">
            {product.name}
          </h3>
        </Link>

        {/* Strength */}
        <p className="mt-1 font-mono text-xs text-[#8A8AA0]">{product.strength}</p>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#5A5A70]">
          {product.description}
        </p>

        {/* Price & CTA */}
        <div className="mt-auto pt-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-lg font-semibold text-[#E8E8F0]">
              ${product.price.toFixed(2)}
            </span>
            {product.inStock ? (
              <span className="flex items-center gap-1 text-xs text-[#34D399]">
                <CheckCircle className="h-3 w-3" /> In Stock
              </span>
            ) : (
              <span className="text-xs text-[#5A5A70]">Out of Stock</span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            disabled={!product.inStock}
            className="flex h-10 w-full items-center justify-center rounded-lg bg-[#5EEAD4] text-sm font-medium text-[#050508] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
