import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Hash, Mail, Phone, Copy, Send, ShieldCheck, ShieldAlert, Plus, Eye } from "lucide-react";
import { CRMGate } from "@/components/crm/CRMGate";
import { useCRM } from "@/context/CRMContext";
import { useCRMAuth } from "@/context/CRMAuthContext";
import { crmUsers, type Stage, type Task, type Invoice } from "@/data/crmData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { generateSignedDocument, downloadSignedPDF } from "@/utils/documentUtils";
import { toast } from "sonner";

export const Route = createFileRoute("/crm/projects/$projectId")({
  head: () => ({ meta: [{ title: "Project — AWH CRM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <CRMGate allowedRoles={["project_manager"]}>
      <ProjectDetail />
    </CRMGate>
  ),
});

const STATUS_COLORS: Record<string, string> = {
  "Not Started": "bg-navy/10 text-navy",
  "In Progress": "bg-amber-100 text-amber-800",
  "On Hold (Client)": "bg-blue-100 text-blue-800",
  "On Hold (Company)": "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-700",
};

function ProjectDetail() {
  const { projectId } = useParams({ from: "/crm/projects/$projectId" });
  const { projects, updateStageStatus, updateStageNotes, assignStageToProduction, addTask, updateTaskStatus, addInvoice, updateInvoiceStatus, addInternalNote, addProjectMessage } = useCRM();
  const { crmUser } = useCRMAuth();
  const project = projects.find((p) => p.id === projectId);
  const [draft, setDraft] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const [taskOpen, setTaskOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<"NDA" | "ServiceAgreement" | null>(null);

  if (!project) return <div className="card-portal">Project not found.</div>;

  const completed = project.stages.filter((s) => s.status === "Completed").length;
  const productionUsers = crmUsers.filter((u) => u.role === "production");

  return (
    <div className="space-y-6">
      <div className="card-portal">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-bold text-white">{project.id}</span>
          <h2 className="font-serif text-3xl font-bold text-navy">{project.bookTitle}</h2>
          <span className="rounded-full bg-navy/10 px-2 py-0.5 text-xs font-bold text-navy">{project.genre}</span>
          <span className="text-sm text-navy/60">• {project.clientName}</span>
          <Link to="/portal/login" className="ml-auto text-xs font-semibold text-brand-red hover:underline">View Client Portal →</Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-6 text-xs">
          <Stat label="Total Value" value={`$${project.totalValue}`} />
          <Stat label="Paid" value={`$${project.amountPaid}`} />
          <Stat label="Outstanding" value={`$${project.outstanding}`} />
          <Stat label="Start" value={project.startDate} />
          <Stat label="Est. Complete" value={project.estimatedCompletion} />
          <Stat label="PM" value={project.assignedManager} />
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stages">Stages</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="card-portal">
              <h3 className="font-serif text-lg font-bold text-navy">Health</h3>
              <div className="mt-2 text-sm">{project.health}</div>
              <div className="mt-3 text-xs text-navy/60">{completed} of {project.stages.length} stages complete</div>
            </div>
            <div className="card-portal">
              <h3 className="font-serif text-lg font-bold text-navy">Client</h3>
              <div className="mt-2 space-y-1 text-xs">
                <div className="flex items-center gap-1"><Mail className="h-3 w-3 text-navy/50" /> {project.clientEmail} <button onClick={() => navigator.clipboard.writeText(project.clientEmail)}><Copy className="h-3 w-3 text-navy/40" /></button></div>
                <div className="flex items-center gap-1"><Hash className="h-3 w-3 text-navy/50" /> {project.clientId}</div>
              </div>
            </div>
            <div className="card-portal">
              <h3 className="font-serif text-lg font-bold text-navy">Quick Stats</h3>
              <div className="mt-2 space-y-1 text-xs text-navy/70">
                <div>Tasks: {project.tasks.filter(t => t.status === "Completed").length} / {project.tasks.length} complete</div>
                <div>Invoices: {project.invoices.filter(i => i.status === "Paid").length} / {project.invoices.length} paid</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stages">
          <div className="card-portal space-y-2">
            {project.stages.map((s) => (
              <motion.div key={s.name} whileHover={{ backgroundColor: "rgba(11,31,75,0.02)" }} className="rounded-md border border-navy/10 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-semibold text-navy">{s.name}</div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_COLORS[s.status] || "bg-navy/10"}`}>{s.status}</span>
                  <select value={s.status} onChange={(e) => { updateStageStatus(project.id, s.name, e.target.value as Stage["status"]); toast.success("Status updated"); }} className="ml-auto rounded-md border border-navy/15 px-2 py-1 text-xs">
                    <option>Not Started</option><option>In Progress</option><option>On Hold (Client)</option><option>On Hold (Company)</option><option>Completed</option>
                  </select>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-navy/50">Assigned:</span>
                  <select value={s.assignedTo || ""} onChange={(e) => assignStageToProduction(project.id, s.name, e.target.value)} className="rounded-md border border-navy/15 px-2 py-1 text-xs">
                    <option value="">Unassigned</option>
                    {productionUsers.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                  </select>
                  {s.submittedAt && <span className="text-navy/50">• Submitted: {s.submittedAt}</span>}
                  {s.approvedAt && <span className="text-navy/50">• Approved: {s.approvedAt}</span>}
                </div>
                <textarea value={s.notes} onChange={(e) => updateStageNotes(project.id, s.name, e.target.value)} placeholder="Notes..." rows={2} className="mt-2 w-full rounded-md border border-navy/10 bg-offwhite/50 p-2 text-xs" />
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <div className="card-portal">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-navy">Tasks</h3>
              <button onClick={() => setTaskOpen(true)} className="btn-uppercase rounded-md bg-brand-red px-3 py-1.5 text-xs text-white"><Plus className="mr-1 inline h-3 w-3" />Add Task</button>
            </div>
            <div className="space-y-2">
              {project.tasks.map((t) => (
                <div key={t.id} className="flex flex-wrap items-center gap-2 rounded-md border border-navy/10 p-3">
                  <div className={`flex-1 ${t.status === "Completed" ? "line-through text-navy/40" : ""}`}>
                    <div className="text-sm font-semibold text-navy">{t.title}</div>
                    <div className="text-[11px] text-navy/50">Due {t.dueDate} • {t.assignedTo}</div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${t.priority === "High" ? "bg-brand-red/15 text-brand-red" : t.priority === "Medium" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-700"}`}>{t.priority}</span>
                  <select value={t.status} onChange={(e) => updateTaskStatus(t.id, e.target.value as Task["status"])} className="rounded-md border border-navy/15 px-2 py-1 text-xs">
                    <option>Not Started</option><option>In Progress</option><option>On Hold</option><option>Submitted</option><option>Completed</option>
                  </select>
                </div>
              ))}
            </div>
            {taskOpen && <NewTaskModal onClose={() => setTaskOpen(false)} onAdd={(t) => { addTask(project.id, t); setTaskOpen(false); toast.success("Task added"); }} projectId={project.id} bookTitle={project.bookTitle} />}
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="card-portal">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-navy">Invoices</h3>
              <button onClick={() => setInvoiceOpen(true)} className="btn-uppercase rounded-md bg-brand-red px-3 py-1.5 text-xs text-white"><Plus className="mr-1 inline h-3 w-3" />Add Invoice</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-navy/10 text-left text-[10px] uppercase tracking-wider text-navy/50">
                  <tr><th className="py-2">ID</th><th>Description</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {project.invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-navy/5">
                      <td className="py-2 font-mono text-xs">{inv.id}</td>
                      <td>{inv.description}</td>
                      <td className="font-semibold">${inv.amount}</td>
                      <td>
                        <select value={inv.status} onChange={(e) => { const ns = e.target.value as Invoice["status"]; if (ns === "Paid") { const m = prompt("Payment method?", "Wise") || "Wise"; updateInvoiceStatus(project.id, inv.id, ns, m); } else updateInvoiceStatus(project.id, inv.id, ns); toast.success("Updated"); }} className="rounded-md border border-navy/15 px-2 py-1 text-xs">
                          <option>Unpaid</option><option>Pending</option><option>Paid</option>
                        </select>
                      </td>
                      <td className="text-xs">{inv.date}</td>
                      <td>
                        <button onClick={() => { navigator.clipboard.writeText(`https://pay.americanwritershub.com/${project.id}/${inv.id}`); toast.success("Payment link copied — share with client"); }} className="text-xs font-semibold text-brand-red hover:underline">Generate Link</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {invoiceOpen && <NewInvoiceModal onClose={() => setInvoiceOpen(false)} onAdd={(inv) => { addInvoice(project.id, inv); setInvoiceOpen(false); toast.success("Invoice added"); }} count={project.invoices.length} />}
          </div>
        </TabsContent>

        <TabsContent value="files">
          <div className="card-portal">
            <h3 className="font-serif text-lg font-bold text-navy">Files</h3>
            <div className="mt-3 rounded-md border-2 border-dashed border-navy/20 p-8 text-center text-sm text-navy/50">
              Drag files here or click to upload (simulated)
            </div>
            <div className="mt-3 space-y-1 text-xs text-navy/60">Files appear in client portal automatically.</div>
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <div className="card-portal flex h-[500px] flex-col p-0">
            <div className="border-b border-navy/10 px-4 py-3"><h3 className="font-serif text-lg font-bold text-navy">Conversation with {project.clientName}</h3></div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {(project.messages || []).map((m) => (
                <div key={m.id} className={`flex ${m.fromClient ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${m.fromClient ? "bg-navy/10 text-navy" : "bg-brand-red text-white"}`}>
                    <div className="text-[10px] opacity-70">{m.from}</div>
                    {m.message}
                    <div className="mt-1 text-[9px] opacity-60">{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-navy/10 p-2 flex gap-2">
              <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && draft.trim() && crmUser) { addProjectMessage(project.id, draft, { name: crmUser.name, avatar: crmUser.avatar, role: "Project Manager", fromClient: false }); setDraft(""); } }} placeholder="Reply..." className="flex-1 rounded-md border border-navy/15 px-3 py-2 text-sm" />
              <button onClick={() => { if (draft.trim() && crmUser) { addProjectMessage(project.id, draft, { name: crmUser.name, avatar: crmUser.avatar, role: "Project Manager", fromClient: false }); setDraft(""); } }} className="rounded-md bg-brand-red px-3 text-white"><Send className="h-4 w-4" /></button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contracts">
          <div className="card-portal space-y-3">
            <ContractRow type="NDA" signed={project.ndaSigned} signedBy={project.ndaSignedBy} signedAt={project.ndaSignedAt} onPreview={() => setPreviewDoc("NDA")} project={project} />
            <ContractRow type="ServiceAgreement" signed={project.contractSigned} signedBy={project.contractSignedBy} signedAt={project.contractSignedAt} onPreview={() => setPreviewDoc("ServiceAgreement")} project={project} />
          </div>
          {previewDoc && <DocPreviewModal type={previewDoc} project={project} onClose={() => setPreviewDoc(null)} />}
        </TabsContent>

        <TabsContent value="notes">
          <div className="card-portal">
            <h3 className="font-serif text-lg font-bold text-navy">Internal Notes</h3>
            <div className="mt-3 flex gap-2">
              <textarea value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} rows={2} placeholder="Add an internal note..." className="flex-1 rounded-md border border-navy/15 p-2 text-sm" />
              <button onClick={() => { if (noteDraft.trim() && crmUser) { addInternalNote(project.id, noteDraft, crmUser.name); setNoteDraft(""); toast.success("Note added"); } }} className="btn-uppercase rounded-md bg-brand-red px-4 text-xs text-white">Add</button>
            </div>
            <div className="mt-4 space-y-2">
              {project.internalNotes.map((n, i) => (
                <div key={i} className="rounded-md border-l-4 border-l-navy bg-offwhite p-3">
                  <div className="text-sm text-navy">{n.note}</div>
                  <div className="mt-1 text-[11px] text-navy/50">— {n.author} • {n.date}</div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div><div className="font-accent text-[9px] uppercase tracking-wider text-navy/50">{label}</div><div className="text-sm font-semibold text-navy">{value}</div></div>;
}

function ContractRow({ type, signed, signedBy, signedAt, onPreview, project }: any) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md border border-navy/10 p-3">
      <div className="flex-1">
        <div className="font-semibold text-navy">{type === "NDA" ? "Non-Disclosure Agreement" : "Service Agreement"}</div>
        {signed ? (
          <div className="mt-1 flex items-center gap-1 text-xs text-green-700"><ShieldCheck className="h-3 w-3" />Signed by {signedBy} on {signedAt}</div>
        ) : (
          <div className="mt-1 flex items-center gap-1 text-xs text-brand-red"><ShieldAlert className="h-3 w-3" />Not yet signed</div>
        )}
      </div>
      <button onClick={onPreview} className="rounded-md border border-navy/15 px-3 py-1.5 text-xs"><Eye className="mr-1 inline h-3 w-3" />Preview</button>
      {signed && (
        <button onClick={() => {
          const content = generateSignedDocument(type, { name: project.clientName, projectId: project.id, bookTitle: project.bookTitle, genre: project.genre, services: project.stages.map((s: Stage) => s.name), estimatedCompletion: project.estimatedCompletion, signatureName: signedBy });
          downloadSignedPDF({ type, projectId: project.id, signedBy, signedAt, documentContent: content });
        }} className="rounded-md bg-navy px-3 py-1.5 text-xs text-white">Download</button>
      )}
    </div>
  );
}

function DocPreviewModal({ type, project, onClose }: any) {
  const content = generateSignedDocument(type, { name: project.clientName, projectId: project.id, bookTitle: project.bookTitle, genre: project.genre, services: project.stages.map((s: Stage) => s.name), estimatedCompletion: project.estimatedCompletion, signatureName: project.ndaSignedBy || project.clientName });
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <motion.div initial={{ y: 30 }} animate={{ y: 0 }} onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white">
        <div className="bg-green-600 px-4 py-2 text-xs font-bold text-white"><ShieldCheck className="mr-2 inline h-3 w-3" />Digitally Signed by {project.ndaSignedBy} on {project.ndaSignedAt}</div>
        <pre className="max-h-[70vh] overflow-y-auto whitespace-pre-wrap p-6 font-sans text-sm text-navy">{content}</pre>
        <div className="border-t p-3 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-navy/15 px-3 py-1.5 text-xs">Close</button>
          <button onClick={() => downloadSignedPDF({ type, projectId: project.id, signedBy: project.ndaSignedBy, signedAt: project.ndaSignedAt, documentContent: content })} className="rounded-md bg-brand-red px-3 py-1.5 text-xs text-white">Download PDF</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NewTaskModal({ onClose, onAdd, projectId, bookTitle }: { onClose: () => void; onAdd: (t: Task) => void; projectId: string; bookTitle: string }) {
  const [form, setForm] = useState({ title: "", assignedTo: "", dueDate: "", priority: "Medium" as Task["priority"] });
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-lg bg-white p-6">
        <h3 className="font-serif text-2xl font-bold text-navy">New Task</h3>
        <form onSubmit={(e) => { e.preventDefault(); onAdd({ id: `TASK-${Date.now()}`, ...form, status: "Not Started", projectId, bookTitle }); }} className="mt-4 space-y-3">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm" />
          <select required value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm">
            <option value="">Assign to...</option>
            {crmUsers.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
          </select>
          <input required type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm" />
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Task["priority"] })} className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm">
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
          <button type="submit" className="btn-uppercase w-full rounded-md bg-brand-red py-2.5 text-xs text-white">Add Task</button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function NewInvoiceModal({ onClose, onAdd, count }: { onClose: () => void; onAdd: (i: Invoice) => void; count: number }) {
  const [form, setForm] = useState({ description: "", amount: 0, date: "", method: "Wise" });
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-lg bg-white p-6">
        <h3 className="font-serif text-2xl font-bold text-navy">New Invoice</h3>
        <form onSubmit={(e) => { e.preventDefault(); onAdd({ id: `INV-${String(count + 1).padStart(3, "0")}`, description: form.description, amount: Number(form.amount), date: form.date, method: form.method, status: "Unpaid" }); }} className="mt-4 space-y-3">
          <input required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm" />
          <input required type="number" placeholder="Amount" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm" />
          <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm" />
          <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm">
            <option>Wise</option><option>PayPal</option><option>Bank Transfer</option><option>Zelle</option>
          </select>
          <button type="submit" className="btn-uppercase w-full rounded-md bg-brand-red py-2.5 text-xs text-white">Create Invoice</button>
        </form>
      </motion.div>
    </motion.div>
  );
}
