import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Download, Minus, Plus, ShoppingCart, ShieldCheck, Snowflake, FileCheck, Star } from 'lucide-react';
import { products, reviews } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import ComplianceNotice from '@/components/ComplianceNotice';
import FAQAccordion from '@/components/FAQAccordion';

const tabs = ['Overview', 'Specifications', 'Storage', 'COA', 'Shipping'];

const productFAQs = [
  {
    question: 'What is the purity of this compound?',
    answer: 'All compounds are verified by independent third-party HPLC-MS analysis. The specific purity percentage is listed on each product and documented in the accompanying Certificate of Analysis.',
  },
  {
    question: 'How is this compound shipped?',
    answer: 'Lyophilized peptides are shipped in temperature-controlled packaging with cold packs to maintain stability during transit. All packages are discreet and unmarked.',
  },
];

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState('Overview');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [stickyVisible, setStickyVisible] = useState(false);

  const product = products.find(p => p.slug === slug);

  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-xl text-[#E8E8F0]">Product not found</p>
          <Link to="/shop" className="mt-4 inline-block text-[#5EEAD4]">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const currentPrice = product.variants?.find(v => v.strength === selectedVariant)?.price || product.price;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: product.name },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Product Hero */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-8 grid gap-12 lg:grid-cols-[55%_45%]">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square overflow-hidden rounded-xl border border-white/[0.06] bg-[#0A0A10]">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain p-8 transition-transform duration-500 hover:scale-[1.03]"
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map(i => (
                <button
                  key={i}
                  className={`aspect-square overflow-hidden rounded-lg border bg-[#0A0A10] ${
                    i === 0 ? 'border-[#5EEAD4]' : 'border-white/[0.06]'
                  }`}
                >
                  <img
                    src={product.image}
                    alt={`${product.name} view ${i + 1}`}
                    className="h-full w-full object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <span className="mb-2 inline-block font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">
              {product.subcategory}
            </span>
            <h1 className="font-serif text-4xl text-[#E8E8F0] md:text-5xl">{product.name}</h1>
            <p className="mt-2 text-lg text-[#8A8AA0]">{product.strength} Lyophilized Powder</p>

            {/* Price */}
            <p className="mt-6 font-serif text-4xl text-[#E8E8F0]">${currentPrice.toFixed(2)}</p>

            {/* Purity */}
            <div className="mt-4 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#5EEAD4]" />
              <span className="font-mono text-sm text-[#5EEAD4]">
                {product.purity} HPLC Verified
              </span>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 1 && (
              <div className="mt-6">
                <span className="mb-2 block text-sm text-[#8A8AA0]">Select Size</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(v => (
                    <button
                      key={v.strength}
                      onClick={() => setSelectedVariant(v.strength)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                        selectedVariant === v.strength
                          ? 'border-[#5EEAD4] bg-[#5EEAD4]/10 text-[#5EEAD4]'
                          : 'border-white/[0.06] bg-[#0A0A10] text-[#8A8AA0] hover:border-[#5EEAD4]/50'
                      }`}
                    >
                      {v.strength} — ${v.price.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <span className="mb-2 block text-sm text-[#8A8AA0]">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.06] text-[#E8E8F0] hover:border-[#5EEAD4]"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-lg font-medium text-[#E8E8F0]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.06] text-[#E8E8F0] hover:border-[#5EEAD4]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => addItem(product, quantity, selectedVariant || undefined)}
              className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#5EEAD4] text-base font-medium text-[#050508] transition-all hover:brightness-110"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart — ${(currentPrice * quantity).toFixed(2)}
            </button>

            {/* Download COA */}
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.06] py-3 text-sm text-[#8A8AA0] transition-colors hover:border-[#5EEAD4] hover:text-[#5EEAD4]">
              <Download className="h-4 w-4" /> Download COA (PDF)
            </button>

            {/* Trust Micro Row */}
            <div className="mt-6 flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5 text-xs text-[#8A8AA0]">
                <ShieldCheck className="h-4 w-4 text-[#34D399]" /> Verified
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#8A8AA0]">
                <Snowflake className="h-4 w-4 text-[#5EEAD4]" /> Cold Ship
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#8A8AA0]">
                <FileCheck className="h-4 w-4 text-[#A78BFA]" /> COA Included
              </span>
            </div>

            {/* Compliance */}
            <div className="mt-6">
              <ComplianceNotice compact />
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Tab Bar */}
        <div className="flex gap-0 overflow-x-auto border-b border-white/[0.06]">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-[#5EEAD4] text-[#E8E8F0]'
                  : 'border-transparent text-[#8A8AA0] hover:text-[#E8E8F0]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'Overview' && (
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 font-serif text-xl text-[#E8E8F0]">Research Overview</h3>
                <p className="text-sm leading-relaxed text-[#8A8AA0]">{product.description}</p>
                <p className="mt-4 text-sm leading-relaxed text-[#8A8AA0]">
                  This compound is supplied as a lyophilized powder for maximum stability during storage
                  and transport. Reconstitution should be performed under sterile laboratory conditions
                  using the appropriate solvent for your research protocol. Full analytical data is
                  available in the Certificate of Analysis.
                </p>
              </div>
              <div>
                <h3 className="mb-4 font-serif text-xl text-[#E8E8F0]">Analytical Data</h3>
                <div className="rounded-xl border border-white/[0.06] bg-[#0A0A10]">
                  {[
                    { label: 'CAS Number', value: product.casNumber || 'N/A' },
                    { label: 'Molecular Formula', value: product.molecularFormula || 'N/A' },
                    { label: 'Molecular Weight', value: product.molecularWeight || 'N/A' },
                    { label: 'Purity', value: product.purity },
                    { label: 'Appearance', value: product.appearance },
                    { label: 'Sequence', value: product.sequence || 'N/A' },
                  ].map(row => (
                    <div
                      key={row.label}
                      className="flex justify-between border-b border-white/[0.06] px-5 py-3 last:border-0"
                    >
                      <span className="font-mono text-xs text-[#5A5A70]">{row.label}</span>
                      <span className="font-mono text-xs text-[#E8E8F0]">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Specifications' && (
            <div className="max-w-2xl">
              <h3 className="mb-4 font-serif text-xl text-[#E8E8F0]">Product Specifications</h3>
              <div className="space-y-3">
                {[
                  { label: 'Product Name', value: product.name },
                  { label: 'Catalog Number', value: `AU-${product.id.toUpperCase()}` },
                  { label: 'Strength', value: product.strength },
                  { label: 'Form', value: 'Lyophilized Powder' },
                  { label: 'Purity (HPLC)', value: product.purity },
                  { label: 'Appearance', value: product.appearance },
                  { label: 'Storage', value: '-20°C (lyophilized)' },
                  { label: 'Stability', value: '24 months at -20°C' },
                ].map(spec => (
                  <div key={spec.label} className="flex justify-between border-b border-white/[0.06] py-2">
                    <span className="text-sm text-[#8A8AA0]">{spec.label}</span>
                    <span className="text-sm text-[#E8E8F0]">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Storage' && (
            <div className="max-w-2xl">
              <h3 className="mb-4 font-serif text-xl text-[#E8E8F0]">Storage & Handling</h3>
              <div className="space-y-4 text-sm leading-relaxed text-[#8A8AA0]">
                <p>
                  Store lyophilized powder at -20°C for maximum stability. Avoid repeated freeze-thaw
                  cycles. Once reconstituted, store at 4°C and use within the timeframe specified in
                  your research protocol.
                </p>
                <p>
                  Handle under sterile conditions in a certified laboratory environment. Use appropriate
                  personal protective equipment as required by your institution&apos;s safety guidelines.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'COA' && (
            <div>
              <h3 className="mb-4 font-serif text-xl text-[#E8E8F0]">Certificate of Analysis</h3>
              <p className="mb-6 text-sm text-[#8A8AA0]">
                Each batch is independently tested by third-party laboratories. Download the full COA below.
              </p>
              <div className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#E8E8F0]">HPLC-MS Purity Report</p>
                    <p className="text-sm text-[#8A8AA0]">Batch #{new Date().getFullYear()}-{Math.floor(Math.random() * 9000 + 1000)}</p>
                  </div>
                  <button className="flex items-center gap-2 rounded-lg border border-white/[0.06] px-4 py-2 text-sm text-[#E8E8F0] transition-colors hover:border-[#5EEAD4] hover:text-[#5EEAD4]">
                    <Download className="h-4 w-4" /> Download PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Shipping' && (
            <div className="max-w-2xl">
              <h3 className="mb-4 font-serif text-xl text-[#E8E8F0]">Shipping Information</h3>
              <div className="space-y-4 text-sm leading-relaxed text-[#8A8AA0]">
                <p>
                  All peptides are shipped in temperature-controlled packaging with cold packs to
                  maintain compound integrity during transit. Domestic orders typically arrive within
                  2-3 business days. International orders usually arrive within 5-10 business days.
                </p>
                <p>
                  All packages are shipped in plain, unmarked packaging for confidentiality. Tracking
                  information is provided for all orders.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <h2 className="mb-8 font-serif text-2xl text-[#E8E8F0]">Researcher Reviews</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.slice(0, 3).map(r => (
            <div key={r.id} className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-6">
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>
              <p className="mb-4 text-sm italic leading-relaxed text-[#E8E8F0]">&ldquo;{r.text}&rdquo;</p>
              <p className="text-sm font-medium text-[#E8E8F0]">{r.name}</p>
              <p className="text-xs text-[#8A8AA0]">{r.institution}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="mb-6 font-serif text-2xl text-[#E8E8F0]">Common Questions</h2>
        <FAQAccordion items={productFAQs} />
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <h2 className="mb-8 font-serif text-2xl text-[#E8E8F0]">Related Compounds</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Add to Cart Bar */}
      {stickyVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.06] bg-[#0A0A10]/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
            <div className="flex items-center gap-4">
              <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover" />
              <div>
                <p className="text-sm font-medium text-[#E8E8F0]">{product.name}</p>
                <p className="text-xs text-[#8A8AA0]">${currentPrice.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => addItem(product, quantity, selectedVariant || undefined)}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#5EEAD4] px-6 text-sm font-medium text-[#050508] transition-all hover:brightness-110"
            >
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6 pb-16">
        <ComplianceNotice />
      </div>
    </div>
  );
}
