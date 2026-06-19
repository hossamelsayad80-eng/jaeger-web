"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCoachBrowserClient } from "@/lib/supabase-coach";

export default function CoachLoginPage() {
  const router = useRouter();
  const sb     = createCoachBrowserClient();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data: authData, error: authErr } =
      await sb.auth.signInWithPassword({ email, password });

    console.log("auth result:", authData, "error:", authErr);

    if (authErr || !authData.user) {
      setError(authErr?.message ?? "Invalid credentials.");
      setLoading(false);
      return;
    }
    
    console.log("user signed in:", authData.user.id);

    // Verify vendor_type = 'coach'
    const { data: vendor, error: vendorErr } = await sb
      .from("vendors")
      .select("vendor_type")
      .eq("owner_id", authData.user.id)
      .single();

    console.log("vendor query result:", vendor, "error:", vendorErr);
    console.log("user id:", authData.user.id);

    if (!vendor || vendor.vendor_type !== "coach") {
      await sb.auth.signOut();
      setError("This portal is for coaches only.");
      setLoading(false);
      return;
    }

    router.replace("/coach/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#070A10] flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-[#E5C87A] tracking-wide">Jaeger</h1>
          <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/30 font-label">
            Coach Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 font-label mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-4 py-3
                         text-sm text-white placeholder-white/20 outline-none
                         focus:border-[#E5C87A]/40 focus:bg-white/[0.06] transition-colors"
              placeholder="you@jaegerlongevity.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 font-label mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-4 py-3
                         text-sm text-white placeholder-white/20 outline-none
                         focus:border-[#E5C87A]/40 focus:bg-white/[0.06] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400/80 font-label">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#E5C87A] hover:bg-[#EDD99A] disabled:opacity-50
                       text-[#070A10] font-label font-semibold text-sm rounded-lg py-3
                       transition-colors"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
