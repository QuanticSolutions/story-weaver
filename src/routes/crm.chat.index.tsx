import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { CRMGate } from "@/components/crm/CRMGate";
import { useCRM } from "@/context/CRMContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/crm/chat/")({
  head: () => ({ meta: [{ title: "Live Chat — AWH CRM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <CRMGate>
      <ChatInbox />
    </CRMGate>
  ),
});

function ChatInbox() {
  const { chats } = useCRM();
  const [filter, setFilter] = useState<"All" | "Active" | "Waiting" | "Closed">("All");

  const filtered = chats.filter((c) => filter === "All" || c.status === filter)
    .sort((a, b) => (a.status === "Closed" ? 1 : 0) - (b.status === "Closed" ? 1 : 0));

  return (
    <div className="grid h-[calc(100vh-7rem)] grid-cols-1 gap-4 lg:grid-cols-[35%_1fr]">
      <div className="card-portal flex flex-col p-0 overflow-hidden">
        <div className="border-b border-navy/10 p-3">
          <h3 className="font-serif text-lg font-bold text-navy">Chat Inbox <span className="ml-1 rounded-full bg-brand-red px-2 py-0.5 text-[10px] text-white">{chats.filter(c => c.status !== "Closed").length}</span></h3>
          <div className="mt-2 flex gap-1 text-[10px]">
            {(["All", "Active", "Waiting", "Closed"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={cn("rounded-full px-2 py-1 font-bold uppercase tracking-wider", filter === f ? "bg-brand-red text-white" : "bg-navy/10 text-navy")}>{f}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((c) => {
            const last = c.messages[c.messages.length - 1];
            const dot = c.status === "Active" ? "bg-green-500" : c.status === "Waiting" ? "bg-amber-500" : "bg-navy/30";
            return (
              <Link key={c.id} to="/crm/chat/$chatId" params={{ chatId: c.id }} className="block border-b border-navy/5 p-3 hover:bg-offwhite">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", dot, c.status !== "Closed" && "animate-pulse")} />
                    <div>
                      <div className="text-sm font-semibold text-navy">{c.visitorName}</div>
                      <div className="text-[10px] text-navy/50">{c.location}</div>
                    </div>
                  </div>
                  {c.unread > 0 && <span className="rounded-full bg-brand-red px-1.5 py-0.5 text-[9px] font-bold text-white">{c.unread}</span>}
                </div>
                {last && <div className="mt-1 truncate text-xs text-navy/60">{last.message}</div>}
                <div className="mt-1 text-[10px] text-navy/40">{c.assignedStaff || "Unassigned"}</div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="card-portal flex items-center justify-center text-center text-navy/50">
        <div>
          <MessageSquare className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <div className="text-sm">Select a conversation to begin</div>
        </div>
      </div>
    </div>
  );
}
