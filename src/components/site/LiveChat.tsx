import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { startVisitorChat, getVisitorMessages, sendVisitorMessage } from "@/lib/visitorChat.functions";

const SESSION_KEY = "awh_chat_session_id";
const TOKEN_KEY = "awh_chat_session_token";
const VISITOR_KEY = "awh_chat_visitor";

type Visitor = { name: string; email: string; phone: string };
type Msg = { id: string; sender: string; staff_name?: string | null; message: string; created_at: string };

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const startChat = useServerFn(startVisitorChat);
  const fetchMessages = useServerFn(getVisitorMessages);
  const postMessage = useServerFn(sendVisitorMessage);

  // Restore visitor + session from localStorage
  useEffect(() => {
    try {
      const v = localStorage.getItem(VISITOR_KEY);
      const s = localStorage.getItem(SESSION_KEY);
      const t = localStorage.getItem(TOKEN_KEY);
      if (v) setVisitor(JSON.parse(v));
      if (s) setSessionId(s);
      if (t) setToken(t);
    } catch {}
  }, []);

  // Poll for messages while a session exists (visitors are not signed in,
  // so the conversation is fetched through a token-authorised server endpoint)
  useEffect(() => {
    if (!sessionId || !token) return;
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetchMessages({ data: { sessionId, token } });
        if (!cancelled) setMessages(res.messages as Msg[]);
      } catch {
        /* session no longer valid */
      }
    };
    load();
    const poll = setInterval(load, 3000);

    return () => {
      cancelled = true;
      clearInterval(poll);
    };
  }, [sessionId, token, fetchMessages]);

  useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [open, messages.length]);

  const submitVisitor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v: Visitor = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
    };
    try {
      const res = await startChat({ data: v });
      localStorage.setItem(VISITOR_KEY, JSON.stringify(v));
      localStorage.setItem(SESSION_KEY, res.sessionId);
      localStorage.setItem(TOKEN_KEY, res.token);
      setVisitor(v);
      setSessionId(res.sessionId);
      setToken(res.token);
    } catch {
      /* ignore — user can retry */
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !sessionId || !token) return;
    setDraft("");
    try {
      await postMessage({ data: { sessionId, token, message: text } });
      const res = await fetchMessages({ data: { sessionId, token } });
      setMessages(res.messages as Msg[]);
    } catch {
      /* ignore */
    }
  };


  return (
    <div className="fixed bottom-5 right-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ duration: 0.2 }} className="mb-3 flex h-[460px] w-[340px] flex-col overflow-hidden rounded-2xl border border-navy/20 bg-white shadow-2xl shadow-navy/20">
            <div className="flex items-center justify-between bg-navy px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <MessageCircle className="size-4 text-brand-red" />
                <p className="text-sm font-semibold">Live Chat</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat"><X className="size-4" /></button>
            </div>

            {!visitor || !sessionId ? (
              <div className="p-4">
                <p className="mb-3 text-xs leading-relaxed text-navy/75">A publishing consultant will join shortly. Please leave your details.</p>
                <form onSubmit={submitVisitor} className="space-y-2">
                  <input name="name" required placeholder="Name" className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm focus:border-brand-red focus:outline-none" />
                  <input name="email" required type="email" placeholder="Email" className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm focus:border-brand-red focus:outline-none" />
                  <input name="phone" required placeholder="Phone" className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm focus:border-brand-red focus:outline-none" />
                  <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-red py-2 text-sm font-semibold text-white hover:bg-brand-red-dark"><Send className="size-4" /> Start Chat</button>
                </form>
              </div>
            ) : (
              <>
                <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-offwhite/50 p-3">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex flex-col ${m.sender === "visitor" ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.sender === "visitor" ? "bg-brand-red text-white" : "bg-white text-navy shadow-sm"}`}>{m.message}</div>
                      <span className="mt-1 text-[10px] text-navy/45">{fmtTime(m.created_at)}{m.sender === "staff" && m.staff_name ? ` · ${m.staff_name}` : ""}</span>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-navy/10 bg-white p-2">
                  <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message…" className="flex-1 rounded-md border border-navy/15 px-3 py-2 text-sm focus:border-brand-red focus:outline-none" />
                  <button type="submit" className="flex size-9 items-center justify-center rounded-md bg-brand-red text-white hover:bg-brand-red-dark" aria-label="Send"><Send className="size-4" /></button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setOpen((v) => !v)} aria-label="Open live chat" className="flex size-14 items-center justify-center rounded-full bg-brand-red text-white shadow-xl shadow-brand-red/40">
        <MessageCircle className="size-6" />
      </motion.button>
    </div>
  );
}
