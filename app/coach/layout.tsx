"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createCoachBrowserClient } from "@/lib/supabase-coach";
import type { User } from "@supabase/supabase-js";

const NAV = [
  { href: "/coach/dashboard",    label: "Dashboard"   },
  { href: "/coach/bookings",     label: "Bookings"    },
  { href: "/coach/availability", label: "Availability" },
  { href: "/coach/profile",      label: "Profile"     },
];

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const sb       = createCoachBrowserClient();

  const [user, setUser]       = useState<User | null>(null);
  const [ready, setReady]     = useState(false);
  const [name, setName]       = useState("Coach");

  useEffect(() => {
    // Skip auth guard on login page
    if (pathname === "/coach/login") { setReady(true); return; }

    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/coach/login"); return; }

      // Verify vendor_type = 'coach'
      const { data: vendor } = await sb
        .from("vendors")
        .select("id, name, vendor_type")
        .eq("owner_id", session.user.id)
        .single();

      if (!vendor || vendor.vendor_type !== "coach") {
        await sb.auth.signOut();
        router.replace("/coach/login");
        return;
      }

      setUser(session.user);
      setName(vendor.name ?? "Coach");
      setReady(true);
    });
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const signOut = async () => {
    await sb.auth.signOut();
    router.replace("/coach/login");
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#070A10] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#E5C87A] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Login page — no shell
  if (pathname === "/coach/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#070A10] text-white flex">
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className="w-56 shrink-0 border-r border-white/[0.06] flex flex-col">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/[0.06]">
          <span className="font-display text-xl text-[#E5C87A] tracking-wide">
            Jaeger
          </span>
          <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-white/30 font-label">
            Coach
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-3">
          {NAV.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-label transition-colors ${
                  active
                    ? "bg-[#E5C87A]/10 text-[#E5C87A]"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User + sign out */}
        <div className="px-4 py-5 border-t border-white/[0.06]">
          <p className="text-xs text-white/40 font-label truncate mb-2">{name}</p>
          <button
            onClick={signOut}
            className="text-xs text-white/30 hover:text-white/60 transition-colors font-label"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
