type Variant = "solid" | "ghost";

export default function AppStoreButton({
  variant = "solid",
  label = "Get it in the App",
  className = "",
}: {
  variant?: Variant;
  label?: string;
  className?: string;
}) {
  const href = process.env.NEXT_PUBLIC_APP_STORE_URL ?? "#";
  const base =
    "inline-flex items-center justify-center gap-2 px-5 py-3 font-label text-[11px] uppercase tracking-widest2 transition-colors";
  const styles =
    variant === "solid"
      ? "bg-gold text-ink hover:bg-bone"
      : "border border-gold/60 text-gold hover:bg-gold hover:text-ink";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${styles} ${className}`}
    >
      <span aria-hidden>↗</span>
      {label}
    </a>
  );
}
