import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { MapPin, Globe, Clock, Send, Zap, Paperclip, ChevronLeft } from "lucide-react";
import { CRMGate } from "@/components/crm/CRMGate";
import { useCRM } from "@/context/CRMContext";
import { useCRMAuth } from "@/context/CRMAuthContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/crm/chat/$chatId")({
  head: () => ({ meta: [{ title: "Chat — AWH CRM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <CRMGate>
      <ChatThread />
    </CRMGate>
  ),
});

const TEMPLATES = [
  "Hi! Thank you for reaching out to American Writers Hub. How can I help you today?",
  "Could you share a bit more about the book you'd like to publish?",
  "I'd love to set up a free consultation. What time works best for you?",
  "Let me get your email address so I can send over more details.",
];

function ChatThread() {
  const { chatId } = useParams({ from: "/crm/chat/$chatId" });
  const { chats, sendChatMessage, assignChat, closeChat } = useCRM();
  const { crmUser } = useCRMAuth();
  const chat = chats.find((c) => c.id === chatId);
  const [draft, setDraft] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat?.messages.length]);

  if (!chat) return <div className="card-portal">Chat not found.</div>;

  const send = () => {
    if (!draft.trim() || !crmUser) return;
    sendChatMessage(chat.id, draft, crmUser.name);
    setDraft("");
  };

  return (
    <div className="card-portal flex h-[calc(100vh-7rem)] flex-col p-0 overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-navy/10 p-3">
        <Link to="/crm/chat" className="text-navy/60 hover:text-navy"><ChevronLeft className="h-5 w-5" /></Link>
        <div className="flex-1">
          <div className="font-accent text-sm font-bold text-navy">{chat.visitorName}</div>
          <div className="flex items-center gap-2 text-[10px] text-navy/50">
            <span className="flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{chat.location}</span>
            <span className="flex items-center gap-0.5"><Globe className="h-2.5 w-2.5" />{chat.ipAddress}</span>
            <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{chat.startedAt}</span>
          </div>
        </div>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", chat.status === "Active" ? "bg-green-100 text-green-700" : chat.status === "Waiting" ? "bg-amber-100 text-amber-800" : "bg-navy/10 text-navy")}>{chat.status}</span>
        {!chat.assignedStaff && crmUser && (
          <button onClick={() => { assignChat(chat.id, crmUser.name); toast.success("Assigned to you"); }} className="rounded-md bg-brand-red px-3 py-1 text-[10px] font-bold uppercase text-white">Assign to Me</button>
        )}
        {chat.leadId && <Link to="/crm/leads/$leadId" params={{ leadId: chat.leadId! }} className="rounded-md border border-navy/15 px-3 py-1 text-[10px] font-bold uppercase">View Lead</Link>}
        {chat.status !== "Closed" && <button onClick={() => { closeChat(chat.id); toast.success("Chat closed"); }} className="rounded-md border border-navy/15 px-3 py-1 text-[10px] font-bold uppercase">Close</button>}
      </div>

      <div className="border-b border-navy/10 bg-offwhite/50 px-3 py-2 text-[10px] text-navy/60">
        {chat.visitorEmail} • {chat.visitorPhone}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-offwhite/30 p-4">
        <div className="text-center text-[10px] text-navy/40">Chat started at {chat.startedAt}</div>
        {chat.messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "visitor" ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[70%]`}>
              <div className={`text-[10px] ${m.from === "visitor" ? "text-navy/50" : "text-right text-navy/50"}`}>{m.from === "staff" ? m.staffName : chat.visitorName}</div>
              <div className={`mt-0.5 rounded-2xl px-3 py-2 text-sm ${m.from === "visitor" ? "bg-navy/10 text-navy" : "bg-brand-red text-white"}`}>{m.message}</div>
              <div className={`mt-0.5 text-[9px] ${m.from === "visitor" ? "text-navy/40" : "text-right text-navy/40"}`}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative border-t border-navy/10 bg-white p-2">
        {showTemplates && (
          <div className="absolute bottom-full left-2 mb-1 w-80 rounded-lg border border-navy/10 bg-white p-2 shadow-lg">
            {TEMPLATES.map((t) => (
              <button key={t} onClick={() => { setDraft(t); setShowTemplates(false); }} className="block w-full rounded-md p-2 text-left text-xs text-navy hover:bg-offwhite">{t}</button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <button className="text-navy/40 hover:text-brand-red"><Paperclip className="h-4 w-4" /></button>
          <button onClick={() => setShowTemplates((v) => !v)} className="text-navy/40 hover:text-brand-red"><Zap className="h-4 w-4" /></button>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={`Reply to ${chat.visitorName}...`} className="flex-1 rounded-md border border-navy/15 px-3 py-2 text-sm" />
          <button onClick={send} className="rounded-md bg-brand-red px-3 py-2 text-white"><Send className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}
