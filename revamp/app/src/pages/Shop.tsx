import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import ComplianceNotice from '@/components/ComplianceNotice';
import FAQAccordion from '@/components/FAQAccordion';

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A-Z', value: 'name-asc' },
];

const moreFAQs = [
  { question: 'How do I choose the right peptide for my research?', answer: 'Consider your research objectives, the peptide\'s mechanism of action, purity requirements, and compatibility with your analytical methods. Our product pages include detailed specifications.' },
  { question: 'What purity levels do you offer?', answer: 'All peptides are ≥99% pure as verified by HPLC-MS analysis. Specific purity percentages are listed on each product page alongside the Certificate of Analysis.' },
];

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category') || '';
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const activeCategory = categories.find(c => c.slug === categorySlug);

  const sortProducts = (items: typeof products) => {
    const sorted = [...items];
    switch (sortBy) {
      case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
      case 'name-asc': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return sorted;
  };

  const filterProducts = (items: typeof products) => {
    let f = [...items];
    if (categorySlug) {
      f = f.filter(p => p.category === categorySlug);
    }
    if (inStockOnly) f = f.filter(p => p.inStock);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      f = f.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.strength.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return sortProducts(f);
  };

  const allFiltered = filterProducts(products);

  const grouped = useMemo(() => {
    if (categorySlug || searchQuery.trim()) {
      return [{ category: activeCategory, items: allFiltered }];
    }
    const cats = categories.filter(c => products.some(p => p.category === c.slug && (!inStockOnly || p.inStock)));
    return cats.map(c => ({
      category: c,
      items: sortProducts(products.filter(p => p.category === c.slug && (!inStockOnly || p.inStock))),
    })).filter(g => g.items.length > 0);
  }, [categorySlug, inStockOnly, searchQuery, sortBy, allFiltered, activeCategory]);

  return (
    <div className="min-h-screen">
      <section className="border-b border-[#E2E8F0] bg-white px-4 pt-16 pb-10 sm:px-6 lg:px-16">
        <div className="page-container">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: activeCategory?.name || 'All Products' }]} />
          <h1 className="mt-4 font-serif text-4xl text-[#0F172A] md:text-5xl">{activeCategory?.name || 'All Products'}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475569]">
            {activeCategory?.description || 'Browse our complete catalog of research-use-only peptides, blends, and laboratory supplies. All compounds are HPLC-MS verified with Certificates of Analysis available.'}
          </p>
        </div>
      </section>

      {!categorySlug && !searchQuery.trim() && (
        <div className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="page-container flex flex-wrap gap-2 py-3">
            {categories.map(c => {
              const count = products.filter(p => p.category === c.slug && (!inStockOnly || p.inStock)).length;
              return (
                <Link
                  key={c.slug}
                  to={`/shop?category=${c.slug}`}
                  className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm text-[#475569] transition-colors hover:border-[#0D9488] hover:text-[#0D9488]"
                >
                  {c.name}
                  <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 font-mono text-[10px] text-[#94A3B8]">{count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="sticky top-16 z-30 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md">
        <div className="page-container flex flex-wrap items-center gap-3 py-3">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm text-[#0F172A] transition-colors hover:border-[#0D9488]">
            <SlidersHorizontal className="h-4 w-4" /> Filter
          </button>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm text-[#0F172A] outline-none focus:border-[#0D9488]">
            {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search compounds..."
              className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2 pl-10 pr-4 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#0D9488]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <span className="ml-auto text-sm text-[#94A3B8]">{allFiltered.length} compounds</span>
        </div>
        {showFilters && (
          <div className="page-container flex flex-wrap gap-2 pb-3">
            <button onClick={() => setInStockOnly(!inStockOnly)} className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${inStockOnly ? 'border border-[#0D9488] bg-[#CCFBF1] text-[#0D9488]' : 'border border-[#E2E8F0] bg-white text-[#475569] hover:text-[#0F172A]'}`}>
              In Stock {inStockOnly && <X className="ml-1 inline h-3 w-3" />}
            </button>
          </div>
        )}
      </div>

      <section className="page-container py-10">
        {allFiltered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-xl text-[#0F172A]">No compounds match your criteria</p>
            <p className="mt-2 text-sm text-[#94A3B8]">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-16">
            {grouped.map(({ category: cat, items }) => (
              <div key={cat?.slug || 'all'}>
                {cat && !categorySlug && (
                  <div className="mb-6 flex items-center gap-4 border-b border-[#E2E8F0] pb-3">
                    <h2 className="font-serif text-2xl text-[#0F172A]">{cat.name}</h2>
                    <span className="rounded-full bg-[#F1F5F9] px-3 py-1 font-mono text-xs text-[#94A3B8]">{items.length} compounds</span>
                    <Link to={`/shop?category=${cat.slug}`} className="ml-auto text-sm text-[#0D9488] transition-colors hover:text-[#0F766E]">
                      View all →
                    </Link>
                  </div>
                )}
                <div className="product-card-grid">
                  {items.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="page-container max-w-3xl pb-16">
        <h2 className="mb-4 font-serif text-2xl text-[#0F172A]">About {activeCategory?.name || 'Our Research Compounds'}</h2>
        <p className="mb-4 text-sm leading-relaxed text-[#475569]">Tetrava Labs provides laboratory-grade peptides and research materials for qualified scientific institutions. All compounds are synthesized under strict quality control conditions and verified by independent third-party laboratories using HPLC and Mass Spectrometry analysis.</p>
        <p className="mb-4 text-sm leading-relaxed text-[#475569]">Our catalog covers a comprehensive range of research peptides including GLP-1 receptor agonists, growth factors, tissue repair peptides, metabolic research compounds, and specialized laboratory reagents. Each product ships with a Certificate of Analysis documenting purity, molecular weight, and chromatographic data.</p>
      </section>

      <section className="page-container max-w-3xl pb-16">
        <h2 className="mb-6 font-serif text-2xl text-[#0F172A]">Frequently Asked Questions</h2>
        <FAQAccordion items={moreFAQs} />
      </section>

      <div className="page-container max-w-3xl pb-16"><ComplianceNotice /></div>
    </div>
  );
}
