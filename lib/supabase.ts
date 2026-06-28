import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Product } from "./types";

let _client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Copy .env.example to .env.local and fill in values."
    );
  }

  _client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return _client;
}

export async function getPublicProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase().rpc("get_public_products");
    if (error) {
      console.error("[supabase] get_public_products failed:", error.message);
      return [];
    }
    return (data ?? []) as Product[];
  } catch (e) {
    console.error("[supabase] get_public_products threw:", e);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getPublicProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export function formatPrice(value: number | null, currency = "AED"): string {
  if (value === null || value === undefined) return `${currency} —`;
  const rounded = Number.isInteger(value) ? value.toString() : value.toFixed(2);
  return `${currency} ${rounded}`;
}
