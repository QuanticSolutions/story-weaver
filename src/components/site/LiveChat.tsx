import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

type ChatMsg = {
  id: string;
  from: "visitor" | "agent";
  text: string;
  ts: number;
};

type Visitor = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

const VISITOR_KEY = "awh_chat_visitor";
const MSGS_KEY = "awh_chat_messages";

function loadVisitor(): Visitor | null {
  try {
    const raw = localStorage.getItem(VISITOR_KEY);
    return raw ? (JSON.parse(raw) as Visitor) : null;
  } catch {
    return null;
  }
}
function loadMessages(): ChatMsg[] {
  try {
    const raw = localStorage.getItem(MSGS_KEY);
    return raw ? (JSON.parse(raw) as ChatMsg[]) : [];
  } catch {
    return [];
  }
}

function fmtTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (sameDay) return time;
  const date = d.toLocaleDateString([], { month: "short", day: "numeric" });
  return `${date} · ${time}`;
}

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // hydrate from localStorage
  useEffect(() => {
    setVisitor(loadVisitor());
    setMessages(loadMessages());
  }, []);

  // persist messages
  useEffect(() => {
    if (messages.length) localStorage.setItem(MSGS_KEY, JSON.stringify(messages));
  }, [messages]);

  // auto scroll
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open, messages.length]);

  const submitVisitor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v: Visitor = {
      id: `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
    };
    localStorage.setItem(VISITOR_KEY, JSON.stringify(v));
    setVisitor(v);
    const greeting: ChatMsg = {
      id: `m_${Date.now()}`,
      from: "agent",
      text: `Hi ${v.name.split(" ")[0] || "there"}! A publishing consultant will be with you shortly. How can we help?`,
      ts: Date.now(),
    };
    setMessages((m) => [...m, greeting]);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      { id: `m_${Date.now()}`, from: "visitor", text, ts: Date.now() },
    ]);
    setDraft("");
    // simulated agent ack
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: `m_${Date.now()}_a`,
          from: "agent",
          text: "Thanks — a consultant will reply here shortly. Your conversation is saved.",
          ts: Date.now(),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 flex h-[460px] w-[340px] flex-col overflow-hidden rounded-2xl border border-navy/20 bg-white shadow-2xl shadow-navy/20"
          >
            <div className="flex items-center justify-between bg-navy px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <MessageCircle className="size-4 text-brand-red" />
                <div className="leading-tight">
                  <p className="text-sm font-semibold">Live Chat</p>
                  {visitor && (
                    <p className="text-[10px] text-white/60">
                      Signed in as {visitor.name.split(" ")[0]}
                    </p>
                  )}
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat">
                <X className="size-4" />
              </button>
            </div>

            {!visitor ? (
              <div className="p-4">
                <p className="mb-3 text-xs leading-relaxed text-navy/75">
                  A publishing consultant will join this chat shortly. Please leave your details.
                </p>
                <form onSubmit={submitVisitor} className="space-y-2">
                  <input
                    name="name"
                    required
                    placeholder="Name"
                    className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm focus:border-brand-red focus:outline-none"
                  />
                  <input
                    name="email"
                    required
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm focus:border-brand-red focus:outline-none"
                  />
                  <input
                    name="phone"
                    required
                    placeholder="Phone"
                    className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm focus:border-brand-red focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-red py-2 text-sm font-semibold text-white hover:bg-brand-red-dark"
                  >
                    <Send className="size-4" /> Start Chat
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div
                  ref={scrollRef}
                  className="flex-1 space-y-3 overflow-y-auto bg-offwhite/50 p-3"
                >
                  {messages.length === 0 && (
                    <p className="py-6 text-center text-xs text-navy/50">
                      Say hello to start the conversation.
                    </p>
                  )}
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${
                        m.from === "visitor" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                          m.from === "visitor"
                            ? "bg-brand-red text-white"
                            : "bg-white text-navy shadow-sm"
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="mt-1 text-[10px] text-navy/45">
                        {fmtTime(m.ts)}
                      </span>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={sendMessage}
                  className="flex items-center gap-2 border-t border-navy/10 bg-white p-2"
                >
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message…"
                    className="flex-1 rounded-md border border-navy/15 px-3 py-2 text-sm focus:border-brand-red focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex size-9 items-center justify-center rounded-md bg-brand-red text-white hover:bg-brand-red-dark"
                    aria-label="Send"
                  >
                    <Send className="size-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open live chat"
        className="flex size-14 items-center justify-center rounded-full bg-brand-red text-white shadow-xl shadow-brand-red/40"
      >
        <MessageCircle className="size-6" />
      </motion.button>
    </div>
  );
}
