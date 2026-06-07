export default function Privacy() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <span className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Legal</span>
        <h1 className="mt-4 font-serif text-4xl text-[#E8E8F0] md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-[#8A8AA0]">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#8A8AA0]">
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">1. Information We Collect</h2>
            <p>We collect information you provide directly, including name, email address, shipping address, and payment information. We also collect browsing data through cookies and similar technologies to improve our services.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">2. How We Use Your Information</h2>
            <p>Your information is used to process orders, communicate with you about your purchases, improve our website, and comply with legal obligations. We do not sell or rent your personal information to third parties.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">3. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All transactions are encrypted using SSL technology.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">4. Cookies</h2>
            <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">5. Third-Party Services</h2>
            <p>We may use third-party services for payment processing, analytics, and shipping. These providers have access to personal information only as necessary to perform their functions.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. You may also object to processing or request data portability. Contact us to exercise these rights.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">7. Data Retention</h2>
            <p>We retain your information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>
          </section>
          <section>
            <h2 className="mb-3 font-serif text-xl text-[#E8E8F0]">9. Contact</h2>
            <p>For privacy-related inquiries, contact us at privacy@tetravalabs.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
