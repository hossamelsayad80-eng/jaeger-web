import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Jaeger Longevity — the rules and guidelines for using the app.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 lg:px-10 pt-20 pb-32">
      <div className="font-label text-[11px] uppercase tracking-widest2 text-gold">
        Legal
      </div>
      <h1 className="mt-3 font-display font-light text-5xl text-bone leading-[0.95]">
        Terms of Service
      </h1>
      <p className="mt-4 text-sm text-mist">Last updated: February 2, 2026</p>

      <div className="mt-10 rule-gold" />

      <div className="mt-12 prose prose-invert max-w-none text-mist leading-relaxed space-y-6">
        <section>
          <h2 className="font-display text-3xl text-bone">1. Acceptance</h2>
          <p>
            By downloading or using the Jaeger Longevity app (&ldquo;Jaeger,&rdquo;
            &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), you agree to
            these Terms of Service. If you do not agree, do not use the app.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-bone">2. Who Can Use the App</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              You must be able to form a legally binding agreement in your country.
            </li>
            <li>You are responsible for keeping your login credentials secure.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-3xl text-bone">3. Medical Disclaimer</h2>
          <p>
            Jaeger provides wellness information for general educational purposes
            only. It is <strong className="text-bone">not medical advice</strong> and
            does not replace a qualified healthcare professional. If you have a
            medical condition or health concerns, consult a licensed professional
            before starting any program.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-bone">
            4. Your Content and Activity
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              You are responsible for the information you log and the actions you
              take in the app.
            </li>
            <li>
              Do not misuse the app through abuse, fraud, unauthorized access, or
              interference with other users.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-3xl text-bone">5. Purchases and Add-ons</h2>
          <p>
            Some content is available as purchasable missions or add-ons via Apple
            In-App Purchase. Pricing and purchase terms are displayed before you
            confirm any purchase. All payments are processed by Apple; we do not
            store your payment card details.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-bone">6. Service Availability</h2>
          <p>
            We may update, change, or discontinue parts of the service to improve the
            product or for operational reasons. We will try to minimize disruption.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-bone">
            7. Intellectual Property
          </h2>
          <p>
            The app, its design, and its content are owned by Jaeger Longevity or its
            licensors and are protected by applicable laws. You may not copy,
            redistribute, or resell the app or its content without permission.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-bone">
            8. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, Jaeger Longevity is not liable
            for indirect, incidental, special, or consequential damages, or any loss
            resulting from your use of the app.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-bone">9. Termination</h2>
          <p>
            We may suspend or terminate your access if you violate these Terms or
            misuse the service. You may stop using the app at any time.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-bone">
            10. Changes to These Terms
          </h2>
          <p>
            We may update these Terms from time to time. We will update the
            &ldquo;Last updated&rdquo; date above when changes are published.
            Continued use after changes constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-bone">11. Contact</h2>
          <p>Questions about these Terms? Contact us:</p>
          <p>
            <strong className="text-bone">Email:</strong>{" "}
            <a
              href="mailto:hossamelsayad@jaegerlongevity.com"
              className="text-gold hover:underline"
            >
              hossamelsayad@jaegerlongevity.com
            </a>
            <br />
            <strong className="text-bone">App:</strong> Jaeger Longevity (iOS)
          </p>
        </section>
      </div>
    </div>
  );
}
