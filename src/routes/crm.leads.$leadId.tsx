import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Globe, Hash, Copy, Send, Check } from "lucide-react";
import { CRMGate } from "@/components/crm/CRMGate";
import { useCRM } from "@/context/CRMContext";
import { useCRMAuth } from "@/context/CRMAuthContext";
import { crmUsers, type Lead } from "@/data/crmData";
import { toast } from "sonner";

export const Route = createFileRoute("/crm/leads/$leadId")({
  head: () => ({ meta: [{ title: "Lead Detail — AWH CRM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <CRMGate allowedRoles={["project_manager", "salesperson"]}>
      <LeadDetail />
    </CRMGate>
  ),
});

function LeadDetail() {
  const { leadId } = useParams({ from: "/crm/leads/$leadId" });
  const navigate = useNavigate();
  const { leads, updateLeadStatus, assignLead, addLeadMessage, updateLeadNotes } = useCRM();
  const { crmUser } = useCRMAuth();
  const lead = leads.find((l) => l.id === leadId);
  const [draft, setDraft] = useState("");
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(lead?.notes || "");
  const [convertOpen, setConvertOpen] = useState(false);

  if (!lead) {
    return <div className="card-portal">Lead not found. <Link to="/crm/leads" className="text-brand-red">Back</Link></div>;
  }

  const send = () => {
    if (!draft.trim() || !crmUser) return;
    addLeadMessage(lead.id, draft, crmUser.name);
    setDraft("");
  };

  const copy = (txt: string) => { navigator.clipboard.writeText(txt); toast.success("Copied"); };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="card-portal">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-3xl font-bold text-navy">{lead.name}</h2>
              <div className="mt-1 flex items-center gap-2 text-xs text-navy/60">
                <span className="rounded-full bg-navy/10 px-2 py-0.5 font-bold">{lead.source}</span>
                <span>•</span><span>{lead.createdAt}</span>
              </div>
            </div>
            <select value={lead.status} onChange={(e) => { updateLeadStatus(lead.id, e.target.value as Lead["status"]); toast.success("Status updated"); }} className="rounded-md border border-navy/15 px-3 py-2 text-sm font-semibold text-navy">
              <option>New Lead</option><option>Contacted</option><option>Qualified</option><option>Closed Won</option><option>Closed Lost</option>
            </select>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <InfoRow icon={Mail} label={lead.email} onCopy={() => copy(lead.email)} />
            <InfoRow icon={Phone} label={lead.phone} onCopy={() => copy(lead.phone)} />
            <InfoRow icon={MapPin} label={lead.location} />
            <InfoRow icon={Globe} label={lead.ipAddress} />
            <InfoRow icon={Hash} label={lead.projectId} />
          </div>

          <div className="mt-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-navy/50">Service Interests</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {lead.serviceInterest.map((s) => <span key={s} className="rounded-full bg-brand-red/10 px-2 py-0.5 text-xs text-brand-red">{s}</span>)}
            </div>
          </div>

          {lead.status === "Closed Won" && (
            <button onClick={() => setConvertOpen(true)} className="btn-uppercase mt-4 rounded-md bg-green-600 px-4 py-2 text-xs text-white hover:bg-green-700">Convert to Client</button>
          )}
        </div>

        <div className="card-portal">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-navy">Notes</h3>
            {!editingNotes && <button onClick={() => setEditingNotes(true)} className="text-xs font-semibold text-brand-red hover:underline">Edit</button>}
          </div>
          {editingNotes ? (
            <div className="mt-2 space-y-2">
              <textarea value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} rows={4} className="w-full rounded-md border border-navy/15 p-2 text-sm" />
              <div className="flex gap-2">
                <button onClick={() => { updateLeadNotes(lead.id, notesDraft); setEditingNotes(false); toast.success("Saved"); }} className="rounded-md bg-brand-red px-3 py-1.5 text-xs font-bold text-white">Save</button>
                <button onClick={() => { setNotesDraft(lead.notes); setEditingNotes(false); }} className="rounded-md border border-navy/15 px-3 py-1.5 text-xs">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-navy/70">{lead.notes || <span className="italic text-navy/40">No notes yet.</span>}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="card-portal flex h-[500px] flex-col p-0">
          <div className="border-b border-navy/10 px-4 py-3"><h3 className="font-serif text-lg font-bold text-navy">Chat History</h3></div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {lead.chatHistory.length === 0 && <div className="text-center text-xs text-navy/50">No messages yet.</div>}
            {lead.chatHistory.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.from === "visitor" ? "items-start" : "items-end"}`}>
                {m.from === "staff" && m.staffName && <div className="text-[10px] text-navy/50">{m.staffName}</div>}
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from === "visitor" ? "bg-navy/10 text-navy" : "bg-brand-red text-white"}`}>{m.message}</div>
                <div className="mt-0.5 text-[9px] text-navy/40">{m.time}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-navy/10 p-2 flex gap-2">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Reply..." className="flex-1 rounded-md border border-navy/15 px-3 py-2 text-sm" />
            <button onClick={send} className="rounded-md bg-brand-red px-3 text-white"><Send className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="card-portal">
          <h3 className="font-serif text-lg font-bold text-navy">Assigned To</h3>
          <select value={lead.assignedTo || ""} onChange={(e) => { assignLead(lead.id, e.target.value); toast.success("Reassigned"); }} className="mt-2 w-full rounded-md border border-navy/15 px-3 py-2 text-sm">
            <option value="">Unassigned</option>
            {crmUsers.filter((u) => u.role === "salesperson" || u.role === "project_manager").map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
          </select>
        </div>
      </div>

      {convertOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setConvertOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="font-serif text-2xl font-bold text-navy">Convert to Client</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div><span className="text-navy/50">Name:</span> {lead.name}</div>
              <div><span className="text-navy/50">Email:</span> {lead.email}</div>
              <div><span className="text-navy/50">Phone:</span> {lead.phone}</div>
              <div><span className="text-navy/50">Project ID:</span> {lead.projectId}</div>
            </div>
            <button onClick={() => { toast.success("Client account created"); setConvertOpen(false); navigate({ to: "/crm/projects" }); }} className="btn-uppercase mt-4 w-full rounded-md bg-brand-red py-3 text-xs text-white hover:bg-brand-red-dark">
              <Check className="mr-2 inline h-3.5 w-3.5" />Create Client Account
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, onCopy }: { icon: typeof Mail; label: string; onCopy?: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-offwhite p-2 text-xs">
      <Icon className="h-3.5 w-3.5 text-navy/50" />
      <span className="flex-1 text-navy">{label}</span>
      {onCopy && <button onClick={onCopy} className="text-navy/40 hover:text-brand-red"><Copy className="h-3 w-3" /></button>}
    </div>
  );
}
