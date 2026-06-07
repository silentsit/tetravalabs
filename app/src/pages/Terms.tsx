export default function Terms() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <span className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Legal</span>
        <h1 className="mt-4 font-serif text-4xl text-[#E8E8F0] md:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-sm text-[#8A8AA0]">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#8A8AA0]">
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">1. Acceptance of Terms</h2>
            <p>By accessing or using the Tetrava Labs website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">2. Eligibility</h2>
            <p>You must be at least 18 years of age and a qualified research professional to purchase from this website. By placing an order, you confirm that you meet these requirements and that all information provided is accurate.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">3. Research Use Only</h2>
            <p>All products are sold strictly for research purposes. They are not intended for human consumption, veterinary use, or therapeutic applications. Buyers are responsible for compliance with all applicable laws and regulations.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">4. Ordering and Payment</h2>
            <p>Orders are subject to acceptance and availability. Prices are listed in USD and do not include shipping or taxes where applicable. Payment must be made in full before orders are processed and shipped.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">5. Shipping and Risk of Loss</h2>
            <p>All items are shipped FOB shipping point. Risk of loss passes to the buyer upon delivery to the carrier. We are not responsible for delays, customs holds, or damage occurring during transit.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">6. Returns and Refunds</h2>
            <p>Due to the nature of research compounds, returns are only accepted for unopened products within 14 days of delivery. Products must be in original packaging. Shipping costs are non-refundable.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">7. Limitation of Liability</h2>
            <p>Tetrava Labs shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products. Our total liability shall not exceed the purchase price of the products ordered.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">8. Intellectual Property</h2>
            <p>All content on this website, including text, images, and logos, is the property of Tetrava Labs and is protected by copyright and trademark laws. Unauthorized use is prohibited.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">9. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Tetrava Labs is registered, without regard to conflict of law principles.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">10. Contact</h2>
            <p>For questions about these Terms of Service, please contact us at legal@tetravalabs.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
