import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STORAGE_KEY = "awh_crm_voice_alerts";

function playBeep() {
  try {
    const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
    const ctx = new AC();
    const play = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.02);
    };
    play(880, 0, 0.18);
    play(1320, 0.18, 0.22);
    setTimeout(() => ctx.close().catch(() => {}), 800);
  } catch {
    // ignore
  }
}

function speak(text: string) {
  try {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1;
    u.volume = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    // ignore
  }
}

export function ChatVoiceAlerts() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v == null ? true : v === "1";
    } catch {
      return true;
    }
  });
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const mountedAt = useRef<number>(Date.now());
  const seen = useRef<Set<string>>(new Set());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
    } catch {
      // ignore
    }
  }, [enabled]);

  useEffect(() => {
    const channel = supabase
      .channel("crm-voice-alerts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: "sender=eq.visitor" },
        async (payload) => {
          const m = payload.new as { id: string; session_id: string; message: string; created_at: string };
          if (!m?.id || seen.current.has(m.id)) return;
          seen.current.add(m.id);
          // ignore historical rows replayed shortly after subscribe
          const ts = new Date(m.created_at).getTime();
          if (Number.isFinite(ts) && ts < mountedAt.current - 5000) return;
          if (!enabledRef.current) return;

          let visitorName = "a visitor";
          try {
            const { data } = await supabase
              .from("chat_sessions")
              .select("visitor_name")
              .eq("id", m.session_id)
              .maybeSingle();
            if (data?.visitor_name) visitorName = data.visitor_name;
          } catch {
            // ignore
          }

          playBeep();
          const preview = (m.message || "").slice(0, 120);
          speak(`New message from ${visitorName}. ${preview}`);
          toast.message(`New message from ${visitorName}`, {
            description: preview,
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        setEnabled((v) => {
          const next = !v;
          if (next) {
            // user gesture — prime audio + speech
            playBeep();
            speak("Voice alerts on");
          } else {
            try {
              window.speechSynthesis?.cancel();
            } catch {
              // ignore
            }
          }
          return next;
        });
      }}
      title={enabled ? "Mute chat voice alerts" : "Enable chat voice alerts"}
      aria-label={enabled ? "Mute chat voice alerts" : "Enable chat voice alerts"}
      className="rounded-full p-2 text-navy/70 hover:bg-navy/5 hover:text-navy"
    >
      {enabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-navy/40" />}
    </button>
  );
}
