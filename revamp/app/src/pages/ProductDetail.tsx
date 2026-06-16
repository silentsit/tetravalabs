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
  { question: 'What is the purity of this compound?', answer: 'All compounds are verified by independent third-party HPLC-MS analysis. The specific purity percentage is listed on each product and documented in the accompanying Certificate of Analysis.' },
  { question: 'How is this compound shipped?', answer: 'Lyophilized peptides are shipped in temperature-controlled packaging with cold packs. All packages are discreet and unmarked.' },
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

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!product) return <div className="flex min-h-screen items-center justify-center pt-20"><div className="text-center"><p className="text-xl text-[#0F172A]">Product not found</p><Link to="/shop" className="mt-4 text-[#0D9488]">Back to Shop</Link></div></div>;

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const currentPrice = product.variants?.find(v => v.strength === selectedVariant)?.price || product.price;

  return (
    <div className="min-h-screen">
      <section className="page-container pt-10 pb-12">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop' }, { label: product.name }]} />
        <div className="mt-8 grid gap-12 lg:grid-cols-[55%_45%]">
          {/* Image */}
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <img src={product.image} alt={product.name} className="h-full w-full object-contain p-8 transition-transform duration-500 hover:scale-[1.03]" />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map(i => (
                <button key={i} className={`aspect-square overflow-hidden rounded-xl border bg-[#F8FAFC] ${i === 0 ? 'border-[#0D9488]' : 'border-[#E2E8F0]'}`}>
                  <img src={product.image} alt={`${product.name} view ${i + 1}`} className="h-full w-full object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <span className="mb-2 inline-block font-mono text-xs uppercase tracking-wider text-[#0D9488]">{product.subcategory}</span>
            <h1 className="font-serif text-4xl text-[#0F172A] md:text-5xl">{product.name}</h1>
            <p className="mt-2 text-lg text-[#475569]">{product.strength} Lyophilized Powder</p>
            <p className="mt-6 font-serif text-4xl text-[#0F172A]">${currentPrice.toFixed(2)}</p>
            <div className="mt-4 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#0D9488]" />
              <span className="font-mono text-sm text-[#0D9488]">{product.purity} HPLC Verified</span>
            </div>

            {product.variants && product.variants.length > 1 && (
              <div className="mt-6">
                <span className="mb-2 block text-sm text-[#475569]">Select Size</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(v => (
                    <button key={v.strength} onClick={() => setSelectedVariant(v.strength)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${selectedVariant === v.strength ? 'border-[#0D9488] bg-[#CCFBF1] text-[#0D9488]' : 'border-[#E2E8F0] bg-white text-[#475569] hover:border-[#0D9488]/50'}`}>
                      {v.strength} — ${v.price.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <span className="mb-2 block text-sm text-[#475569]">Quantity</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#0F172A] hover:border-[#0D9488]"><Minus className="h-4 w-4" /></button>
                <span className="w-8 text-center text-lg font-medium text-[#0F172A]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#0F172A] hover:border-[#0D9488]"><Plus className="h-4 w-4" /></button>
              </div>
            </div>

            <button onClick={() => addItem(product, quantity, selectedVariant || undefined)} className="btn-cta mt-6 w-full gap-2 text-base">
              <ShoppingCart className="h-5 w-5" /> Add to Cart — ${(currentPrice * quantity).toFixed(2)}
            </button>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] py-3 text-sm text-[#475569] hover:border-[#0D9488] hover:text-[#0D9488] transition-colors">
              <Download className="h-4 w-4" /> Download COA (PDF)
            </button>

            <div className="mt-6 flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5 text-xs text-[#475569]"><ShieldCheck className="h-4 w-4 text-[#059669]" /> Verified</span>
              <span className="flex items-center gap-1.5 text-xs text-[#475569]"><Snowflake className="h-4 w-4 text-[#0D9488]" /> Cold Ship</span>
              <span className="flex items-center gap-1.5 text-xs text-[#475569]"><FileCheck className="h-4 w-4 text-[#2563EB]" /> COA Included</span>
            </div>
            <div className="mt-6"><ComplianceNotice compact /></div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="page-container pb-12">
        <div className="flex gap-0 overflow-x-auto border-b border-[#E2E8F0]">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap border-b-2 px-5 py-3 text-sm font-medium transition-colors ${activeTab === tab ? 'border-[#0D9488] text-[#0F172A]' : 'border-transparent text-[#94A3B8] hover:text-[#475569]'}`}>{tab}</button>
          ))}
        </div>
        <div className="py-8">
          {activeTab === 'Overview' && (
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 font-serif text-xl text-[#0F172A]">Research Overview</h3>
                <p className="text-sm leading-relaxed text-[#475569]">{product.description}</p>
                <p className="mt-4 text-sm leading-relaxed text-[#475569]">This compound is supplied as a lyophilized powder for maximum stability during storage and transport. Reconstitution should be performed under sterile laboratory conditions.</p>
              </div>
              <div>
                <h3 className="mb-4 font-serif text-xl text-[#0F172A]">Analytical Data</h3>
                <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
                  {[{l:'CAS Number',v:product.casNumber||'N/A'},{l:'Molecular Formula',v:product.molecularFormula||'N/A'},{l:'Molecular Weight',v:product.molecularWeight||'N/A'},{l:'Purity',v:product.purity},{l:'Appearance',v:product.appearance},{l:'Sequence',v:product.sequence||'N/A'}].map(row => (
                    <div key={row.l} className="flex justify-between border-b border-[#E2E8F0] px-5 py-3 last:border-0">
                      <span className="font-mono text-xs text-[#94A3B8]">{row.l}</span>
                      <span className="font-mono text-xs text-[#0F172A]">{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Specifications' && (
            <div className="max-w-2xl">
              <h3 className="mb-4 font-serif text-xl text-[#0F172A]">Product Specifications</h3>
              <div className="space-y-3">
                {[{l:'Product Name',v:product.name},{l:'Catalog Number',v:`TV-${product.id.toUpperCase()}`},{l:'Strength',v:product.strength},{l:'Form',v:'Lyophilized Powder'},{l:'Purity (HPLC)',v:product.purity},{l:'Appearance',v:product.appearance},{l:'Storage',v:'-20°C (lyophilized)'},{l:'Stability',v:'24 months at -20°C'}].map(s => (
                  <div key={s.l} className="flex justify-between border-b border-[#E2E8F0] py-2"><span className="text-sm text-[#475569]">{s.l}</span><span className="text-sm text-[#0F172A]">{s.v}</span></div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'Storage' && (
            <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-[#475569]">
              <p>Store lyophilized powder at -20°C for maximum stability. Avoid repeated freeze-thaw cycles. Once reconstituted, store at 4°C.</p>
              <p>Handle under sterile conditions in a certified laboratory environment. Use appropriate personal protective equipment.</p>
            </div>
          )}
          {activeTab === 'COA' && (
            <div>
              <h3 className="mb-4 font-serif text-xl text-[#0F172A]">Certificate of Analysis</h3>
              <p className="mb-6 text-sm text-[#475569]">Each batch is independently tested by third-party laboratories.</p>
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#0F172A]">HPLC-MS Purity Report</p>
                    <p className="text-sm text-[#94A3B8]">Batch #{new Date().getFullYear()}-{Math.floor(Math.random()*9000+1000)}</p>
                  </div>
                  <button className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm text-[#0F172A] hover:border-[#0D9488] hover:text-[#0D9488] transition-colors"><Download className="h-4 w-4" /> Download PDF</button>
                </div>
                <div className="mt-6 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <img src="/v2/coa-preview.jpg" alt="COA chromatogram preview" className="w-full rounded-lg" />
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Shipping' && (
            <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-[#475569]">
              <p>All peptides are shipped in temperature-controlled packaging with cold packs. Domestic orders arrive within 2-3 business days. International orders within 5-10 business days.</p>
              <p>All packages are shipped in plain, unmarked packaging for confidentiality. Tracking information is provided for all orders.</p>
            </div>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="page-container pb-12">
        <h2 className="mb-8 font-serif text-2xl text-[#0F172A]">Researcher Reviews</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.slice(0,3).map(r => (
            <div key={r.id} className="rounded-xl border border-[#E2E8F0] bg-white p-6">
              <div className="mb-3 flex gap-0.5">{Array.from({length:r.rating}).map((_,i)=><Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]"/>)}</div>
              <p className="mb-4 text-sm italic leading-relaxed text-[#0F172A]">&ldquo;{r.text}&rdquo;</p>
              <p className="text-sm font-medium text-[#0F172A]">{r.name}</p>
              <p className="text-xs text-[#94A3B8]">{r.institution}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-container max-w-3xl pb-12">
        <h2 className="mb-6 font-serif text-2xl text-[#0F172A]">Common Questions</h2>
        <FAQAccordion items={productFAQs} />
      </section>

      {related.length > 0 && (
        <section className="page-container pb-16">
          <h2 className="mb-8 font-serif text-2xl text-[#0F172A]">Related Compounds</h2>
          <div className="product-card-grid">{related.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}

      {stickyVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E2E8F0] bg-white/95 backdrop-blur-md">
          <div className="page-container flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg object-cover" />
              <div><p className="text-sm font-medium text-[#0F172A]">{product.name}</p><p className="text-xs text-[#94A3B8]">${currentPrice.toFixed(2)}</p></div>
            </div>
            <button onClick={() => addItem(product, quantity, selectedVariant || undefined)} className="btn-cta gap-2"><ShoppingCart className="h-4 w-4" /> Add to Cart</button>
          </div>
        </div>
      )}

      <div className="page-container max-w-3xl pb-16"><ComplianceNotice /></div>
    </div>
  );
}
