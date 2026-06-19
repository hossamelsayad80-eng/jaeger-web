"use client";

import { useEffect, useState } from "react";
import { createCoachBrowserClient } from "@/lib/supabase-coach";
import Link from "next/link";

interface Booking {
  id: string;
  scheduled_at: string;
  ends_at: string;
  status: string;
  room_id: string | null;
  room_token_coach: string | null;
  session_duration_minutes: number | null;
  user_id: string;
  vendor_id: string;
}

interface Stats {
  todayCount:    number;
  upcomingCount: number;
  monthEarnings: number;
  currency:      string;
}

function fmt(dt: string) {
  return new Date(dt).toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit",
  });
}

function fmtDate(dt: string) {
  return new Date(dt).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short",
  });
}

export default function CoachDashboardPage() {
  const sb = createCoachBrowserClient();

  const [stats,   setStats]   = useState<Stats | null>(null);
  const [today,   setToday]   = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await sb.auth.getSession();
      if (!session) return;

      const { data: vendor } = await sb
        .from("vendors")
        .select("id")
        .eq("owner_id", session.user.id)
        .single();
      if (!vendor) return;

      const now   = new Date();
      const todayStart = new Date(now); todayStart.setHours(0,0,0,0);
      const todayEnd   = new Date(now); todayEnd.setHours(23,59,59,999);

      const [todayRes, upcomingRes] = await Promise.all([
        sb.from("bookings")
          .select("id, user_id, vendor_id, status, scheduled_at, ends_at, room_id, room_token_coach, session_duration_minutes")
          .eq("vendor_id", vendor.id)
          .gte("scheduled_at", todayStart.toISOString())
          .lte("scheduled_at", todayEnd.toISOString())
          .order("scheduled_at"),

        sb.from("bookings")
          .select("id", { count: "exact", head: true })
          .eq("vendor_id", vendor.id)
          .in("status", ["confirmed", "pending", "in_progress"])
          .gte("scheduled_at", todayEnd.toISOString()),
      ]);

      const bookings = (todayRes.data ?? []) as Booking[];

      setToday(bookings);
      setStats({
        todayCount:    bookings.length,
        upcomingCount: upcomingRes.count ?? 0,
        monthEarnings: 0,
        currency: "AED",
      });
      setLoading(false);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <PageLoader />;

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl text-[#E5C87A]">Dashboard</h1>
        <p className="text-sm text-white/40 font-label mt-1">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stat cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-10">
          <StatCard label="Today's Sessions" value={String(stats.todayCount)} />
          <StatCard label="Upcoming"         value={String(stats.upcomingCount)} accent />
          <StatCard
            label="This Month"
            value={`${stats.currency} ${stats.monthEarnings.toLocaleString()}`}
            sub="Earnings"
          />
        </div>
      )}

      {/* Today's sessions */}
      <h2 className="font-label text-xs uppercase tracking-[0.18em] text-white/40 mb-4">
        Today's Sessions
      </h2>

      {today.length === 0 ? (
        <EmptyState text="No sessions scheduled for today." />
      ) : (
        <div className="space-y-3">
          {today.map(b => (
            <BookingRow key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }: {
  label: string; value: string; sub?: string; accent?: boolean;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 font-label mb-2">{label}</p>
      <p className={`font-display text-3xl ${accent ? "text-[#E5C87A]" : "text-white"}`}>{value}</p>
      {sub && <p className="text-xs text-white/30 font-label mt-1">{sub}</p>}
    </div>
  );
}

function BookingRow({ booking: b }: { booking: Booking }) {
  const now = new Date();
  const start = new Date(b.scheduled_at);
  const end = new Date(b.ends_at);
  const joinableStatus = b.status === "confirmed" || b.status === "in_progress";
  const isLive = joinableStatus && now >= start && now <= end;
  const canJoin = joinableStatus && now >= new Date(start.getTime() - 10 * 60_000) && now <= end;

  return (
    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.07] rounded-xl px-5 py-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-label text-white truncate">Coaching Session</p>
        <p className="text-xs text-white/40 font-label mt-0.5">
          Client · {fmt(b.scheduled_at)} – {fmt(b.ends_at)}
        </p>
      </div>
      <StatusBadge status={b.status} />
      {canJoin && (
        <Link
          href={`/coach/session/${b.id}`}
          className={`ml-2 text-xs font-label font-semibold px-4 py-2 rounded-lg transition-colors ${
            isLive
              ? "bg-[#E5C87A] text-[#070A10] hover:bg-[#EDD99A]"
              : "border border-white/[0.12] text-white/50 hover:text-white hover:border-white/30"
          }`}
        >
          {isLive ? "Join Now" : "Join Session"}
        </Link>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: "bg-green-500/10 text-green-400",
    pending:   "bg-yellow-500/10 text-yellow-400",
    completed: "bg-white/10 text-white/40",
    cancelled: "bg-red-500/10 text-red-400",
  };
  return (
    <span className={`text-[10px] font-label uppercase tracking-wider px-2.5 py-1 rounded-full ${map[status] ?? "bg-white/10 text-white/40"}`}>
      {status}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-white/[0.08] rounded-xl px-6 py-10 text-center">
      <p className="text-sm text-white/25 font-label">{text}</p>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-7 h-7 rounded-full border-2 border-[#E5C87A] border-t-transparent animate-spin" />
    </div>
  );
}
