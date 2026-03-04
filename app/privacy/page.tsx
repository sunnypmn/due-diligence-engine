export const metadata = {
  title: "Privacy Policy | Validate.ai",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-2xl mx-auto px-4 py-16">
        <a href="/" className="inline-flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 mb-10">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Validate.ai
        </a>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: March 2025</p>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">What we collect</h2>
            <p>When you use Validate.ai, we collect the information you enter into the analysis form: your idea name, description, target customer, business model, and related fields. If you purchase a business plan, we also collect your email address.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">How we use your information</h2>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>To run the AI analysis pipeline and generate your validation report</li>
              <li>To generate and deliver your business plan if purchased</li>
              <li>To process your payment securely via Stripe</li>
              <li>We do not use your data to train AI models</li>
              <li>We do not sell or share your data with third parties for marketing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">Third-party services</h2>
            <p className="mb-2">We use the following services to operate Validate.ai:</p>
            <ul className="space-y-1.5 list-disc list-inside">
              <li><strong>Anthropic Claude</strong> — processes your idea inputs to generate analysis and reports. Data is sent to Anthropic's API and subject to their privacy policy.</li>
              <li><strong>Stripe</strong> — handles all payment processing. We never store your card details.</li>
              <li><strong>Resend</strong> — delivers your business plan to your email address.</li>
              <li><strong>DuckDuckGo</strong> — used to gather publicly available web search results as part of the analysis.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">Data retention</h2>
            <p>Analysis inputs and results are not stored on our servers beyond the duration of your session. If you purchase a business plan, your email is retained only to deliver the plan and is not used for any other communication unless you opt in.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">Cookies</h2>
            <p>Validate.ai does not use tracking cookies. Stripe may set cookies as part of the checkout process.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">Your rights</h2>
            <p>You may request deletion of any data we hold about you at any time by contacting us. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">Contact</h2>
            <p>Questions about this policy? Email us at <a href="mailto:privacy@validate.ai" className="text-purple-600 hover:underline">privacy@validate.ai</a>.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
