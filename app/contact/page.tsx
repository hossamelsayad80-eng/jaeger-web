import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@jaegerlongevity.com";

  return (
    <div className="mx-auto max-w-3xl px-6 lg:px-10 pt-20 pb-32">
      <div className="font-label text-[11px] uppercase tracking-widest2 text-gold">
        Contact
      </div>
      <h1 className="mt-3 font-display font-light text-5xl lg:text-7xl text-bone leading-[0.95]">
        Talk to us.
      </h1>
      <p className="mt-6 text-mist max-w-prose2">
        Partnerships, press, retreats, vending placements, or just to say hello.
        Email is the fastest path in.
      </p>

      <div className="mt-12 rule-gold" />

      <div className="mt-12 grid sm:grid-cols-2 gap-10">
        <div>
          <div className="font-label text-[11px] uppercase tracking-widest2 text-gold">
            Email
          </div>
          <a
            href={`mailto:${email}`}
            className="mt-2 inline-block font-display text-2xl text-bone hover:text-gold transition-colors"
          >
            {email}
          </a>
        </div>
        <div>
          <div className="font-label text-[11px] uppercase tracking-widest2 text-gold">
            Based
          </div>
          <div className="mt-2 font-display text-2xl text-bone">
            United Arab Emirates
          </div>
        </div>
      </div>
    </div>
  );
}
