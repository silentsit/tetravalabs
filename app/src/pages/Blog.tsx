import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { blogPosts } from '@/data/products';
import { useState } from 'react';

const filters = ['All', 'Protocols', 'Analytical', 'Compliance'];

export default function Blog() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-4 text-center">
          <span className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Research Hub</span>
          <h1 className="mt-2 font-serif text-4xl text-[#E8E8F0] md:text-5xl">Research Hub</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[#8A8AA0]">
            Protocols, analytical methods, and compound insights for the scientific community.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-2 text-sm transition-all ${
                activeFilter === f
                  ? 'bg-[#5EEAD4] text-[#050508]'
                  : 'bg-[#0A0A10] text-[#8A8AA0] hover:text-[#E8E8F0]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(post => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-[#0A0A10] transition-all hover:-translate-y-1 hover:border-[rgba(120,160,220,0.3)]"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="mb-2 inline-block w-fit rounded bg-[#5EEAD4]/10 px-2 py-0.5 font-mono text-[10px] text-[#5EEAD4]">
                  {post.category}
                </span>
                <h3 className="font-serif text-lg text-[#E8E8F0] group-hover:text-[#5EEAD4]">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-[#8A8AA0]">{post.excerpt}</p>
                <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-[#5A5A70]">
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
