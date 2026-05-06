import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Phone, Copy, MessageSquare } from "lucide-react";
import { CRMGate } from "@/components/crm/CRMGate";
import { crmUsers } from "@/data/crmData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/crm/team")({
  head: () => ({ meta: [{ title: "Team — AWH CRM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <CRMGate allowedRoles={["project_manager"]}>
      <TeamPage />
    </CRMGate>
  ),
});

const roleColors: Record<string, string> = {
  project_manager: "bg-brand-red/15 text-brand-red border-brand-red/30",
  salesperson: "bg-navy/15 text-navy border-navy/30",
  production: "bg-amber-100 text-amber-800 border-amber-300",
};

function TeamPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {crmUsers.map((u, i) => (
        <motion.div key={u.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-portal">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy font-serif text-base font-bold text-white">{u.avatar}</div>
            <div className="flex-1">
              <div className="font-serif text-lg font-bold text-navy">{u.name}</div>
              <span className={cn("mt-1 inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider", roleColors[u.role])}>{u.role.replace("_", " ")}</span>
              <div className="mt-1 text-[11px] text-navy/50">{u.department}</div>
            </div>
          </div>
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-navy/70"><Mail className="h-3 w-3" />{u.email}<button onClick={() => { navigator.clipboard.writeText(u.email); toast.success("Copied"); }}><Copy className="h-3 w-3 text-navy/40" /></button></div>
            <div className="flex items-center gap-2 text-navy/70"><Phone className="h-3 w-3" />{u.phone}</div>
            <div className="text-navy/50">Joined: {u.joinedDate}</div>
            <div className="font-semibold text-navy">
              {u.activeProjects && `${u.activeProjects} Active Projects`}
              {u.activeLeads && `${u.activeLeads} Active Leads`}
              {u.activeTasks && `${u.activeTasks} Active Tasks`}
            </div>
          </div>
          <button onClick={() => toast.message("Internal messaging coming soon")} className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-navy py-2 text-xs font-bold text-white hover:bg-navy-deep">
            <MessageSquare className="h-3.5 w-3.5" />Message
          </button>
        </motion.div>
      ))}
    </div>
  );
}
