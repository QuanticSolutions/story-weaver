import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { useCRM } from "@/context/CRMContext";

const VISITOR_KEY = "awh_chat_visitor";
const CHAT_ID_KEY = "awh_chat_id";

type Visitor = { id: string; name: string; email: string; phone: string };

export function LiveChat() {
  const { chats, addChat, addVisitorMessage, addNotification } = useCRM();
  const [open, setOpen] = useState(false);
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentArrivalRef = useRef(false);

  const chat = chatId ? chats.find((c) => c.id === chatId) : null;

  useEffect(() => {
    try {
      const v = localStorage.getItem(VISITOR_KEY);
      const cid = localStorage.getItem(CHAT_ID_KEY);
      if (v) setVisitor(JSON.parse(v));
      if (cid) setChatId(cid);
    } catch {}
  }, []);

  useEffect(() => {
    if (sentArrivalRef.current) return;
    sentArrivalRef.current = true;
    addNotification({
      type: "visitor",
      message: "New visitor on website — Browser Session",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      read: false,
      targetRole: ["salesperson", "project_manager"],
    });
  }, [addNotification]);

  useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [open, chat?.messages.length]);

  const submitVisitor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v: Visitor = {
      id: `v_${Date.now()}`,
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
    };
    localStorage.setItem(VISITOR_KEY, JSON.stringify(v));
    setVisitor(v);

    const newId = `CHAT-${Date.now()}`;
    const t = new Date();
    const greeting = "A publishing consultant will respond shortly.";
    addChat({
      id: newId,
      leadId: null,
      visitorName: v.name,
      visitorEmail: v.email,
      visitorPhone: v.phone,
      ipAddress: "0.0.0.0",
      location: "Unknown — Browser Session",
      startedAt: t.toLocaleString(),
      status: "Active",
      assignedStaff: null,
      unread: 1,
      messages: [{ from: "staff", staffName: "AWH", message: greeting, time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), date: t.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) }],
    });
    addNotification({
      type: "new_chat",
      message: `New chat started: ${v.name} — Browser Session`,
      time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: t.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      read: false,
      targetRole: ["salesperson", "project_manager"],
      link: `/crm/chat/${newId}`,
    });
    setChatId(newId);
    localStorage.setItem(CHAT_ID_KEY, newId);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !chatId) return;
    addVisitorMessage(chatId, text);
    setDraft("");
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

            {!visitor || !chat ? (
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
                  {chat.messages.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.from === "visitor" ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from === "visitor" ? "bg-brand-red text-white" : "bg-white text-navy shadow-sm"}`}>{m.message}</div>
                      <span className="mt-1 text-[10px] text-navy/45">{m.time}</span>
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
