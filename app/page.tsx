import Link from "next/link";
import { getPublicProducts } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import AppStoreButton from "@/components/AppStoreButton";

// Revalidate the homepage every 5 minutes so product changes show up
// without you redeploying.
export const revalidate = 300;

export default async function HomePage() {
  const products = await getPublicProducts();
  const featured = products.slice(0, 8);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(229,200,122,0.10),_transparent_60%)]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-28 lg:pt-32 lg:pb-40">
          <div className="font-label text-[11px] uppercase tracking-widest2 text-gold animate-rise">
            Est. UAE · Built for the long game
          </div>

          <h1 className="mt-6 font-display font-light text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] text-bone max-w-5xl animate-rise" style={{ animationDelay: "120ms" }}>
            Missions for a <em className="text-gold not-italic">longer,</em>
            <br />
            sharper life.
          </h1>

          <p className="mt-8 max-w-prose2 text-lg text-mist leading-relaxed animate-rise" style={{ animationDelay: "220ms" }}>
            Jaeger replaces the subscription treadmill with finite, mission-based
            transformations across three pillars — nutrition, training, mental focus.
            Every mission has a beginning, a middle, and a measurable end.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4 animate-rise" style={{ animationDelay: "320ms" }}>
            <AppStoreButton />
            <Link
              href="/products"
              className="font-label text-[11px] uppercase tracking-widest2 text-bone/80 hover:text-gold border-b border-bone/20 hover:border-gold pb-1 transition-colors"
            >
              Browse the catalog →
            </Link>
          </div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
          <div className="font-label text-[11px] uppercase tracking-widest2 text-gold">
            Three Pillars
          </div>
          <h2 className="mt-3 font-display font-light text-4xl lg:text-5xl text-bone max-w-3xl">
            Built on what actually moves the needle.
          </h2>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Nutrition",
                body: "Macro-targeted meals, sourced and dialed in for the UAE. No counting, no guesswork — eat the mission.",
              },
              {
                n: "02",
                title: "Training",
                body: "Voice-guided sessions, AirPlay-ready video, on-device rep counting. Train anywhere, scale infinitely.",
              },
              {
                n: "03",
                title: "Mental Focus",
                body: "Breathwork, audio protocols, and AI coaching tuned to where you are in the mission — not a generic feed.",
              },
            ].map((p) => (
              <div key={p.n} className="group">
                <div className="font-display text-6xl text-gold/30 group-hover:text-gold/70 transition-colors">
                  {p.n}
                </div>
                <div className="mt-3 rule-gold w-16" />
                <h3 className="mt-4 font-display text-3xl text-bone">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist max-w-xs">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
              <div>
                <div className="font-label text-[11px] uppercase tracking-widest2 text-gold">
                  Catalog
                </div>
                <h2 className="mt-3 font-display font-light text-4xl lg:text-5xl text-bone">
                  A glimpse inside.
                </h2>
              </div>
              <Link
                href="/products"
                className="font-label text-[11px] uppercase tracking-widest2 text-bone/80 hover:text-gold border-b border-bone/20 hover:border-gold pb-1"
              >
                View all →
              </Link>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA STRIP */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-24 text-center">
          <div className="font-label text-[11px] uppercase tracking-widest2 text-gold">
            Now on iOS
          </div>
          <h2 className="mt-3 font-display font-light text-4xl lg:text-6xl text-bone max-w-3xl mx-auto">
            The full experience lives in the app.
          </h2>
          <p className="mt-5 max-w-prose2 mx-auto text-mist">
            Missions, voice-guided training, AirPlay rep counting, AI coaching,
            HealthKit. Web is the window — the app is the work.
          </p>
          <div className="mt-8 flex justify-center">
            <AppStoreButton />
          </div>
        </div>
      </section>
    </>
  );
}
