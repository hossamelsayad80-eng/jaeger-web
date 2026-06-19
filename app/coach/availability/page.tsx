"use client";

import { useEffect, useState } from "react";
import { createCoachBrowserClient } from "@/lib/supabase-coach";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_MAP: Record<string, number> = {
  Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4,
  Friday: 5, Saturday: 6, Sunday: 0,
};

interface Slot {
  id?: string;
  day_of_week: number;   // 0=Sun…6=Sat
  start_time:  string;   // "HH:MM"
  end_time:    string;   // "HH:MM"
}

interface DayRow {
  day:    string;
  dow:    number;
  slots:  Slot[];
  active: boolean;
}

export default function CoachAvailabilityPage() {
  const sb = createCoachBrowserClient();

  const [vendorId,   setVendorId]   = useState<string | null>(null);
  const [rows,       setRows]       = useState<DayRow[]>(
    DAYS.map(d => ({ day: d, dow: DAY_MAP[d], slots: [], active: false }))
  );
  const [icalUrl,    setIcalUrl]    = useState("");
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [loading,    setLoading]    = useState(true);

  // Load existing availability + ical_url
  useEffect(() => {
    (async () => {
      const { data: { session } } = await sb.auth.getSession();
      if (!session) return;

      const { data: vendor } = await sb
        .from("vendors")
        .select("id, ical_url")
        .eq("owner_id", session.user.id)
        .single();
      if (!vendor) return;

      setVendorId(vendor.id);
      setIcalUrl(vendor.ical_url ?? "");

      const { data: avail } = await sb
        .from("coach_availability")
        .select("id, day_of_week, start_time, end_time")
        .eq("vendor_id", vendor.id);

      const slotsByDow: Record<number, Slot[]> = {};
      for (const s of (avail ?? []) as Slot[]) {
        (slotsByDow[s.day_of_week] ??= []).push(s);
      }

      setRows(DAYS.map(d => {
        const dow   = DAY_MAP[d];
        const slots = slotsByDow[dow] ?? [];
        return { day: d, dow, slots, active: slots.length > 0 };
      }));
      setLoading(false);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Toggle day active
  const toggleDay = (idx: number) => {
    setRows(prev => prev.map((r, i) => {
      if (i !== idx) return r;
      if (!r.active) {
        return { ...r, active: true, slots: r.slots.length ? r.slots : [{ day_of_week: r.dow, start_time: "09:00", end_time: "17:00" }] };
      }
      return { ...r, active: false };
    }));
  };

  const addSlot = (idx: number) => {
    setRows(prev => prev.map((r, i) =>
      i !== idx ? r : {
        ...r,
        slots: [...r.slots, { day_of_week: r.dow, start_time: "09:00", end_time: "17:00" }],
      }
    ));
  };

  const removeSlot = (dayIdx: number, slotIdx: number) => {
    setRows(prev => prev.map((r, i) => {
      if (i !== dayIdx) return r;
      const slots = r.slots.filter((_, si) => si !== slotIdx);
      return { ...r, slots, active: slots.length > 0 };
    }));
  };

  const updateSlot = (dayIdx: number, slotIdx: number, field: "start_time" | "end_time", value: string) => {
    setRows(prev => prev.map((r, i) => {
      if (i !== dayIdx) return r;
      return {
        ...r,
        slots: r.slots.map((s, si) => si !== slotIdx ? s : { ...s, [field]: value }),
      };
    }));
  };

  const save = async () => {
    if (!vendorId) return;
    setSaving(true);

    // 1 — Delete all existing slots for this vendor
    await sb.from("coach_availability").delete().eq("vendor_id", vendorId);

    // 2 — Re-insert active slots
    const toInsert = rows
      .filter(r => r.active)
      .flatMap(r => r.slots.map(s => ({
        vendor_id:   vendorId,
        day_of_week: s.day_of_week,
        start_time:  s.start_time,
        end_time:    s.end_time,
      })));

    if (toInsert.length > 0) {
      await sb.from("coach_availability").insert(toInsert);
    }

    // 3 — Save iCal URL
    await sb.from("vendors").update({ ical_url: icalUrl || null }).eq("id", vendorId);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl text-[#E5C87A]">Availability</h1>
        <p className="text-sm text-white/40 font-label mt-1">
          Set your weekly working hours and calendar sync.
        </p>
      </div>

      {/* Weekly hours */}
      <h2 className="text-[11px] uppercase tracking-[0.18em] text-white/35 font-label mb-4">
        Weekly Hours
      </h2>

      <div className="space-y-2 mb-8">
        {rows.map((row, di) => (
          <div
            key={row.day}
            className={`bg-white/[0.03] border rounded-xl overflow-hidden transition-colors ${
              row.active ? "border-[#E5C87A]/20" : "border-white/[0.07]"
            }`}
          >
            {/* Day header */}
            <div className="flex items-center gap-4 px-5 py-3">
              {/* Toggle */}
              <button
                onClick={() => toggleDay(di)}
                className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                  row.active ? "bg-[#E5C87A]" : "bg-white/10"
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  row.active ? "translate-x-5" : ""
                }`} />
              </button>

              <span className="text-sm font-label w-24 text-white/80">{row.day}</span>

              {row.active && (
                <div className="flex-1 space-y-1.5">
                  {row.slots.map((slot, si) => (
                    <div key={si} className="flex items-center gap-2">
                      <TimeInput
                        value={slot.start_time}
                        onChange={v => updateSlot(di, si, "start_time", v)}
                      />
                      <span className="text-white/20 text-xs">–</span>
                      <TimeInput
                        value={slot.end_time}
                        onChange={v => updateSlot(di, si, "end_time", v)}
                      />
                      <button
                        onClick={() => removeSlot(di, si)}
                        className="text-white/20 hover:text-red-400 transition-colors ml-1 text-sm leading-none"
                        aria-label="Remove slot"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {row.active && (
                <button
                  onClick={() => addSlot(di)}
                  className="ml-auto text-xs text-[#E5C87A]/60 hover:text-[#E5C87A] font-label transition-colors"
                >
                  + Add
                </button>
              )}

              {!row.active && (
                <span className="text-xs text-white/25 font-label ml-auto">Unavailable</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* iCal URL */}
      <h2 className="text-[11px] uppercase tracking-[0.18em] text-white/35 font-label mb-3">
        Calendar Sync (iCal)
      </h2>
      <p className="text-xs text-white/30 font-label mb-3 leading-relaxed">
        Paste your Google / Apple Calendar iCal URL. Booked slots will be blocked
        automatically.
      </p>
      <input
        type="url"
        value={icalUrl}
        onChange={e => setIcalUrl(e.target.value)}
        placeholder="https://calendar.google.com/calendar/ical/…"
        className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-4 py-3
                   text-sm text-white placeholder-white/20 outline-none
                   focus:border-[#E5C87A]/40 focus:bg-white/[0.06] transition-colors mb-8"
      />

      {/* Save */}
      <button
        onClick={save}
        disabled={saving}
        className="bg-[#E5C87A] hover:bg-[#EDD99A] disabled:opacity-50 text-[#070A10]
                   font-label font-semibold text-sm rounded-lg px-8 py-3 transition-colors"
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save Availability"}
      </button>
    </div>
  );
}

function TimeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="time"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-1.5
                 text-xs text-white outline-none focus:border-[#E5C87A]/40 transition-colors
                 [color-scheme:dark]"
    />
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-7 h-7 rounded-full border-2 border-[#E5C87A] border-t-transparent animate-spin" />
    </div>
  );
}
