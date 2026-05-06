import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Kanban, Users, CheckSquare, DollarSign, AlertCircle, Phone, MessageSquare } from "lucide-react";
import { CRMGate } from "@/components/crm/CRMGate";
import { useCRMAuth } from "@/context/CRMAuthContext";
import { useCRM } from "@/context/CRMContext";

export const Route = createFileRoute("/crm/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AWH CRM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <CRMGate>
      <Dashboard />
    </CRMGate>
  ),
});

function Dashboard() {
  const { crmUser } = useCRMAuth();
  const { projects, leads, chats } = useCRM();

  if (!crmUser) return null;
  if (crmUser.role === "salesperson") return <SalesDashboard />;
  if (crmUser.role === "production") return <ProductionDashboard />;
  return <PMDashboard />;

  function PMDashboard() {
    const totalRev = projects.reduce((s, p) => s + p.amountPaid, 0);
    const outstanding = projects.reduce((s, p) => s + p.outstanding, 0);
    const tasksDue = projects.flatMap((p) => p.tasks).filter((t) => t.status !== "Completed").length;

    const stats = [
      { label: "Active Projects", value: projects.filter((p) => p.health !== "Completed").length, icon: Kanban, color: "text-navy" },
      { label: "Open Leads", value: leads.filter((l) => l.status !== "Closed Won" && l.status !== "Closed Lost").length, icon: Users, color: "text-brand-red" },
      { label: "Tasks Due", value: tasksDue, icon: CheckSquare, color: "text-amber-600" },
      { label: "Total Revenue", value: `$${totalRev.toLocaleString()}`, icon: DollarSign, color: "text-green-600" },
      { label: "Outstanding", value: `$${outstanding.toLocaleString()}`, icon: AlertCircle, color: "text-brand-red" },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-portal">
              <div className="flex items-center gap-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <span className="font-accent text-[10px] uppercase tracking-wider text-navy/50">{s.label}</span>
              </div>
              <div className="mt-2 font-serif text-2xl font-bold text-navy">{s.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="card-portal">
          <h3 className="mb-4 font-serif text-2xl font-bold text-navy">Active Projects</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {projects.map((p) => {
              const completed = p.stages.filter((s) => s.status === "Completed").length;
              const total = p.stages.length;
              const progress = Math.round((completed / total) * 100);
              const currentStage = p.stages.find((s) => s.status === "In Progress");
              return (
                <Link key={p.id} to="/crm/projects/$projectId" params={{ projectId: p.id }} className="block rounded-lg border border-navy/10 p-4 hover:border-brand-red/40 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-bold text-white">{p.id}</span>
                    {p.outstanding > 0 && <span className="text-xs font-semibold text-amber-600">${p.outstanding} outstanding</span>}
                  </div>
                  <div className="mt-2 font-serif text-lg font-bold text-navy">{p.bookTitle}</div>
                  <div className="text-xs text-navy/60">{p.clientName}</div>
                  <div className="mt-3 text-xs">
                    <span className="text-navy/50">Current: </span>
                    <span className="font-semibold text-navy">{currentStage?.name || "—"}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-navy/10">
                    <div className="h-full bg-brand-red transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-1 text-[10px] text-navy/50">{completed} of {total} stages • PM: {p.assignedManager}</div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card-portal">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-navy">Recent Leads</h3>
              <Link to="/crm/leads" className="text-xs font-semibold text-brand-red hover:underline">View All</Link>
            </div>
            <div className="space-y-2">
              {leads.slice(0, 5).map((l) => (
                <Link key={l.id} to="/crm/leads/$leadId" params={{ leadId: l.id }} className="flex items-center justify-between rounded-md border border-navy/5 p-3 hover:bg-offwhite">
                  <div>
                    <div className="text-sm font-semibold text-navy">{l.name}</div>
                    <div className="text-[11px] text-navy/50">{l.source} • {l.serviceInterest.join(", ")}</div>
                  </div>
                  <span className="rounded-full bg-navy/10 px-2 py-0.5 text-[10px] font-bold text-navy">{l.status}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="card-portal">
            <h3 className="mb-4 font-serif text-xl font-bold text-navy">Active Chat Sessions</h3>
            <div className="space-y-2">
              {chats.filter((c) => c.status !== "Closed").map((c) => (
                <Link key={c.id} to="/crm/chat/$chatId" params={{ chatId: c.id }} className="flex items-center justify-between rounded-md border border-navy/5 p-3 hover:bg-offwhite">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-red" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-navy">{c.visitorName}</div>
                      <div className="text-[11px] text-navy/50">{c.location}</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-brand-red">Join Chat →</span>
                </Link>
              ))}
              {chats.filter((c) => c.status !== "Closed").length === 0 && (
                <div className="text-sm text-navy/50">No active sessions.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function SalesDashboard() {
    const counts = {
      "New Lead": leads.filter((l) => l.status === "New Lead").length,
      Contacted: leads.filter((l) => l.status === "Contacted").length,
      Qualified: leads.filter((l) => l.status === "Qualified").length,
      "Closed Won": leads.filter((l) => l.status === "Closed Won").length,
      "Closed Lost": leads.filter((l) => l.status === "Closed Lost").length,
    };

    const followUps = leads.filter((l) => {
      if (!l.lastContact) return l.status !== "Closed Won" && l.status !== "Closed Lost";
      return false;
    });

    return (
      <div className="space-y-6">
        <div className="card-portal">
          <h3 className="mb-4 font-serif text-2xl font-bold text-navy">Lead Pipeline</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(counts).map(([k, v]) => (
              <div key={k} className="rounded-full border border-navy/15 bg-offwhite px-4 py-2 text-sm">
                <span className="font-semibold text-navy">{k}</span>
                <span className="ml-2 rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-bold text-white">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card-portal">
            <h3 className="mb-4 font-serif text-xl font-bold text-navy">Today's Follow-ups</h3>
            <div className="space-y-2">
              {followUps.length === 0 && <div className="text-sm text-navy/50">No follow-ups due.</div>}
              {followUps.map((l) => (
                <div key={l.id} className="flex items-center justify-between rounded-md border border-navy/5 p-3">
                  <div>
                    <div className="text-sm font-semibold text-navy">{l.name}</div>
                    <div className="text-[11px] text-navy/50">Last: {l.lastContact || "Never"}</div>
                  </div>
                  <div className="flex gap-1">
                    <button className="rounded-md bg-navy p-2 text-white hover:bg-navy-deep"><Phone className="h-3.5 w-3.5" /></button>
                    <Link to="/crm/leads/$leadId" params={{ leadId: l.id }} className="rounded-md bg-brand-red p-2 text-white hover:bg-brand-red-dark"><MessageSquare className="h-3.5 w-3.5" /></Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-portal">
            <h3 className="mb-4 font-serif text-xl font-bold text-navy">Recent Chat Activity</h3>
            <div className="space-y-2">
              {chats.slice(0, 3).map((c) => (
                <Link key={c.id} to="/crm/chat/$chatId" params={{ chatId: c.id }} className="block rounded-md border border-navy/5 p-3 hover:bg-offwhite">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-navy">{c.visitorName}</div>
                    <div className="text-[10px] text-navy/50">{c.location}</div>
                  </div>
                  <div className="mt-1 truncate text-xs text-navy/60">{c.messages[c.messages.length - 1]?.message || "—"}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ProductionDashboard() {
    const myTasks = projects.flatMap((p) => p.tasks.filter((t) => t.assignedTo === crmUser!.name).map((t) => ({ ...t, projectId: p.id, bookTitle: p.bookTitle })));
    const inProgress = myTasks.filter((t) => t.status === "In Progress").length;
    const completedToday = myTasks.filter((t) => t.status === "Completed").length;

    const grouped: Record<string, typeof myTasks> = {};
    myTasks.forEach((t) => {
      const k = t.projectId || "Unassigned";
      grouped[k] = grouped[k] || [];
      grouped[k].push(t);
    });

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="card-portal"><div className="font-accent text-[10px] uppercase tracking-wider text-navy/50">In Progress</div><div className="mt-2 font-serif text-3xl font-bold text-navy">{inProgress}</div></div>
          <div className="card-portal"><div className="font-accent text-[10px] uppercase tracking-wider text-navy/50">Completed</div><div className="mt-2 font-serif text-3xl font-bold text-green-600">{completedToday}</div></div>
        </div>

        <div className="card-portal">
          <h3 className="mb-4 font-serif text-2xl font-bold text-navy">My Tasks</h3>
          {Object.entries(grouped).map(([pid, tasks]) => (
            <div key={pid} className="mb-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-red">{pid} • {tasks[0].bookTitle}</div>
              <div className="space-y-2">
                {tasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-md border border-navy/10 p-3">
                    <div>
                      <div className="text-sm font-semibold text-navy">{t.title}</div>
                      <div className="text-[11px] text-navy/50">Due {t.dueDate} • Priority: {t.priority}</div>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">{t.status}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {myTasks.length === 0 && <div className="text-sm text-navy/50">No tasks assigned.</div>}
        </div>
      </div>
    );
  }
}
