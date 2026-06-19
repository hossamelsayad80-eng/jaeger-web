"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createCoachBrowserClient } from "@/lib/supabase-coach";

type Tab = "upcoming" | "past";

interface Booking {
  id: string;
  scheduled_at: string;
  ends_at: string;
  status: string;
  notes: string | null;
  room_id: string | null;
  room_token_coach: string | null;
  session_duration_minutes: number | null;
  user_id: string;
  vendor_id: string;
}

function fmtDate(dt: string) {
  return new Date(dt).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short",
  });
}

function fmtTime(dt: string) {
  return new Date(dt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function CoachBookingsPage() {
  const sb = createCoachBrowserClient();

  const [tab,      setTab]      = useState<Tab>("upcoming");
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [past,     setPast]     = useState<Booking[]>([]);
  const [loading,  setLoading]  = useState(true);

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

      const now = new Date();
      const nowIso = now.toISOString();
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      const [uRes, pRes] = await Promise.all([
        sb.from("bookings")
          .select("id, user_id, vendor_id, status, scheduled_at, ends_at, notes, room_id, room_token_coach, session_duration_minutes")
          .eq("vendor_id", vendor.id)
          .gte("scheduled_at", todayStart.toISOString())
          .in("status", ["confirmed", "pending", "in_progress"])
          .order("scheduled_at"),

        sb.from("bookings")
          .select("id, user_id, vendor_id, status, scheduled_at, ends_at, notes, room_id, room_token_coach, session_duration_minutes")
          .eq("vendor_id", vendor.id)
          .lt("ends_at", nowIso)
          .order("scheduled_at", { ascending: false })
          .limit(50),
      ]);

      setUpcoming((uRes.data ?? []) as Booking[]);
      setPast((pRes.data ?? []) as Booking[]);
      setLoading(false);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const list = tab === "upcoming" ? upcoming : past;

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl text-[#E5C87A]">Bookings</h1>
        <p className="text-sm text-white/40 font-label mt-1">
          {upcoming.length} upcoming · {past.length} past
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 w-fit">
        {(["upcoming", "past"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-label transition-colors capitalize ${
              tab === t
                ? "bg-[#E5C87A] text-[#070A10] font-semibold"
                : "text-white/40 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <PageLoader />
      ) : list.length === 0 ? (
        <EmptyState text={`No ${tab} bookings.`} />
      ) : (
        <div className="space-y-3">
          {list.map(b => <BookingCard key={b.id} booking={b} />)}
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking: b }: { booking: Booking }) {
  const now    = new Date();
  const start  = new Date(b.scheduled_at);
  const end    = new Date(b.ends_at);
  const joinableStatus = b.status === "confirmed" || b.status === "in_progress";
  const isLive = joinableStatus && now >= start && now <= end;
  const canJoin = joinableStatus && now >= new Date(start.getTime() - 10 * 60_000) && now <= end;

  const statusColour: Record<string, string> = {
    confirmed: "text-green-400",
    pending:   "text-yellow-400",
    completed: "text-white/30",
    cancelled: "text-red-400",
  };

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-label font-semibold text-white text-sm">
              Coaching Session
            </p>
            {isLive && (
              <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-label uppercase tracking-wider">
                Live
              </span>
            )}
          </div>
          <p className="text-xs text-white/40 font-label mt-1">
            Client · {fmtDate(b.scheduled_at)}, {fmtTime(b.scheduled_at)} – {fmtTime(b.ends_at)}
          </p>
          {b.notes && (
            <p className="text-xs text-white/25 font-label mt-2 italic truncate">{b.notes}</p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className={`text-[10px] font-label uppercase tracking-wider ${statusColour[b.status] ?? "text-white/30"}`}>
            {b.status}
          </span>
          {canJoin && (
            <Link
              href={`/coach/session/${b.id}`}
              className={`text-xs font-label font-semibold px-4 py-2 rounded-lg transition-colors ${
                isLive
                  ? "bg-[#E5C87A] text-[#070A10] hover:bg-[#EDD99A]"
                  : "border border-white/[0.15] text-white/50 hover:text-white hover:border-white/30"
              }`}
            >
              {isLive ? "Join Now" : "Join"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-white/[0.08] rounded-xl px-6 py-12 text-center">
      <p className="text-sm text-white/25 font-label">{text}</p>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-7 h-7 rounded-full border-2 border-[#E5C87A] border-t-transparent animate-spin" />
    </div>
  );
}
