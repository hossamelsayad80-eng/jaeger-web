/**
 * Supabase client helpers for the coach portal.
 * Uses @supabase/ssr so auth cookies are persisted across server/client.
 */
import { createBrowserClient } from "@supabase/ssr";

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Browser (client-component) Supabase client with session persistence. */
export function createCoachBrowserClient() {
  return createBrowserClient(URL, ANON);
}
