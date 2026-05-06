import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DndContext, useDraggable, useDroppable, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { MapPin, MessageSquare, Search, Plus, X } from "lucide-react";
import { CRMGate } from "@/components/crm/CRMGate";
import { useCRM } from "@/context/CRMContext";
import { crmUsers, type Lead } from "@/data/crmData";
import { toast } from "sonner";

export const Route = createFileRoute("/crm/leads/")({
  head: () => ({ meta: [{ title: "Leads — AWH CRM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <CRMGate allowedRoles={["project_manager", "salesperson"]}>
      <LeadsPage />
    </CRMGate>
  ),
});

const COLS: { key: Lead["status"]; label: string; color: string }[] = [
  { key: "New Lead", label: "New Lead", color: "bg-navy/40" },
  { key: "Contacted", label: "Contacted", color: "bg-[#1a3a7a]" },
  { key: "Qualified", label: "Qualified", color: "bg-amber-600" },
  { key: "Closed Won", label: "Closed Won", color: "bg-green-600" },
  { key: "Closed Lost", label: "Closed Lost", color: "bg-navy/30" },
];

function LeadsPage() {
  const { leads, updateLeadStatus, addLead } = useCRM();
  const [search, setSearch] = useState("");
  const [filterStaff, setFilterStaff] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (search && !`${l.name} ${l.email}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterStaff !== "all" && l.assignedTo !== filterStaff) return false;
      return true;
    });
  }, [leads, search, filterStaff]);

  const onDragEnd = (e: DragEndEvent) => {
    const id = e.active.id as string;
    const target = e.over?.id as Lead["status"] | undefined;
    if (target && COLS.find((c) => c.key === target)) {
      updateLeadStatus(id, target);
      toast.success("Lead status updated");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..." className="w-64 rounded-md border border-navy/15 bg-white py-2 pl-9 pr-3 text-sm" />
          </div>
          <select value={filterStaff} onChange={(e) => setFilterStaff(e.target.value)} className="rounded-md border border-navy/15 bg-white px-3 py-2 text-sm">
            <option value="all">All Staff</option>
            {crmUsers.filter((u) => u.role === "salesperson" || u.role === "project_manager").map((u) => (
              <option key={u.id} value={u.name}>{u.name}</option>
            ))}
          </select>
        </div>
        <button onClick={() => setDrawerOpen(true)} className="btn-uppercase flex items-center gap-2 rounded-md bg-brand-red px-4 py-2 text-xs text-white hover:bg-brand-red-dark">
          <Plus className="h-3.5 w-3.5" /> Add New Lead
        </button>
      </div>

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLS.map((col) => {
            const colLeads = filtered.filter((l) => l.status === col.key);
            return (
              <Column key={col.key} col={col} count={colLeads.length}>
                {colLeads.map((l) => <LeadCard key={l.id} lead={l} />)}
              </Column>
            );
          })}
        </div>
      </DndContext>

      {drawerOpen && <NewLeadDrawer onClose={() => setDrawerOpen(false)} onCreate={addLead} />}
    </div>
  );
}

function Column({ col, children, count }: { col: typeof COLS[number]; children: React.ReactNode; count: number }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.key });
  return (
    <div ref={setNodeRef} className={`flex w-72 shrink-0 flex-col rounded-lg ${isOver ? "ring-2 ring-brand-red" : ""}`}>
      <div className={`flex items-center justify-between rounded-t-lg ${col.color} px-3 py-2 text-white`}>
        <span className="text-xs font-bold uppercase tracking-wider">{col.label}</span>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">{count}</span>
      </div>
      <div className="flex-1 space-y-2 rounded-b-lg bg-navy/5 p-2 min-h-[400px]">{children}</div>
    </div>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      animate={{ scale: isDragging ? 1.05 : 1 }}
      className="cursor-grab rounded-md border border-navy/10 bg-white p-3 shadow-sm hover:shadow-md active:cursor-grabbing"
    >
      <div className="flex items-start justify-between">
        <div className="font-accent text-sm font-bold text-navy">{lead.name}</div>
        <span className="rounded-full bg-navy/10 px-1.5 py-0.5 text-[9px] font-bold text-navy">{lead.source}</span>
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {lead.serviceInterest.slice(0, 2).map((s) => (
          <span key={s} className="rounded-full bg-brand-red/10 px-1.5 py-0.5 text-[9px] text-brand-red">{s}</span>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1 text-[10px] text-navy/60">
        <MapPin className="h-2.5 w-2.5" />{lead.location}
      </div>
      <div className="mt-1 text-[10px] text-navy/50">{lead.createdAt}</div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-[10px] text-navy/60">
          {lead.assignedTo ? (<><span className="inline-block h-4 w-4 rounded-full bg-navy text-center text-[8px] font-bold leading-4 text-white">{lead.assignedTo.split(" ").map(n => n[0]).join("")}</span> <span className="ml-1">{lead.assignedTo}</span></>) : <span className="italic text-navy/40">Unassigned</span>}
        </div>
        {lead.chatHistory.length > 0 && <span className="flex items-center gap-0.5 text-[10px] text-brand-red"><MessageSquare className="h-2.5 w-2.5" />{lead.chatHistory.length}</span>}
      </div>
      <Link to="/crm/leads/$leadId" params={{ leadId: lead.id }} className="mt-2 block w-full rounded bg-navy py-1 text-center text-[10px] font-bold uppercase tracking-wider text-white hover:bg-navy-deep">View Details</Link>
    </motion.div>
  );
}

function NewLeadDrawer({ onClose, onCreate }: { onClose: () => void; onCreate: (l: Lead) => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", source: "Website Form", services: [] as string[], notes: "", assignedTo: "" });
  const services = ["Ghostwriting", "Editing", "Cover Design", "Formatting", "Publishing", "Marketing", "Illustrations", "Author Website"];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `LEAD-${String(Date.now()).slice(-6)}`;
    onCreate({
      id, projectId: `AWH-2024-${String(Date.now()).slice(-4)}`, name: form.name, email: form.email, phone: form.phone, source: form.source,
      serviceInterest: form.services, status: "New Lead", assignedTo: form.assignedTo || null, notes: form.notes,
      createdAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), lastContact: null,
      ipAddress: "0.0.0.0", location: "Manual Entry", chatHistory: [],
    });
    toast.success("Lead created");
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/50">
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6">
        <div className="flex items-center justify-between"><h2 className="font-serif text-2xl font-bold text-navy">New Lead</h2><button onClick={onClose}><X className="h-5 w-5" /></button></div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm" />
          <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm" />
          <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm">
            <option>Website Form</option><option>Live Chat</option><option>Referral</option><option>Other</option>
          </select>
          <div>
            <div className="mb-2 text-xs font-semibold text-navy">Service Interest</div>
            <div className="grid grid-cols-2 gap-2">
              {services.map((s) => (
                <label key={s} className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={form.services.includes(s)} onChange={(e) => setForm({ ...form, services: e.target.checked ? [...form.services, s] : form.services.filter((x) => x !== s) })} />
                  {s}
                </label>
              ))}
            </div>
          </div>
          <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm" rows={3} />
          <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm">
            <option value="">Unassigned</option>
            {crmUsers.filter((u) => u.role === "salesperson" || u.role === "project_manager").map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
          </select>
          <button type="submit" className="btn-uppercase w-full rounded-md bg-brand-red py-3 text-xs text-white hover:bg-brand-red-dark">Create Lead</button>
        </form>
      </motion.div>
    </motion.div>
  );
}
