// Mirrors the shape returned by Supabase RPC `get_public_products()`.
// Adjust field names/types here to match your actual schema, then everything
// downstream type-checks automatically.

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;          // numeric in your minor unit choice; we treat as AED
  currency: string;       // e.g. "AED"
  image_url: string | null;
  category: string | null; // "nutrition" | "training" | "focus" — free text in DB
  pillar?: "nutrition" | "training" | "focus" | null;
}

export const PILLARS = [
  { key: "nutrition", label: "Nutrition" },
  { key: "training", label: "Training" },
  { key: "focus", label: "Focus" },
] as const;
