import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Account",
  description: "How to delete your Jaeger Longevity account and personal data.",
};

export default function DeleteAccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 lg:px-10 pt-20 pb-32">
      <div className="font-label text-[11px] uppercase tracking-widest2 text-gold">
        Account
      </div>
      <h1 className="mt-3 font-display font-light text-5xl text-bone leading-[0.95]">
        Delete Your Account
      </h1>
      <p className="mt-4 text-sm text-mist">Your data, your choice.</p>

      <div className="mt-10 rule-gold" />

      <div className="mt-12 prose prose-invert max-w-none text-mist leading-relaxed space-y-6">
        <p>
          You can permanently delete your Jaeger Longevity account and all
          associated personal data at any time. There are two ways to do this:
        </p>

        <section>
          <h2 className="font-display text-3xl text-bone">
            Option 1 — Delete in the App (Recommended)
          </h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Open the Jaeger Longevity app.</li>
            <li>
              Tap the <strong className="text-bone">profile icon</strong> in the
              top-right corner.
            </li>
            <li>
              Go to <strong className="text-bone">Settings</strong>.
            </li>
            <li>
              Scroll to the bottom and tap{" "}
              <strong className="text-bone">Delete Account</strong>.
            </li>
            <li>Confirm the deletion when prompted.</li>
          </ol>
          <p>
            Your account and all personal data — including your profile, health
            notes, food and training logs, and AI coach conversations — will be
            permanently removed from our active systems within{" "}
            <strong className="text-bone">30 days</strong>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-bone">
            Option 2 — Request by Email
          </h2>
          <p>
            If you no longer have access to the app, email us from the address
            associated with your account:
          </p>
          <div className="mt-4 border border-white/10 bg-ink2 p-6 space-y-2">
            <p>
              <strong className="text-bone">Email:</strong>{" "}
              <a
                href="mailto:hossamelsayad80@gmail.com"
                className="text-gold hover:underline"
              >
                hossamelsayad80@gmail.com
              </a>
            </p>
            <p>
              <strong className="text-bone">Subject line:</strong> Delete my account
            </p>
            <p>
              <strong className="text-bone">Response time:</strong> Within 1–2
              business days
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl text-bone">What Gets Deleted</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your profile, goals, and body metrics</li>
            <li>Health notes, conditions, and medications you entered</li>
            <li>Food, training, and check-in logs</li>
            <li>AI coach conversation history</li>
            <li>Messages, bookings, and notification settings</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-3xl text-bone">
            What Happens to Purchases
          </h2>
          <p>
            Mission unlocks are tied to your Apple ID, not your Jaeger account. If
            you create a new account in the future, you can restore any previous
            purchases via <strong className="text-bone">Restore Purchases</strong> on
            the mission screen.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-bone">Apple Health Data</h2>
          <p>
            Jaeger reads Apple Health data but does not store it on our servers.
            Deleting your Jaeger account does not affect data stored in Apple Health.
            To remove Jaeger&rsquo;s access to Health, go to{" "}
            <strong className="text-bone">
              iOS Settings → Privacy &amp; Security → Health → Jaeger
            </strong>{" "}
            and revoke all permissions.
          </p>
        </section>
      </div>
    </div>
  );
}
