import { FlaskConical, ShieldCheck, Users, Globe } from 'lucide-react';
import { TrustBadgesRow } from '@/components/TrustBadges';
import ComplianceNotice from '@/components/ComplianceNotice';

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <span className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">About Us</span>
        <h1 className="mt-4 font-serif text-4xl text-[#E8E8F0] md:text-5xl">About Tetrava</h1>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-[#8A8AA0]">
          <p>
            Tetrava Labs was founded with a singular mission: to provide the scientific
            community with access to high-quality, verified research compounds. We understand that
            the integrity of your research depends on the reliability of your materials, which is
            why every product in our catalog undergoes rigorous third-party testing.
          </p>
          <p>
            Our team comprises researchers, analytical chemists, and logistics specialists who
            collectively bring decades of experience in peptide synthesis, quality control, and
            scientific supply chain management. We serve research institutions, pharmaceutical
            companies, biotechnology firms, and independent laboratories across six continents.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { icon: FlaskConical, label: 'Compounds', value: '120+' },
            { icon: ShieldCheck, label: 'Purity Standard', value: '99%+' },
            { icon: Users, label: 'Research Clients', value: '5,000+' },
            { icon: Globe, label: 'Countries Shipped', value: '40+' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-6 text-center">
              <stat.icon className="mx-auto mb-3 h-6 w-6 text-[#5EEAD4]" />
              <p className="font-serif text-2xl text-[#E8E8F0]">{stat.value}</p>
              <p className="mt-1 text-xs text-[#8A8AA0]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="mt-12 rounded-xl border border-white/[0.06] bg-[#0A0A10] p-8">
          <h2 className="font-serif text-2xl text-[#E8E8F0]">Our Mission</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#8A8AA0]">
            To advance scientific discovery by providing researchers with the highest quality
            research compounds, backed by transparent analytical data and exceptional customer
            support. We believe that reliable materials are the foundation of reliable science.
          </p>
        </div>

        {/* Trust */}
        <div className="mt-12">
          <h2 className="mb-8 text-center font-serif text-2xl text-[#E8E8F0]">Why Researchers Trust Us</h2>
          <TrustBadgesRow />
        </div>

        <div className="mt-12">
          <ComplianceNotice />
        </div>
      </div>
    </div>
  );
}
