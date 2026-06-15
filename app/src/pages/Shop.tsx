import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
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
  { label: 'Purity', value: 'purity' },
];

const moreFAQs = [
  {
    question: 'How do I choose the right peptide for my research?',
    answer: 'Consider your research objectives, the peptide\'s mechanism of action, purity requirements, and compatibility with your analytical methods. Our product pages include detailed specifications and research applications to guide your selection.',
  },
  {
    question: 'What purity levels do you offer?',
    answer: 'All our peptides are ≥99% pure as verified by HPLC-MS analysis. Specific purity percentages are listed on each product page alongside the Certificate of Analysis.',
  },
];

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category') || '';

  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const category = categories.find(c => c.slug === categorySlug);

  const filteredProducts = useMemo(() => {
    let filtered = categorySlug
      ? products.filter(p => p.category === categorySlug)
      : [...products];

    if (activeFilters.includes('in-stock')) {
      filtered = filtered.filter(p => p.inStock);
    }

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'purity':
        filtered.sort((a, b) => parseFloat(b.purity) - parseFloat(a.purity));
        break;
      default:
        break;
    }

    return filtered;
  }, [categorySlug, sortBy, activeFilters]);

  const categorySections = useMemo(() => {
    if (categorySlug) return null;
    return categories
      .map((cat) => ({
        ...cat,
        products: filteredProducts.filter((p) => p.category === cat.slug),
      }))
      .filter((section) => section.products.length > 0);
  }, [categorySlug, filteredProducts]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: category?.name || 'All Products' },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Category Hero */}
      <section className="border-b border-white/[0.06] bg-[#0A0A10] px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="mt-4 font-serif text-4xl text-[#E8E8F0] md:text-5xl">
            {category?.name || 'All Products'}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#8A8AA0]">
            {category?.description || 'Browse our complete catalog of research-use-only peptides, blends, and laboratory supplies. All compounds are HPLC-MS verified with Certificates of Analysis available.'}
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-16 z-30 border-b border-white/[0.06] bg-[#050508]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3 lg:px-10">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-lg border border-white/[0.06] px-4 py-2 text-sm text-[#E8E8F0] transition-colors hover:border-[#5EEAD4]"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filter
          </button>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="rounded-lg border border-white/[0.06] bg-[#0A0A10] px-4 py-2 text-sm text-[#E8E8F0] outline-none focus:border-[#5EEAD4]"
          >
            {sortOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <span className="ml-auto text-sm text-[#5A5A70]">
            {filteredProducts.length} compounds
          </span>
        </div>

        {/* Filter Pills */}
        {showFilters && (
          <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-6 pb-3 lg:px-10">
            <button
              onClick={() => toggleFilter('in-stock')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeFilters.includes('in-stock')
                  ? 'border border-[#5EEAD4] bg-[#5EEAD4]/10 text-[#5EEAD4]'
                  : 'border border-white/[0.06] bg-[#0A0A10] text-[#8A8AA0] hover:text-[#E8E8F0]'
              }`}
            >
              In Stock
              {activeFilters.includes('in-stock') && (
                <X className="ml-1 inline h-3 w-3" />
              )}
            </button>
            {activeFilters.map(f => (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                className="flex items-center gap-1 rounded-full border border-[#5EEAD4] bg-[#5EEAD4]/10 px-3 py-1 text-xs font-medium text-[#5EEAD4]"
              >
                {f} <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Grid */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-xl text-[#E8E8F0]">No compounds match your criteria</p>
            <p className="mt-2 text-sm text-[#8A8AA0]">Try adjusting your filters</p>
          </div>
        ) : categorySections ? (
          <div className="space-y-14">
            {categorySections.map((section) => (
              <section key={section.id} className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.06] pb-4">
                  <div>
                    <h2 className="font-serif text-2xl text-[#E8E8F0] md:text-3xl">{section.name}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8A8AA0]">{section.description}</p>
                  </div>
                  <Link
                    to={`/shop?category=${section.slug}`}
                    className="text-sm font-medium text-[#5EEAD4] hover:text-[#99F6E4]"
                  >
                    View all →
                  </Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {section.products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* SEO Content */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-4 font-serif text-2xl text-[#E8E8F0]">
          About {category?.name || 'Our Research Compounds'}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-[#8A8AA0]">
          Tetrava Labs provides laboratory-grade peptides and research materials
          for qualified scientific institutions. All compounds are synthesized under strict
          quality control conditions and verified by independent third-party laboratories
          using HPLC and Mass Spectrometry analysis.
        </p>
        <p className="mb-4 text-sm leading-relaxed text-[#8A8AA0]">
          Our catalog covers a comprehensive range of research peptides including GLP-1
          receptor agonists, growth factors, tissue repair peptides, metabolic research
          compounds, and specialized laboratory reagents. Each product ships with a
          Certificate of Analysis documenting purity, molecular weight, and chromatographic data.
        </p>
        <p className="text-sm leading-relaxed text-[#8A8AA0]">
          For bulk institutional orders or custom synthesis inquiries, please contact our
          research support team. We serve universities, pharmaceutical research divisions,
          biotechnology companies, and independent research laboratories worldwide.
        </p>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-6 font-serif text-2xl text-[#E8E8F0]">Frequently Asked Questions</h2>
        <FAQAccordion items={moreFAQs} />
      </section>

      <div className="mx-auto max-w-3xl px-6 pb-16">
        <ComplianceNotice />
      </div>
    </div>
  );
}
