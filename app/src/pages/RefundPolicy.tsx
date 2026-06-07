export default function RefundPolicy() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <span className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Legal</span>
        <h1 className="mt-4 font-serif text-4xl text-[#E8E8F0] md:text-5xl">Refund Policy</h1>
        <p className="mt-4 text-sm text-[#8A8AA0]">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#8A8AA0]">
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">Overview</h2>
            <p>At Tetrava Labs, we are committed to the quality and integrity of our research compounds. Due to the specialized nature of these products, our refund policy has specific conditions to ensure safety and compliance.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">Eligibility for Returns</h2>
            <p>Returns are accepted only for unopened products in their original packaging within 14 days of delivery. Products must be unused and sealed. Opened or reconstituted products cannot be returned due to stability and contamination concerns.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">Return Process</h2>
            <p>To initiate a return, contact our support team at support@tetravalabs.com with your order number and reason for return. We will provide a return authorization and instructions. Returns without authorization will not be accepted.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">Refunds</h2>
            <p>Approved returns will receive store credit for the product value. Original shipping costs are non-refundable. The customer is responsible for return shipping costs unless the return is due to our error (wrong item shipped, damaged in transit).</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">Damaged or Incorrect Orders</h2>
            <p>If your order arrives damaged or incorrect, contact us within 48 hours of delivery with photographic evidence. We will arrange a replacement or refund at no additional cost.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">Non-Returnable Items</h2>
            <p>Opened vials, reconstituted products, custom synthesis orders, and products damaged due to improper storage by the customer are not eligible for return or refund.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">Processing Time</h2>
            <p>Refunds and store credits are processed within 5-7 business days after we receive and inspect the returned item.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">Contact</h2>
            <p>For refund-related questions, contact support@tetravalabs.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
