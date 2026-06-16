import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import type { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const isOnSale = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="card card-hover group flex flex-col overflow-hidden">
      <Link to={`/product/${product.slug}`} className="product-card-media">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-media-image"
          loading="lazy"
        />
        {isOnSale && (
          <span className="absolute left-3 top-3 rounded-md bg-[#EF4444] px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm">
            Sale
          </span>
        )}
        {product.isBlend && (
          <span
            className="absolute left-3 top-3 rounded-md bg-[#7C3AED] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
            style={{ marginTop: isOnSale ? '36px' : '0' }}
          >
            Blend
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-[#CCFBF1] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#0D9488]">
          {product.purity}
        </span>
      </Link>
      <div className="flex flex-1 flex-col border-t border-[#E2E8F0] p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-[15px] font-semibold leading-snug text-[#0F172A] transition-colors group-hover:text-[#0D9488]">
            {product.name}
          </h3>
        </Link>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="font-mono text-[11px] font-medium text-[#94A3B8]">{product.strength}</p>
          {product.inStock ? (
            <span className="flex items-center gap-0.5 font-mono text-[10px] text-[#059669]">
              <Check className="h-3 w-3" /> In Stock
            </span>
          ) : (
            <span className="font-mono text-[10px] text-[#EF4444]">Out of Stock</span>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="flex items-center gap-2">
            {isOnSale && (
              <span className="text-sm text-[#94A3B8] line-through">
                ${product.originalPrice!.toFixed(2)}
              </span>
            )}
            <span className={`font-bold ${isOnSale ? 'text-base text-[#D97706]' : 'text-base text-[#0F172A]'}`}>
              ${product.price.toFixed(2)}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product);
            }}
            disabled={!product.inStock}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-[#0D9488] px-3 text-xs font-semibold text-white transition-all hover:bg-[#0F766E] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
