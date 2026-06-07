import { ShieldCheck, Snowflake, FileCheck, Lock, Truck, Package } from 'lucide-react';

const badges = [
  { icon: ShieldCheck, label: 'HPLC Verified', desc: 'Independent lab purity testing' },
  { icon: Snowflake, label: 'Cold-Chain', desc: 'Thermal-protected shipping' },
  { icon: FileCheck, label: 'COA Included', desc: 'Certificate of Analysis' },
  { icon: Lock, label: 'Secure & Discreet', desc: 'Plain packaging, confidential' },
];

export function TrustBadgesRow() {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {badges.map(b => (
        <div key={b.label} className="flex flex-col items-center text-center">
          <b.icon className="mb-3 h-8 w-8 text-[#5EEAD4]" strokeWidth={1.5} />
          <span className="text-sm font-medium text-[#E8E8F0]">{b.label}</span>
          <span className="mt-1 text-xs text-[#8A8AA0]">{b.desc}</span>
        </div>
      ))}
    </div>
  );
}

export function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-4 text-xs text-[#5A5A70]">
      <span className="flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-[#5EEAD4]" /> HPLC Verified
      </span>
      <span className="flex items-center gap-1.5">
        <Snowflake className="h-3.5 w-3.5 text-[#5EEAD4]" /> Cold-Chain
      </span>
      <span className="flex items-center gap-1.5">
        <FileCheck className="h-3.5 w-3.5 text-[#5EEAD4]" /> COA Included
      </span>
      <span className="flex items-center gap-1.5">
        <Lock className="h-3.5 w-3.5 text-[#5EEAD4]" /> Secure Checkout
      </span>
      <span className="flex items-center gap-1.5">
        <Truck className="h-3.5 w-3.5 text-[#5EEAD4]" /> Fast Shipping
      </span>
      <span className="flex items-center gap-1.5">
        <Package className="h-3.5 w-3.5 text-[#5EEAD4]" /> Discreet
      </span>
    </div>
  );
}

export function TrustMicroRow() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-[#8A8AA0]">
      <span className="flex items-center gap-1">
        <ShieldCheck className="h-3.5 w-3.5 text-[#34D399]" /> Verified
      </span>
      <span className="flex items-center gap-1">
        <Snowflake className="h-3.5 w-3.5 text-[#5EEAD4]" /> Cold Ship
      </span>
      <span className="flex items-center gap-1">
        <FileCheck className="h-3.5 w-3.5 text-[#A78BFA]" /> COA Included
      </span>
    </div>
  );
}
