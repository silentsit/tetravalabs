import { Link } from 'react-router-dom';
import { ArrowRight, FlaskConical, Beaker, Layers, Droplets } from 'lucide-react';
import { categories } from '@/data/products';

const categoryMeta = [
  { icon: FlaskConical, count: '27 compounds' },
  { icon: Beaker, count: '11 compounds' },
  { icon: Layers, count: '6 compounds' },
  { icon: Droplets, count: '5 compounds' },
];

export default function Categories() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <span className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Browse</span>
        <h1 className="mt-4 font-serif text-4xl text-[#E8E8F0] md:text-5xl">Product Categories</h1>
        <p className="mt-4 max-w-2xl text-[#8A8AA0]">
          Explore our specialized catalog of research compounds, organized by application area and compound class.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {categories.map((cat, idx) => {
            const meta = categoryMeta[idx] || categoryMeta[0];
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-[#0A0A10] transition-all hover:-translate-y-1 hover:border-[rgba(120,160,220,0.3)]"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <meta.icon className="h-5 w-5 text-[#5EEAD4]" />
                    <span className="font-mono text-xs text-[#8A8AA0]">{meta.count}</span>
                  </div>
                  <h2 className="font-serif text-2xl text-[#E8E8F0] group-hover:text-[#5EEAD4]">
                    {cat.name}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[#8A8AA0]">
                    {cat.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm text-[#5EEAD4]">
                    Browse Category <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* All Products CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-lg bg-[#5EEAD4] px-8 py-3 text-sm font-medium text-[#050508] transition-all hover:brightness-110"
          >
            View All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
