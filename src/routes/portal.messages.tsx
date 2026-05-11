import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Video, Paperclip, Send, Lock } from "lucide-react";
import { PortalGate } from "@/components/portal/PortalGate";
import { sampleClient } from "@/data/sampleClient";
import { useClient, usePortalData } from "@/context/PortalDataContext";

export const Route = createFileRoute("/portal/messages")({
  head: () => ({ meta: [{ title: "Messages — AWH Client Portal" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <PortalGate>
      <MessagesPage />
    </PortalGate>
  ),
});

type Msg = (typeof sampleClient.messages)[number];

function MessagesPage() {
  const sampleClient = useClient();
  const [messages, setMessages] = useState<Msg[]>(sampleClient.messages);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const send = () => {
    if (!text.trim()) return;
    const now = new Date();
    const newMsg: Msg = {
      id: messages.length + 1,
      from: sampleClient.name,
      role: "Client",
      avatar: sampleClient.avatar,
      message: text.trim(),
      date: now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      fromClient: true,
    };
    setMessages([...messages, newMsg]);
    setText("");
  };

  // Group by date
  const grouped: { date: string; items: Msg[] }[] = [];
  messages.forEach((m) => {
    const last = grouped[grouped.length - 1];
    if (last && last.date === m.date) last.items.push(m);
    else grouped.push({ date: m.date, items: [m] });
  });

  return (
    <div className="card-portal !p-0 overflow-hidden">
      <div className="grid h-[calc(100vh-12rem)] grid-cols-1 md:grid-cols-[300px_1fr]">
        {/* Conversations list */}
        <aside className="hidden border-r border-navy/5 bg-offwhite md:block">
          <div className="border-b border-navy/5 px-4 py-4">
            <h3 className="font-serif text-lg font-bold text-navy">Conversations</h3>
          </div>
          <button className="flex w-full items-start gap-3 border-l-4 border-brand-red bg-navy/5 px-4 py-3 text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy font-serif text-sm font-bold text-white">
              SC
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-navy">Sarah Collins</span>
                <span className="h-2 w-2 shrink-0 rounded-full bg-brand-red" />
              </div>
              <div className="text-[11px] text-navy/50">Project Manager</div>
              <div className="mt-1 truncate text-xs text-navy/60">
                {messages[messages.length - 1]?.message}
              </div>
            </div>
          </button>
        </aside>

        {/* Chat */}
        <div className="flex min-h-0 flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-navy/5 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy font-serif text-sm font-bold text-white">
                SC
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                  Sarah Collins <span className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                <div className="text-[11px] text-navy/50">Project Manager</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="rounded-full p-2 text-navy/50 hover:bg-navy/5"><Phone className="h-4 w-4" /></button>
              <button className="rounded-full p-2 text-navy/50 hover:bg-navy/5"><Video className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-offwhite/40 px-5 py-5">
            {grouped.map((group) => (
              <div key={group.date} className="space-y-3">
                <div className="flex items-center justify-center">
                  <span className="rounded-full bg-navy/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-navy/50">
                    {group.date}
                  </span>
                </div>
                <AnimatePresence initial={false}>
                  {group.items.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex gap-2 ${m.fromClient ? "justify-end" : "justify-start"}`}
                    >
                      {!m.fromClient && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy font-serif text-[11px] font-bold text-white">
                          {m.avatar}
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          m.fromClient
                            ? "bg-brand-red text-white"
                            : "bg-white text-navy"
                        }`}
                      >
                        <p className="leading-relaxed">{m.message}</p>
                        <div className={`mt-1 text-[10px] ${m.fromClient ? "text-white/70" : "text-navy/40"}`}>
                          {m.time}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-navy/5 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <button className="rounded-full p-2 text-navy/50 hover:bg-navy/5">
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type your message..."
                className="flex-1 rounded-full border border-navy/15 bg-white px-4 py-2 text-sm text-navy placeholder:text-navy/40 focus:border-brand-red focus:outline-none"
              />
              <button
                onClick={send}
                className="flex h-9 items-center gap-1.5 rounded-full bg-brand-red px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-brand-red-dark"
              >
                <Send className="h-3.5 w-3.5" /> Send
              </button>
            </div>
            <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-navy/40">
              <Lock className="h-3 w-3" /> Messages are monitored by your project manager team
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
