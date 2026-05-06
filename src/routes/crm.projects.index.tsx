import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Search, ShieldCheck, ShieldAlert, DollarSign } from "lucide-react";
import { CRMGate } from "@/components/crm/CRMGate";
import { useCRM } from "@/context/CRMContext";
import type { Project } from "@/data/crmData";

export const Route = createFileRoute("/crm/projects/")({
  head: () => ({ meta: [{ title: "Projects — AWH CRM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <CRMGate allowedRoles={["project_manager"]}>
      <ProjectsPage />
    </CRMGate>
  ),
});

const COLS: { key: Project["health"]; color: string }[] = [
  { key: "On Track", color: "bg-green-600" },
  { key: "Needs Attention", color: "bg-amber-600" },
  { key: "Overdue", color: "bg-brand-red" },
  { key: "Completed", color: "bg-navy/40" },
];

function ProjectsPage() {
  const { projects } = useCRM();
  const [search, setSearch] = useState("");
  const filtered = projects.filter((p) => `${p.id} ${p.clientName} ${p.bookTitle}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..." className="w-72 rounded-md border border-navy/15 bg-white py-2 pl-9 pr-3 text-sm" />
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLS.map((col) => {
          const cards = filtered.filter((p) => p.health === col.key);
          return (
            <div key={col.key} className="flex w-80 shrink-0 flex-col rounded-lg">
              <div className={`flex items-center justify-between rounded-t-lg ${col.color} px-3 py-2 text-white`}>
                <span className="text-xs font-bold uppercase tracking-wider">{col.key}</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">{cards.length}</span>
              </div>
              <div className="flex-1 space-y-3 rounded-b-lg bg-navy/5 p-3 min-h-[400px]">
                {cards.map((p) => <ProjectCard key={p.id} project={p} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  const completed = p.stages.filter((s) => s.status === "Completed").length;
  const total = p.stages.length;
  const progress = Math.round((completed / total) * 100);
  const currentStage = p.stages.find((s) => s.status === "In Progress");
  return (
    <motion.div whileHover={{ y: -3 }} className="rounded-md border border-navy/10 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-bold text-white">{p.id}</span>
        {p.ndaSigned ? <ShieldCheck className="h-4 w-4 text-green-600" /> : <ShieldAlert className="h-4 w-4 text-brand-red" />}
      </div>
      <div className="mt-2 font-serif text-base font-bold text-navy">{p.bookTitle}</div>
      <div className="text-xs text-navy/60">{p.clientName}</div>
      <span className="mt-1 inline-block rounded-full bg-navy/10 px-2 py-0.5 text-[10px] font-semibold text-navy">{p.genre}</span>
      <div className="mt-2 text-xs">
        <span className="font-semibold text-navy">{currentStage?.name || "—"}</span>
        <span className="ml-1 text-navy/50">({currentStage?.status || "—"})</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-navy/10">
        <div className="h-full bg-brand-red" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px]">
        <span className="text-navy/60">PM: {p.assignedManager}</span>
        {p.outstanding > 0 && <span className="flex items-center gap-0.5 font-bold text-amber-600"><DollarSign className="h-2.5 w-2.5" />{p.outstanding}</span>}
      </div>
      <Link to="/crm/projects/$projectId" params={{ projectId: p.id }} className="mt-2 block w-full rounded bg-navy py-1 text-center text-[10px] font-bold uppercase text-white hover:bg-navy-deep">View Project</Link>
    </motion.div>
  );
}
