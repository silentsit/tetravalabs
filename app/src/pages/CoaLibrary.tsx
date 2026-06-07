import { useState } from 'react';
import { Search, Download, Beaker } from 'lucide-react';
import { products } from '@/data/products';

export default function CoaLibrary() {
  const [search, setSearch] = useState('');

  const filtered = search
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <span className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Quality</span>
        <h1 className="mt-4 font-serif text-4xl text-[#E8E8F0] md:text-5xl">COA Library</h1>
        <p className="mt-4 max-w-2xl text-[#8A8AA0]">
          Download Certificates of Analysis for all our research compounds. Every batch is independently
          tested by third-party laboratories.
        </p>

        {/* Search */}
        <div className="relative mt-8">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5A5A70]" />
          <input
            type="text"
            placeholder="Search compounds..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-12 w-full rounded-lg border border-white/[0.06] bg-[#0A0A10] pl-12 pr-4 text-sm text-[#E8E8F0] outline-none placeholder:text-[#5A5A70] focus:border-[#5EEAD4]"
          />
        </div>

        {/* COA List */}
        <div className="mt-8 space-y-3">
          {filtered.map(product => (
            <div
              key={product.id}
              className="flex flex-col gap-4 rounded-xl border border-white/[0.06] bg-[#0A0A10] p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#5EEAD4]/10">
                  <Beaker className="h-6 w-6 text-[#5EEAD4]" />
                </div>
                <div>
                  <p className="font-medium text-[#E8E8F0]">{product.name}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-[#8A8AA0]">
                    <span>{product.strength}</span>
                    <span className="rounded bg-[#5EEAD4]/10 px-1.5 py-0.5 text-[#5EEAD4]">
                      {product.purity}
                    </span>
                    <span>Batch #{new Date().getFullYear()}-{Math.floor(Math.random() * 9000 + 1000)}</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 rounded-lg border border-white/[0.06] px-4 py-2 text-sm text-[#8A8AA0] transition-colors hover:border-[#5EEAD4] hover:text-[#5EEAD4] sm:self-auto">
                <Download className="h-4 w-4" /> Download COA
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 text-center">
            <p className="text-[#E8E8F0]">No compounds found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
