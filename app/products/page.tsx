import { getPublicProducts } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Every Jaeger mission, meal, and protocol in one place. Available inside the iOS app.",
};

export default async function CatalogPage() {
  const products = await getPublicProducts();

  // Group by category for editorial flow; fall back to a single bucket.
  const byPillar = new Map<string, typeof products>();
  for (const p of products) {
    const key = (p.category ?? p.pillar ?? "All").trim();
    if (!byPillar.has(key)) byPillar.set(key, []);
    byPillar.get(key)!.push(p);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24">
      <header className="mb-16">
        <div className="font-label text-[11px] uppercase tracking-widest2 text-gold">
          Catalog
        </div>
        <h1 className="mt-3 font-display font-light text-5xl lg:text-7xl text-bone leading-[0.95]">
          Everything we make.
        </h1>
        <p className="mt-6 max-w-prose2 text-mist">
          Missions, meals, and audio protocols. Purchase and complete inside the iOS app —
          this catalog is the showroom.
        </p>
      </header>

      {products.length === 0 ? (
        <div className="py-24 text-center text-mist">
          <p>No products to show yet. Check back shortly.</p>
        </div>
      ) : (
        <div className="space-y-20">
          {[...byPillar.entries()].map(([pillar, items]) => (
            <section key={pillar}>
              <div className="flex items-end justify-between mb-8">
                <h2 className="font-display text-3xl lg:text-4xl text-bone capitalize">
                  {pillar}
                </h2>
                <div className="font-label text-[11px] uppercase tracking-widest2 text-mist">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </div>
              </div>
              <div className="rule-gold mb-10" />
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
