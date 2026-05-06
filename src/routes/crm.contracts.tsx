import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Download, Copy, ShieldCheck, ShieldAlert } from "lucide-react";
import { CRMGate } from "@/components/crm/CRMGate";
import { useCRM } from "@/context/CRMContext";
import { generateSignedDocument, downloadSignedPDF } from "@/utils/documentUtils";
import { NDA_TEMPLATE, SERVICE_AGREEMENT_TEMPLATE } from "@/data/crmData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/crm/contracts")({
  head: () => ({ meta: [{ title: "Contracts — AWH CRM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <CRMGate allowedRoles={["project_manager", "salesperson"]}>
      <ContractsPage />
    </CRMGate>
  ),
});

function ContractsPage() {
  const { projects, leads } = useCRM();
  const [filter, setFilter] = useState<"All" | "NDA" | "ServiceAgreement" | "Pending">("All");
  const [preview, setPreview] = useState<{ type: "NDA" | "ServiceAgreement"; project: any } | null>(null);
  const [editTpl, setEditTpl] = useState<"NDA" | "ServiceAgreement" | null>(null);
  const [ndaTpl, setNdaTpl] = useState(NDA_TEMPLATE);
  const [saTpl, setSaTpl] = useState(SERVICE_AGREEMENT_TEMPLATE);

  const docs = projects.flatMap((p) => [
    { type: "NDA" as const, project: p, signed: p.ndaSigned, signedBy: p.ndaSignedBy, signedAt: p.ndaSignedAt },
    { type: "ServiceAgreement" as const, project: p, signed: p.contractSigned, signedBy: p.contractSignedBy, signedAt: p.contractSignedAt },
  ]);

  const filtered = docs.filter((d) => {
    if (filter === "All") return true;
    if (filter === "Pending") return !d.signed;
    return d.type === filter;
  });

  const totalSigned = docs.filter((d) => d.signed).length;
  const pending = docs.filter((d) => !d.signed).length;
  const awaiting = leads.filter((l) => l.status === "Closed Won").filter((l) => !projects.find((p) => p.id === l.projectId));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card-portal"><div className="font-accent text-[10px] uppercase tracking-wider text-navy/50">Total Signed</div><div className="mt-1 font-serif text-3xl font-bold text-green-600">{totalSigned}</div></div>
        <div className="card-portal"><div className="font-accent text-[10px] uppercase tracking-wider text-navy/50">Pending Signature</div><div className="mt-1 font-serif text-3xl font-bold text-amber-600">{pending}</div></div>
        <div className="card-portal"><div className="font-accent text-[10px] uppercase tracking-wider text-navy/50">Awaiting Onboarding</div><div className="mt-1 font-serif text-3xl font-bold text-brand-red">{awaiting.length}</div></div>
      </div>

      <div className="card-portal">
        <div className="mb-3 flex flex-wrap gap-2">
          {(["All", "NDA", "ServiceAgreement", "Pending"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn("rounded-full px-3 py-1 text-xs font-bold", filter === f ? "bg-brand-red text-white" : "bg-navy/10 text-navy")}>{f === "ServiceAgreement" ? "Service Agreements" : f === "NDA" ? "NDAs" : f}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-navy/10 text-left text-[10px] uppercase tracking-wider text-navy/50">
              <tr><th className="py-2">Project</th><th>Client</th><th>Type</th><th>Status</th><th>Signed By</th><th>Signed Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={i} className="border-b border-navy/5">
                  <td className="py-2 font-mono text-xs">{d.project.id}</td>
                  <td>{d.project.clientName}</td>
                  <td>{d.type === "NDA" ? "NDA" : "Service Agreement"}</td>
                  <td>{d.signed ? <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700"><ShieldCheck className="mr-1 inline h-3 w-3" />Signed</span> : <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800"><ShieldAlert className="mr-1 inline h-3 w-3" />Pending</span>}</td>
                  <td className="text-xs">{d.signedBy || "—"}</td>
                  <td className="text-xs">{d.signedAt || "—"}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => setPreview({ type: d.type, project: d.project })} className="rounded-md border border-navy/15 p-1.5 hover:bg-offwhite"><Eye className="h-3 w-3" /></button>
                      {d.signed && (
                        <button onClick={() => {
                          const c = generateSignedDocument(d.type, { name: d.project.clientName, projectId: d.project.id, bookTitle: d.project.bookTitle, genre: d.project.genre, services: d.project.stages.map((s: any) => s.name), estimatedCompletion: d.project.estimatedCompletion, signatureName: d.signedBy! });
                          downloadSignedPDF({ type: d.type, projectId: d.project.id, signedBy: d.signedBy!, signedAt: d.signedAt!, documentContent: c });
                        }} className="rounded-md bg-navy p-1.5 text-white"><Download className="h-3 w-3" /></button>
                      )}
                      {!d.signed && <button onClick={() => toast.success("Reminder sent")} className="rounded-md bg-amber-600 px-2 py-1 text-[10px] font-bold text-white">Remind</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {awaiting.length > 0 && (
        <div className="card-portal">
          <h3 className="mb-3 font-serif text-lg font-bold text-navy">Send Onboarding Link</h3>
          <div className="space-y-2">
            {awaiting.map((l) => {
              const url = `https://awh.com/portal/onboarding?pid=${l.projectId}`;
              return (
                <div key={l.id} className="flex flex-wrap items-center gap-2 rounded-md border border-navy/10 p-3 text-xs">
                  <div className="flex-1">
                    <div className="font-semibold text-navy">{l.name}</div>
                    <div className="font-mono text-[10px] text-navy/50">{url}</div>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(url); toast.success("Copied"); }} className="rounded-md border border-navy/15 p-1.5"><Copy className="h-3 w-3" /></button>
                  <button onClick={() => toast.success(`Onboarding link sent to ${l.email}`)} className="rounded-md bg-brand-red px-3 py-1.5 text-[10px] font-bold uppercase text-white">Send via Email</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card-portal">
        <h3 className="mb-3 font-serif text-lg font-bold text-navy">Templates</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-md border border-navy/10 p-3"><div><div className="font-semibold text-navy">NDA Template</div><div className="text-[11px] text-navy/50">Last updated: Today</div></div><button onClick={() => setEditTpl("NDA")} className="rounded-md bg-navy px-3 py-1.5 text-xs text-white">Edit</button></div>
          <div className="flex items-center justify-between rounded-md border border-navy/10 p-3"><div><div className="font-semibold text-navy">Service Agreement Template</div><div className="text-[11px] text-navy/50">Last updated: Today</div></div><button onClick={() => setEditTpl("ServiceAgreement")} className="rounded-md bg-navy px-3 py-1.5 text-xs text-white">Edit</button></div>
        </div>
      </div>

      {preview && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setPreview(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div initial={{ y: 30 }} animate={{ y: 0 }} onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white">
            {preview.project[preview.type === "NDA" ? "ndaSigned" : "contractSigned"] && (
              <div className="bg-green-600 px-4 py-2 text-xs font-bold text-white"><ShieldCheck className="mr-2 inline h-3 w-3" />Digitally Signed</div>
            )}
            <pre className="max-h-[70vh] overflow-y-auto whitespace-pre-wrap p-6 font-sans text-sm text-navy">
              {generateSignedDocument(preview.type, { name: preview.project.clientName, projectId: preview.project.id, bookTitle: preview.project.bookTitle, genre: preview.project.genre, services: preview.project.stages.map((s: any) => s.name), estimatedCompletion: preview.project.estimatedCompletion, signatureName: preview.project.ndaSignedBy || preview.project.clientName })}
            </pre>
          </motion.div>
        </motion.div>
      )}

      {editTpl && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setEditTpl(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-3xl rounded-lg bg-white p-6">
            <h3 className="font-serif text-2xl font-bold text-navy">Edit {editTpl} Template</h3>
            <textarea value={editTpl === "NDA" ? ndaTpl : saTpl} onChange={(e) => editTpl === "NDA" ? setNdaTpl(e.target.value) : setSaTpl(e.target.value)} rows={20} className="mt-3 w-full rounded-md border border-navy/15 p-3 font-mono text-xs" />
            <button onClick={() => { toast.success("Template updated — applies to future documents."); setEditTpl(null); }} className="btn-uppercase mt-3 rounded-md bg-brand-red px-4 py-2 text-xs text-white">Save Template</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
