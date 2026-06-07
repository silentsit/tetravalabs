import { useEffect, useState } from 'react';
import { Star, Users, ShoppingBag, X } from 'lucide-react';

const notifications = [
  { name: 'Dr. Martinez', location: 'Boston, MA', product: 'BPC-157 10mg', time: '2 min ago' },
  { name: 'Research Lab 47', location: 'San Diego, CA', product: 'Semaglutide 5mg', time: '5 min ago' },
  { name: 'Dr. Patel', location: 'Houston, TX', product: 'TB-500 10mg', time: '8 min ago' },
  { name: 'BioTech Inc.', location: 'Research Triangle, NC', product: 'GHK-Cu 100mg', time: '12 min ago' },
  { name: 'Dr. Johnson', location: 'Seattle, WA', product: 'CJC-1295 Blend', time: '15 min ago' },
];

const reviews = [
  { name: 'Dr. Sarah Chen', institution: 'Stanford Research', rating: 5, text: 'Exceptional purity consistency for our longitudinal studies.' },
  { name: 'Dr. Michael Torres', institution: 'MIT Bioengineering', rating: 5, text: 'Reliable cold-chain shipping and great scientific support.' },
  { name: 'Dr. Emily Watson', institution: 'Oxford Molecular', rating: 5, text: 'HPLC-MS verification gives us total confidence in our data.' },
];

export function SocialProofToast() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const showTimer = setTimeout(() => setVisible(true), 3000);
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent(p => (p + 1) % notifications.length);
        setVisible(true);
      }, 500);
    }, 6000);
    return () => { clearTimeout(showTimer); clearInterval(cycle); };
  }, [dismissed]);

  if (dismissed) return null;
  const n = notifications[current];

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="flex max-w-sm items-start gap-3 rounded-xl border border-white/[0.06] bg-[#0A0A10]/95 p-4 shadow-2xl backdrop-blur-md">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5EEAD4]/10">
          <ShoppingBag className="h-5 w-5 text-[#5EEAD4]" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-[#E8E8F0]">
            <span className="font-medium">{n.name}</span> from {n.location}
          </p>
          <p className="text-xs text-[#8A8AA0]">
            Ordered {n.product} · {n.time}
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-[#5A5A70] transition-colors hover:text-[#E8E8F0]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function SocialProofReviews() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {reviews.map(r => (
        <div
          key={r.name}
          className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm"
        >
          <div className="mb-3 flex gap-0.5">
            {Array.from({ length: r.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
            ))}
          </div>
          <p className="mb-4 text-sm italic leading-relaxed text-[#E8E8F0]">
            &ldquo;{r.text}&rdquo;
          </p>
          <div>
            <p className="text-sm font-medium text-[#E8E8F0]">{r.name}</p>
            <p className="text-xs text-[#8A8AA0]">{r.institution}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LiveVisitorCounter() {
  const [count, setCount] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-[#0A0A10]/80 px-4 py-2 backdrop-blur-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#34D399]" />
      </span>
      <Users className="h-4 w-4 text-[#8A8AA0]" />
      <span className="text-xs text-[#8A8AA0]">
        <span className="font-medium text-[#E8E8F0]">{count}</span> researchers browsing
      </span>
    </div>
  );
}
