import { useParams, Link } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';
import { blogPosts } from '@/data/products';
import Breadcrumbs from '@/components/Breadcrumbs';
import ComplianceNotice from '@/components/ComplianceNotice';

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <p className="text-xl text-[#E8E8F0]">Article not found</p>
        <Link to="/blog" className="mt-4 text-[#5EEAD4]">Back to Research Hub</Link>
      </div>
    );
  }

  const related = blogPosts.filter(p => p.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Research Hub', href: '/blog' },
          { label: post.title },
        ]} />

        <article className="mt-8">
          <span className="rounded bg-[#5EEAD4]/10 px-2 py-1 font-mono text-[10px] text-[#5EEAD4]">
            {post.category}
          </span>
          <h1 className="mt-4 font-serif text-3xl text-[#E8E8F0] md:text-4xl">{post.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-[#8A8AA0]">
            <span>Tetrava Research Team</span>
            <span>{new Date(post.date).toLocaleDateString()}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {post.readTime}
            </span>
          </div>

          <div className="mt-8 aspect-video overflow-hidden rounded-xl">
            <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          </div>

          <div className="prose prose-invert mt-10 max-w-none">
            <p className="text-base leading-relaxed text-[#8A8AA0]">
              {post.excerpt} This article provides a comprehensive examination of the subject matter,
              drawing from peer-reviewed literature and established analytical methodologies. Researchers
              should consult primary sources and institutional guidelines before implementing any protocols
              described herein.
            </p>

            <h2 className="mt-8 font-serif text-2xl text-[#E8E8F0]">Background and Context</h2>
            <p className="mt-4 text-base leading-relaxed text-[#8A8AA0]">
              The field of peptide research has advanced significantly in recent years, with improved
              synthesis techniques and analytical methods enabling more precise characterization of
              these complex molecules. Understanding the fundamental properties of peptides is essential
              for designing robust research protocols and interpreting experimental results accurately.
            </p>

            <h2 className="mt-8 font-serif text-2xl text-[#E8E8F0]">Methodology</h2>
            <p className="mt-4 text-base leading-relaxed text-[#8A8AA0]">
              Laboratory analysis typically employs a combination of chromatographic and spectrometric
              techniques. High Performance Liquid Chromatography (HPLC) separates compounds based on
              their physicochemical properties, while Mass Spectrometry (MS) provides molecular weight
              confirmation and structural information.
            </p>

            <div className="my-8 rounded-xl border-l-4 border-[#5EEAD4] bg-[#0A0A10] p-6">
              <p className="text-sm italic leading-relaxed text-[#E8E8F0]">
                &ldquo;The integration of HPLC with tandem mass spectrometry has become the gold standard
                for peptide characterization in research laboratories worldwide.&rdquo;
              </p>
            </div>

            <h2 className="mt-8 font-serif text-2xl text-[#E8E8F0]">Key Findings</h2>
            <p className="mt-4 text-base leading-relaxed text-[#8A8AA0]">
              Research indicates that proper storage conditions and handling protocols are critical
              for maintaining peptide integrity. Lyophilized peptides stored at -20°C demonstrate
              stability over extended periods, while reconstituted solutions require careful temperature
              management to prevent degradation.
            </p>

            <h2 className="mt-8 font-serif text-2xl text-[#E8E8F0]">Practical Considerations</h2>
            <p className="mt-4 text-base leading-relaxed text-[#8A8AA0]">
              When working with research peptides, always handle under appropriate laboratory conditions.
              Use sterile technique during reconstitution, and document all procedures for reproducibility.
              Consult your institution&apos;s safety guidelines and ensure all personnel are trained in
              proper handling procedures.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="mt-12">
            <ComplianceNotice />
          </div>

          {/* Back */}
          <Link
            to="/blog"
            className="mt-10 inline-flex items-center gap-2 text-sm text-[#8A8AA0] transition-colors hover:text-[#5EEAD4]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Research Hub
          </Link>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-serif text-2xl text-[#E8E8F0]">Related Articles</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map(r => (
                <Link
                  key={r.id}
                  to={`/blog/${r.slug}`}
                  className="group rounded-xl border border-white/[0.06] bg-[#0A0A10] p-4 transition-all hover:border-[rgba(120,160,220,0.3)]"
                >
                  <span className="text-[10px] text-[#5EEAD4]">{r.category}</span>
                  <h3 className="mt-2 font-serif text-base text-[#E8E8F0] group-hover:text-[#5EEAD4]">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
