import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/supabase";

export default function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block animate-rise"
      style={{ animationDelay: `${Math.min(index * 60, 480)}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ink2 border border-white/5">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-display text-7xl text-white/5">
            {num}
          </div>
        )}

        <div className="absolute top-3 left-3 font-label text-[10px] uppercase tracking-widest2 text-bone/80">
          {num}
        </div>

        {product.category && (
          <div className="absolute top-3 right-3 font-label text-[10px] uppercase tracking-widest2 text-gold bg-ink/70 px-2 py-1">
            {product.category}
          </div>
        )}
      </div>

      <div className="pt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl text-bone leading-tight group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        <div className="font-label text-xs text-gold whitespace-nowrap">
          {formatPrice(product.price, product.currency)}
        </div>
      </div>
    </Link>
  );
}
