import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 lg:px-10 pt-20 pb-32">
      <div className="font-label text-[11px] uppercase tracking-widest2 text-gold">
        Legal
      </div>
      <h1 className="mt-3 font-display font-light text-5xl text-bone leading-[0.95]">
        Privacy Policy
      </h1>

      <div className="mt-10 rule-gold" />

      {/*
        Paste the Shopify-exported privacy policy here (export from
        Shopify admin → Settings → Policies → Privacy policy before
        you deactivate the store).
      */}
      <div className="mt-12 prose prose-invert max-w-none text-mist leading-relaxed space-y-6">
        <p>
          This policy explains how Jaeger Longevity collects, uses, and protects
          information when you interact with our website and iOS application.
        </p>

        <h2 className="font-display text-3xl text-bone">Information we collect</h2>
        <p>
          When you browse this website we collect only the minimum necessary for
          the site to function — request logs, IP, and standard analytics. No
          purchases occur on this site; transactions are handled inside the
          iOS app by Apple through In-App Purchase.
        </p>

        <h2 className="font-display text-3xl text-bone">How we use information</h2>
        <p>
          To operate and improve the site, respond to inquiries, and — when you
          opt in inside the app — to personalize your mission experience.
        </p>

        <h2 className="font-display text-3xl text-bone">Contact</h2>
        <p>
          Questions about this policy can be sent to{" "}
          <a
            href="mailto:privacy@jaegerlongevity.com"
            className="text-gold hover:underline"
          >
            privacy@jaegerlongevity.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
