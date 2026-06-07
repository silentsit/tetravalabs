import { AlertTriangle } from 'lucide-react';

export default function ComplianceNotice({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-[#FBBF24]/20 bg-[#FBBF24]/5 px-3 py-2">
        <AlertTriangle className="h-4 w-4 shrink-0 text-[#FBBF24]" />
        <p className="text-xs leading-relaxed text-[#FBBF24]/80">
          Research Use Only. Not for human consumption.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#FBBF24]/20 bg-[#FBBF24]/5 p-6">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-[#FBBF24]" />
        <h3 className="font-medium text-[#FBBF24]">Research Use Only Disclaimer</h3>
      </div>
      <p className="text-sm leading-relaxed text-[#8A8AA0]">
        All products sold on this website are intended for laboratory research purposes only.
        These compounds are not approved for human consumption, diagnostic use, or therapeutic
        applications. By purchasing from Tetrava Labs, you confirm that you are a
        qualified research professional and will use these materials in compliance with all
        applicable laws and regulations. Always handle under appropriate laboratory conditions.
      </p>
    </div>
  );
}
