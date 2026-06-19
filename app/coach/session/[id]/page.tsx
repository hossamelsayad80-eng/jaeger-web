"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createCoachBrowserClient } from "@/lib/supabase-coach";
import {
  HMSRoomProvider,
  useHMSActions,
  useHMSStore,
  selectIsConnectedToRoom,
  selectPeers,
  selectLocalPeer,
  HMSPeer,
  HMSVideoTrack,
} from "@100mslive/react-sdk";

// ── Outer wrapper — provides HMSRoomProvider context ─────────────────────────
export default function SessionPageWrapper() {
  return (
    <HMSRoomProvider>
      <SessionPage />
    </HMSRoomProvider>
  );
}

// ── Inner page ────────────────────────────────────────────────────────────────
function SessionPage() {
  const params  = useParams<{ id: string }>();
  const router  = useRouter();
  const sb      = createCoachBrowserClient();
  const actions = useHMSActions();

  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const peers       = useHMSStore(selectPeers);
  const localPeer   = useHMSStore(selectLocalPeer);

  const [booking,  setBooking]  = useState<{ id: string; status: string; scheduled_at: string; ends_at: string } | null>(null);
  const [token,    setToken]    = useState<string | null>(null);
  const [error,    setError]    = useState<string | null>(null);
  const [joining,  setJoining]  = useState(false);
  const [muted,    setMuted]    = useState(false);
  const [vidOff,   setVidOff]   = useState(false);

  // Load booking + request token
  useEffect(() => {
    (async () => {
      const { data: { session } } = await sb.auth.getSession();
      if (!session) { router.replace("/coach/login"); return; }

      const { data: vendor } = await sb
        .from("vendors")
        .select("id")
        .eq("owner_id", session.user.id)
        .single();

      if (!vendor) { setError("Coach profile not found."); return; }

      const { data: bk } = await sb
        .from("bookings")
        .select("id, status, scheduled_at, ends_at")
        .eq("id", params.id)
        .eq("vendor_id", vendor.id)
        .single();

      if (!bk) { setError("Booking not found."); return; }
      setBooking(bk);

      // Call Supabase Edge Function to get a 100ms room token
      const tokenRes = await fetch("/api/coach/room-token", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          booking_id: params.id,
          requesting_user_id: session.user.id,
        }),
      });

      const data = await tokenRes.json();
      const authToken = data?.token ?? data?.room_code;
      if (!tokenRes.ok || !authToken) {
        const detail = data?.error ?? JSON.stringify(data);
        setError(`Could not get room token. ${detail}`);
        return;
      }
      setToken(authToken);
    })();
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const joinRoom = async () => {
    if (!token) return;
    setJoining(true);
    try {
      const authToken = token.split(".").length === 3
        ? token
        : await (
            actions as typeof actions & {
              getAuthTokenByRoomCode?: (args: { roomCode: string }) => Promise<string>;
            }
          ).getAuthTokenByRoomCode?.({ roomCode: token });

      if (!authToken) {
        throw new Error("Could not exchange room code for auth token.");
      }

      await actions.join({ userName: "Coach", authToken });
    } catch (e: unknown) {
      setError((e as Error).message);
    }
    setJoining(false);
  };

  const leaveRoom = async () => {
    await actions.leave();
    router.back();
  };

  const toggleMute = async () => {
    await actions.setLocalAudioEnabled(muted);
    setMuted(!muted);
  };

  const toggleVideo = async () => {
    await actions.setLocalVideoEnabled(vidOff);
    setVidOff(!vidOff);
  };

  // ── Loading / error states ──────────────────────────────────────────────

  if (error) {
    return (
      <div className="min-h-screen bg-[#070A10] flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-xl">!</span>
          </div>
          <p className="text-white/60 font-label text-sm mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="text-sm font-label text-[#E5C87A] hover:underline"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#070A10] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#E5C87A] border-t-transparent animate-spin" />
      </div>
    );
  }

  // ── Pre-join lobby ──────────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#070A10] flex items-center justify-center p-8">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-display text-4xl text-[#E5C87A] mb-2">
            Coaching Session
          </h1>
          <p className="text-sm text-white/40 font-label mb-8">
            with Client
          </p>
          <button
            onClick={joinRoom}
            disabled={joining}
            className="w-full bg-[#E5C87A] hover:bg-[#EDD99A] disabled:opacity-50
                       text-[#070A10] font-label font-semibold text-sm rounded-xl py-4
                       transition-colors"
          >
            {joining ? "Joining…" : "Join Session"}
          </button>
          <button
            onClick={() => router.back()}
            className="mt-4 text-sm text-white/30 hover:text-white/60 font-label transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // ── Active call ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#070A10]/90 border-b border-white/[0.06]">
        <div>
          <h2 className="font-display text-xl text-[#E5C87A]">
            Coaching Session
          </h2>
          <p className="text-xs text-white/35 font-label">{peers.length} participant{peers.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={leaveRoom}
          className="bg-red-500/90 hover:bg-red-500 text-white font-label font-semibold
                     text-xs px-5 py-2.5 rounded-lg transition-colors"
        >
          End Session
        </button>
      </div>

      {/* Video grid */}
      <div className="flex-1 p-4 grid grid-cols-2 gap-3 content-start">
        {peers.map(peer => (
          <PeerTile key={peer.id} peer={peer} isLocal={peer.id === localPeer?.id} />
        ))}
        {peers.length === 0 && (
          <div className="col-span-2 flex items-center justify-center h-64">
            <p className="text-white/25 font-label text-sm">Waiting for participants…</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 py-6 bg-[#070A10]/90 border-t border-white/[0.06]">
        <ControlBtn
          onClick={toggleMute}
          active={!muted}
          label={muted ? "Unmute" : "Mute"}
          icon={muted ? "🔇" : "🎤"}
        />
        <ControlBtn
          onClick={toggleVideo}
          active={!vidOff}
          label={vidOff ? "Start Video" : "Stop Video"}
          icon={vidOff ? "📷" : "🎥"}
        />
      </div>
    </div>
  );
}

// ── Peer tile ─────────────────────────────────────────────────────────────────
function PeerTile({ peer, isLocal }: { peer: HMSPeer; isLocal: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const actions  = useHMSActions();

  useEffect(() => {
    if (!videoRef.current || !peer.videoTrack) return;
    actions.attachVideo(peer.videoTrack as string, videoRef.current);
    return () => {
      if (videoRef.current)
        actions.detachVideo(peer.videoTrack as string, videoRef.current);
    };
  }, [peer.videoTrack, actions]);

  return (
    <div className="relative bg-[#0D1018] rounded-xl overflow-hidden aspect-video">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className="w-full h-full object-cover"
      />
      {/* Name badge */}
      <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-xs text-white font-label">
        {peer.name}{isLocal ? " (You)" : ""}
      </div>
      {/* No video placeholder */}
      {!peer.videoTrack && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#E5C87A]/10 border border-[#E5C87A]/20 flex items-center justify-center">
            <span className="font-display text-2xl text-[#E5C87A]">
              {peer.name?.[0]?.toUpperCase() ?? "?"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function ControlBtn({ onClick, active, label, icon }: {
  onClick: () => void; active: boolean; label: string; icon: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl transition-colors font-label text-xs ${
        active
          ? "bg-white/[0.08] text-white hover:bg-white/[0.12]"
          : "bg-red-500/15 text-red-400 hover:bg-red-500/25"
      }`}
    >
      <span className="text-xl">{icon}</span>
      {label}
    </button>
  );
}
