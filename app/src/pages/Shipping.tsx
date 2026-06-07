import { Truck, Snowflake, Globe, Package } from 'lucide-react';
import ComplianceNotice from '@/components/ComplianceNotice';

export default function Shipping() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <span className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Shipping</span>
        <h1 className="mt-4 font-serif text-4xl text-[#E8E8F0] md:text-5xl">Shipping & Delivery</h1>
        <p className="mt-4 text-[#8A8AA0]">
          We ship research compounds worldwide with temperature-controlled packaging and full tracking.
        </p>

        {/* Methods */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { icon: Truck, title: 'Standard', time: '3-5 business days', price: '$9.99', desc: 'Domestic ground shipping with tracking' },
            { icon: Snowflake, title: 'Cold-Chain Express', time: '2-3 business days', price: '$19.99', desc: 'Temperature-controlled with cold packs' },
            { icon: Globe, title: 'International', time: '5-10 business days', price: '$29.99', desc: 'Global delivery with customs handling' },
          ].map(method => (
            <div key={method.title} className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-6">
              <method.icon className="mb-3 h-8 w-8 text-[#5EEAD4]" />
              <h3 className="font-medium text-[#E8E8F0]">{method.title}</h3>
              <p className="mt-1 font-mono text-lg text-[#5EEAD4]">{method.price}</p>
              <p className="mt-2 text-sm text-[#8A8AA0]">{method.desc}</p>
              <p className="mt-1 text-xs text-[#5A5A70]">{method.time}</p>
            </div>
          ))}
        </div>

        {/* Cold Chain Info */}
        <div className="mt-10 rounded-xl border border-white/[0.06] bg-[#0A0A10] p-8">
          <div className="flex items-center gap-3 mb-4">
            <Snowflake className="h-6 w-6 text-[#5EEAD4]" />
            <h2 className="font-serif text-2xl text-[#E8E8F0]">Cold-Chain Shipping</h2>
          </div>
          <p className="text-sm leading-relaxed text-[#8A8AA0]">
            All lyophilized peptides are shipped in insulated packaging with gel cold packs to
            maintain temperature stability during transit. Our packaging is designed to maintain
            appropriate temperatures for 48-72 hours, ensuring your compounds arrive in optimal condition.
          </p>
        </div>

        {/* Delivery Times */}
        <div className="mt-10">
          <h2 className="font-serif text-2xl text-[#E8E8F0] mb-6">Delivery Information</h2>
          <div className="space-y-4">
            {[
              { region: 'United States', time: '2-3 business days', method: 'Cold-Chain Express' },
              { region: 'Canada', time: '3-5 business days', method: 'International Priority' },
              { region: 'United Kingdom / EU', time: '5-7 business days', method: 'International Express' },
              { region: 'Australia / Asia', time: '7-10 business days', method: 'International Express' },
              { region: 'Rest of World', time: '10-14 business days', method: 'International Standard' },
            ].map(row => (
              <div key={row.region} className="flex items-center justify-between border-b border-white/[0.06] py-3">
                <span className="text-sm text-[#E8E8F0]">{row.region}</span>
                <span className="text-sm text-[#8A8AA0]">{row.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Packaging */}
        <div className="mt-10 rounded-xl border border-white/[0.06] bg-[#0A0A10] p-8">
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-6 w-6 text-[#A78BFA]" />
            <h2 className="font-serif text-2xl text-[#E8E8F0]">Discreet Packaging</h2>
          </div>
          <p className="text-sm leading-relaxed text-[#8A8AA0]">
            All orders are shipped in plain, unmarked packaging with no indication of contents.
            Your privacy and confidentiality are important to us. The return address shows only
            our legal business name with no product references.
          </p>
        </div>

        <div className="mt-12">
          <ComplianceNotice />
        </div>
      </div>
    </div>
  );
}
