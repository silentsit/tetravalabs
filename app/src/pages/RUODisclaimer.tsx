import { AlertTriangle, FlaskConical, ShieldCheck, BookOpen } from 'lucide-react';

export default function RUODisclaimer() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <span className="font-mono text-xs uppercase tracking-wider text-[#FBBF24]">Legal</span>
        <h1 className="mt-4 font-serif text-4xl text-[#E8E8F0] md:text-5xl">Research Use Only Disclaimer</h1>

        <div className="mt-8 rounded-xl border border-[#FBBF24]/20 bg-[#FBBF24]/5 p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-[#FBBF24]" />
            <h2 className="font-medium text-[#FBBF24]">Important Notice</h2>
          </div>
          <p className="text-sm leading-relaxed text-[#FBBF24]/80">
            All products available on this website are strictly for research purposes only. They are
            not intended for human consumption, veterinary use, diagnostic purposes, or any therapeutic
            application. By accessing this website and purchasing any products, you acknowledge and agree
            to the terms outlined in this disclaimer.
          </p>
        </div>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#8A8AA0]">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <FlaskConical className="h-5 w-5 text-[#5EEAD4]" />
              <h2 className="font-serif text-xl text-[#E8E8F0]">Intended Use</h2>
            </div>
            <p>
              The compounds offered on this website are sold exclusively for laboratory research purposes.
              These materials are to be used only by qualified professionals in controlled laboratory
              settings. Research may include in vitro studies, analytical method development, and other
              scientific investigations that do not involve human or animal subjects.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-[#5EEAD4]" />
              <h2 className="font-serif text-xl text-[#E8E8F0]">Buyer Responsibility</h2>
            </div>
            <p>
              By purchasing from Tetrava Labs, you confirm that you are a qualified research
              professional or represent a legitimate research institution. You agree to use all products
              in compliance with applicable laws and regulations in your jurisdiction. You understand that
              these compounds are not approved for human consumption by any regulatory authority.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-[#5EEAD4]" />
              <h2 className="font-serif text-xl text-[#E8E8F0]">Regulatory Compliance</h2>
            </div>
            <p>
              The sale and use of research compounds are subject to various local, national, and
              international regulations. It is the buyer&apos;s responsibility to ensure that the
              purchase, possession, and use of these materials comply with all applicable laws in their
              jurisdiction. Tetrava Labs does not condone any illegal use of its products.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#E8E8F0] mb-3">No Medical Claims</h2>
            <p>
              Tetrava Labs makes no claims regarding the safety, efficacy, or suitability
              of any product for any purpose. Product descriptions are provided for informational
              purposes only and should not be construed as medical advice, treatment recommendations,
              or endorsements of any kind.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#E8E8F0] mb-3">Limitation of Liability</h2>
            <p>
              Tetrava Labs shall not be held liable for any damages arising from the misuse,
              mishandling, or illegal use of any products sold. The buyer assumes all responsibility for
              the proper storage, handling, and use of purchased compounds. In no event shall our liability
              exceed the purchase price of the product in question.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#E8E8F0] mb-3">Contact</h2>
            <p>
              If you have any questions about this Research Use Only Disclaimer, please contact us at
              legal@tetravalabs.com. We are committed to supporting legitimate scientific research
              while ensuring compliance with all applicable regulations.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
