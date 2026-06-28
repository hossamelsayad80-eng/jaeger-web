import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="font-display text-3xl">
            Jaeger<span className="text-gold">.</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-mist leading-relaxed">
            Missions for a longer, sharper life. Nutrition, training, focus —
            finite transformations, no subscriptions.
          </p>
        </div>

        <div>
          <div className="font-label text-[11px] uppercase tracking-widest2 text-gold">
            Explore
          </div>
          <ul className="mt-4 space-y-2 text-sm text-mist">
            <li>
              <Link href="/products" className="hover:text-bone">
                Catalog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-bone">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-bone">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-bone">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/delete-account" className="hover:text-bone">
                Delete Account
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-label text-[11px] uppercase tracking-widest2 text-gold">
            On iOS
          </div>
          <p className="mt-4 text-sm text-mist max-w-xs leading-relaxed">
            The full Jaeger experience — missions, voice-guided training, AI
            coaching — lives in the app.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_APP_STORE_URL ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block px-4 py-2 border border-gold/60 text-gold text-xs font-label uppercase tracking-widest2 hover:bg-gold hover:text-ink transition-colors"
          >
            Get the App
          </a>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 text-xs text-mist flex flex-col md:flex-row justify-between gap-2">
          <div>© {year} Jaeger Longevity. All rights reserved.</div>
          <Link href="/coach/login" className="hover:text-bone">
            Coach Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
