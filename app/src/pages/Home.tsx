import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Wallet, CreditCard, Copy } from 'lucide-react';
import { products, categories, faqs } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { TrustBadgesRow } from '@/components/TrustBadges';
import { SocialProofReviews, LiveVisitorCounter } from '@/components/SocialProofWidget';
import FAQAccordion from '@/components/FAQAccordion';
import ComplianceNotice from '@/components/ComplianceNotice';

/* ──────────── Particle Nebula Hero ──────────── */
function ParticleHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let W = canvas.clientWidth;
    let H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    const vertSrc = `attribute vec2 a_pos; void main(){gl_Position=vec4(a_pos,0,1);}`;
    const fragSrc = `precision highp float;
uniform float u_time;uniform vec2 u_res;uniform vec2 u_mouse;
float hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*0.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
void main(){
vec2 uv=gl_FragCoord.xy/u_res;
vec2 me=u_mouse-uv;
float md=length(me*vec2(1.,2.));
float mi=smoothstep(0.5,0.,md);
float n=hash(gl_FragCoord.xy+u_time*100.);
vec3 col=vec3(0.3,0.8,0.9);
col=mix(col,vec3(0.1,0.4,0.6),n*0.3+mi*0.2);
float i=0.5+n*0.3+mi*0.4;
col*=i;
gl_FragColor=vec4(col,0.9);
}`;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouseX = 0.5, mouseY = 0.5;
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX / W;
      mouseY = 1 - e.clientY / H;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    let raf = 0;
    const render = (t: number) => {
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform1f(uTime, t * 0.001);
      gl!.uniform2f(uRes, canvas.width, canvas.height);
      gl!.uniform2f(uMouse, mouseX * 2 - 1, mouseY * 2 - 1);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onResize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      gl!.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
      />
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Badge */}
        <span className="mb-6 inline-block rounded-full border border-[#5EEAD4] px-4 py-1.5 font-mono text-[11px] tracking-wider text-[#5EEAD4]">
          99.8% PURITY GUARANTEED
        </span>

        {/* Headline */}
        <h1 className="max-w-[800px] font-serif text-5xl leading-[1.05] tracking-tight text-[#E8E8F0] sm:text-6xl md:text-7xl">
          Precision Research Compounds
        </h1>

        {/* Subheadline */}
        <p className="mt-6 max-w-[560px] text-base leading-relaxed text-[#8A8AA0] sm:text-lg">
          Laboratory-grade peptides and research materials. Third-party tested. Global cold-chain shipping.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/shop"
            className="flex h-12 items-center gap-2 rounded-lg bg-[#5EEAD4] px-8 text-sm font-medium text-[#050508] transition-all hover:brightness-110 hover:shadow-[0_0_20px_rgba(94,234,212,0.3)]"
          >
            Shop Catalog <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/coa"
            className="flex h-12 items-center gap-2 rounded-lg border border-white/[0.06] px-8 text-sm text-[#E8E8F0] transition-all hover:border-[#5EEAD4] hover:text-[#5EEAD4]"
          >
            View COA Reports
          </Link>
        </div>

        {/* Live counter */}
        <div className="mt-8">
          <LiveVisitorCounter />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
        <div className="relative h-6 w-[1px] bg-[#5A5A70]">
          <div className="absolute h-1 w-1 animate-bounce rounded-full bg-[#5EEAD4]" style={{ left: '-1.5px' }} />
        </div>
      </div>
    </section>
  );
}

/* ──────────── Featured Categories ──────────── */
function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="mb-12 text-center">
        <h2 className="font-serif text-3xl text-[#E8E8F0] md:text-4xl">Browse by Category</h2>
        <p className="mt-3 text-[#8A8AA0]">Specialized compounds for advanced research protocols</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map(cat => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-[#0A0A10] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(120,160,220,0.3)]"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-serif text-xl text-[#E8E8F0] group-hover:text-[#5EEAD4]">{cat.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#8A8AA0]">{cat.description}</p>
              <span className="mt-auto flex items-center gap-1 pt-4 text-sm text-[#5EEAD4]">
                Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ──────────── Best Sellers ──────────── */
function BestSellers() {
  const bestSellers = products.slice(0, 8);
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#E8E8F0] md:text-4xl">Most Requested</h2>
          <p className="mt-2 text-[#8A8AA0]">Frequently reordered by research institutions</p>
        </div>
        <Link
          to="/shop"
          className="hidden items-center gap-1 text-sm text-[#5EEAD4] transition-colors hover:brightness-110 sm:flex"
        >
          View All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {bestSellers.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

/* ──────────── Trust Protocol ──────────── */
function TrustProtocol() {
  return (
    <section className="border-y border-white/[0.06] bg-[#0A0A10]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <TrustBadgesRow />
      </div>
    </section>
  );
}

/* ──────────── Social Proof ──────────── */
function SocialProofSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-3xl text-[#E8E8F0]">Trusted by Researchers Worldwide</h2>
        <p className="mt-3 text-[#8A8AA0]">What leading research institutions say about us</p>
      </div>
      <SocialProofReviews />
      {/* Institution logos placeholder */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
        {['MIT', 'STANFORD', 'OXFORD', 'HARVARD', 'CALTECH'].map(inst => (
          <span key={inst} className="font-mono text-lg tracking-wider text-[#5A5A70]">
            {inst}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ──────────── Payment Gateway ──────────── */
function PaymentSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="mb-12 text-center">
        <h2 className="font-serif text-3xl text-[#E8E8F0]">Simple Payment System</h2>
        <p className="mt-3 text-[#8A8AA0]">Two paths. Zero friction.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Card 1 - Have Crypto */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-8">
          <Wallet className="mb-4 h-12 w-12 text-[#5EEAD4]" />
          <h3 className="mb-6 font-serif text-xl text-[#E8E8F0]">Have Crypto?</h3>
          <div className="space-y-4">
            {[
              'Add compounds to cart',
              'Select coin at checkout',
              'Send to displayed wallet',
              'We confirm & ship',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5EEAD4] text-xs font-medium text-[#050508]">
                  {i + 1}
                </span>
                <span className="text-sm text-[#E8E8F0]">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2 - New to Crypto */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-8">
          <CreditCard className="mb-4 h-12 w-12 text-[#A78BFA]" />
          <h3 className="mb-6 font-serif text-xl text-[#E8E8F0]">New to Crypto?</h3>
          <div className="space-y-4">
            {[
              'Add to cart',
              "Click 'Buy Crypto' at checkout",
              'Pay with card (no KYC, ~3 min)',
              'Send to our wallet address',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#A78BFA] text-xs font-medium text-[#050508]">
                  {i + 1}
                </span>
                <span className="text-sm text-[#E8E8F0]">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Highlight Box */}
      <div className="mt-8 flex items-center gap-3 rounded-xl border border-[#FBBF24]/20 bg-white/[0.03] p-5">
        <Copy className="h-5 w-5 shrink-0 text-[#FBBF24]" />
        <p className="text-sm text-[#FBBF24]/90">
          When prompted, paste our wallet address exactly as shown at checkout.
        </p>
      </div>
    </section>
  );
}

/* ──────────── FAQ Preview ──────────── */
function FAQPreview() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-3xl text-[#E8E8F0]">Common Questions</h2>
      </div>
      <FAQAccordion items={faqs.slice(0, 4)} />
      <div className="mt-8 text-center">
        <Link
          to="/faq"
          className="inline-flex items-center gap-1 text-sm text-[#5EEAD4] transition-colors hover:brightness-110"
        >
          View All FAQs <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

/* ──────────── Page ──────────── */
export default function Home() {
  return (
    <>
      <ParticleHero />
      <FeaturedCategories />
      <BestSellers />
      <TrustProtocol />
      <SocialProofSection />
      <PaymentSection />
      <FAQPreview />
      <div className="mx-auto max-w-3xl px-6 pb-16">
        <ComplianceNotice />
      </div>
    </>
  );
}
