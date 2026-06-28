"use client";

import { useEffect, useState } from "react";
import { createCoachBrowserClient } from "@/lib/supabase-coach";

export default function CoachProfilePage() {
  const sb = createCoachBrowserClient();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [coachType, setCoachType] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await sb.auth.getSession();
      if (!session) return;
      setEmail(session.user.email ?? "");
      const { data: vendor } = await sb
        .from("vendors")
        .select("name, coach_type")
        .eq("owner_id", session.user.id)
        .single();
      if (vendor) {
        setName(vendor.name ?? "");
        setCoachType(vendor.coach_type ?? "");
      }
      setLoading(false);
    })();
  }, []);

  const changePassword = async () => {
    setError(null);
    if (!newPassword) return;
    if (newPassword !== confirm) { setError("Passwords do not match."); return; }
    if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    setSaving(true);
    const { error: err } = await sb.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (err) { setError(err.message); }
    else { setSaved(true); setNewPassword(""); setConfirm(""); setTimeout(() => setSaved(false), 3000); }
  };

  const signOut = async () => {
    await sb.auth.signOut();
    window.location.href = "/coach/login";
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-7 h-7 rounded-full border-2 border-[#E5C87A] border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-[#E5C87A]">Profile</h1>
        <p className="text-sm text-white/40 font-label mt-1">Manage your account settings.</p>
      </div>
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 mb-6">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-white/35 font-label mb-4">Account Info</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 font-label mb-1.5">Name</label>
            <p className="text-sm text-white font-label">{name}</p>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 font-label mb-1.5">Email</label>
            <p className="text-sm text-white font-label">{email}</p>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 font-label mb-1.5">Coach Type</label>
            <span className="inline-block text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#E5C87A]/10 text-[#E5C87A] font-label">
              {coachType}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 mb-6">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-white/35 font-label mb-4">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 font-label mb-1.5">New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#E5C87A]/40 transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-white/40 font-label mb-1.5">Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat new password"
              className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#E5C87A]/40 transition-colors" />
          </div>
          {error && <p className="text-xs text-red-400/80 font-label">{error}</p>}
          {saved && <p className="text-xs text-green-400/80 font-label">Password updated successfully.</p>}
          <button onClick={changePassword} disabled={saving || !newPassword || !confirm}
            className="bg-[#E5C87A] hover:bg-[#EDD99A] disabled:opacity-40 text-[#070A10] font-label font-semibold text-sm rounded-lg px-6 py-2.5 transition-colors">
            {saving ? "Saving..." : "Update Password"}
          </button>
        </div>
      </div>
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-white/35 font-label mb-4">Session</h2>
        <p className="text-xs text-white/40 font-label mb-4">You are signed in as {email}.</p>
        <button onClick={signOut}
          className="border border-red-500/30 text-red-400 hover:bg-red-500/10 font-label font-semibold text-sm rounded-lg px-6 py-2.5 transition-colors">
          Sign Out
        </button>
      </div>
    </div>
  );
}
