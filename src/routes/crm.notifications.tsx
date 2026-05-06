import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus, MessageCircle, CheckSquare, GitBranch, DollarSign, Eye } from "lucide-react";
import { CRMGate } from "@/components/crm/CRMGate";
import { useCRM } from "@/context/CRMContext";
import { useCRMAuth } from "@/context/CRMAuthContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/crm/notifications")({
  head: () => ({ meta: [{ title: "Notifications — AWH CRM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <CRMGate>
      <NotifPage />
    </CRMGate>
  ),
});

const iconMap = {
  new_lead: { icon: UserPlus, color: "bg-brand-red text-white" },
  new_chat: { icon: MessageCircle, color: "bg-amber-500 text-white" },
  task: { icon: CheckSquare, color: "bg-navy text-white" },
  stage: { icon: GitBranch, color: "bg-blue-500 text-white" },
  payment: { icon: DollarSign, color: "bg-green-600 text-white" },
  visitor: { icon: Eye, color: "bg-navy/40 text-white" },
  contract: { icon: CheckSquare, color: "bg-purple-600 text-white" },
};

function NotifPage() {
  const { notifications, markNotificationRead, markAllRead } = useCRM();
  const { crmUser } = useCRMAuth();
  const [filter, setFilter] = useState("All");

  const visible = notifications.filter((n) => crmUser && n.targetRole.includes(crmUser.role));
  const filtered = visible.filter((n) => {
    if (filter === "All") return true;
    if (filter === "Unread") return !n.read;
    return n.type === filter;
  });

  const filters = ["All", "Unread", "new_lead", "new_chat", "task", "payment", "stage", "visitor"];
  const labelMap: Record<string, string> = { new_lead: "New Leads", new_chat: "New Chats", task: "Tasks", payment: "Payments", stage: "Stages", visitor: "Visitor Alerts" };

  return (
    <div className="space-y-4">
      <div className="card-portal">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={cn("rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider", filter === f ? "bg-brand-red text-white" : "bg-navy/10 text-navy")}>{labelMap[f] || f}</button>
            ))}
          </div>
          <button onClick={() => markAllRead()} className="text-xs font-semibold text-brand-red hover:underline">Mark All Read</button>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((n) => {
          const meta = iconMap[n.type];
          const Icon = meta?.icon || CheckSquare;
          const Wrapper = n.link ? Link : ("div" as any);
          const wrapperProps = n.link ? { to: n.link, onClick: () => markNotificationRead(n.id) } : { onClick: () => markNotificationRead(n.id) };
          return (
            <Wrapper key={n.id} {...wrapperProps} className={cn("flex items-center gap-3 rounded-lg border border-navy/10 bg-white p-3 hover:shadow-md transition-shadow", !n.read && "border-l-4 border-l-navy bg-[#EEF1F8]")}>
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", meta?.color || "bg-navy text-white")}><Icon className="h-4 w-4" /></div>
              <div className="flex-1">
                <div className="text-sm text-navy">{n.message}</div>
              </div>
              <div className="text-right text-[10px] text-navy/50"><div>{n.date}</div><div>{n.time}</div></div>
            </Wrapper>
          );
        })}
        {filtered.length === 0 && <div className="card-portal text-center text-sm text-navy/50">No notifications.</div>}
      </div>
    </div>
  );
}
