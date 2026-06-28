import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-ink/70 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-2xl tracking-wide text-bone hover:text-gold transition-colors"
          aria-label="Jaeger Longevity — home"
        >
          Jaeger<span className="text-gold">.</span>
        </Link>
        <nav className="flex items-center gap-8 font-label text-[11px] uppercase tracking-widest2 text-mist">
          <Link href="/products" className="hover:text-bone transition-colors">
            Catalog
          </Link>
          <Link href="/contact" className="hover:text-bone transition-colors">
            Contact
          </Link>
          <a
            href={process.env.NEXT_PUBLIC_APP_STORE_URL ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block px-4 py-2 border border-gold/60 text-gold hover:bg-gold hover:text-ink transition-colors"
          >
            Get the App
          </a>
        </nav>
      </div>
    </header>
  );
}
