import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  DollarSign,
  CheckCircle,
  AlertCircle,
  Download,
  Clock,
  ExternalLink,
  Globe,
  CreditCard,
  Building2,
  Info,
  Mail,
} from "lucide-react";
import { PortalGate } from "@/components/portal/PortalGate";
import { sampleClient } from "@/data/sampleClient";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/portal/billing")({
  head: () => ({ meta: [{ title: "Billing — AWH Client Portal" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <PortalGate>
      <BillingPage />
    </PortalGate>
  ),
});

function BillingPage() {
  const total = sampleClient.billing.reduce((sum, b) => sum + b.amount, 0);
  const paid = sampleClient.billing.filter((b) => b.status === "Paid").reduce((s, b) => s + b.amount, 0);
  const outstanding = total - paid;
  const [payOpen, setPayOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<DollarSign className="h-5 w-5" />}
          color="text-navy"
          label="Total Project Value"
          value={`$${total.toLocaleString()}`}
        />
        <SummaryCard
          icon={<CheckCircle className="h-5 w-5" />}
          color="text-green-600"
          label="Amount Paid"
          value={`$${paid.toLocaleString()}`}
        />
        <SummaryCard
          icon={<AlertCircle className="h-5 w-5" />}
          color="text-brand-red"
          label="Outstanding Balance"
          value={`$${outstanding.toLocaleString()}`}
        />
      </div>

      {/* Invoices Table */}
      <div className="card-portal !p-0 overflow-hidden">
        <div className="border-b border-navy/5 px-6 py-4">
          <h3 className="font-serif text-xl font-bold text-navy">Invoice History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy/5 bg-offwhite text-left">
                <th className="px-6 py-3 font-accent text-[10px] font-bold uppercase tracking-wider text-navy/60">Invoice</th>
                <th className="px-6 py-3 font-accent text-[10px] font-bold uppercase tracking-wider text-navy/60">Description</th>
                <th className="px-6 py-3 font-accent text-[10px] font-bold uppercase tracking-wider text-navy/60">Amount</th>
                <th className="px-6 py-3 font-accent text-[10px] font-bold uppercase tracking-wider text-navy/60">Date</th>
                <th className="px-6 py-3 font-accent text-[10px] font-bold uppercase tracking-wider text-navy/60">Method</th>
                <th className="px-6 py-3 font-accent text-[10px] font-bold uppercase tracking-wider text-navy/60">Status</th>
                <th className="px-6 py-3 font-accent text-[10px] font-bold uppercase tracking-wider text-navy/60">Action</th>
              </tr>
            </thead>
            <tbody>
              {sampleClient.billing.map((inv) => (
                <tr key={inv.id} className="border-b border-navy/5 last:border-0 hover:bg-offwhite/50">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-navy">{inv.id}</td>
                  <td className="px-6 py-4 text-navy">{inv.description}</td>
                  <td className="px-6 py-4 font-semibold text-navy">${inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-navy/60">{inv.date}</td>
                  <td className="px-6 py-4 text-navy/60">{inv.method || "—"}</td>
                  <td className="px-6 py-4"><StatusPill status={inv.status} /></td>
                  <td className="px-6 py-4">
                    {inv.status === "Paid" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success("Invoice downloaded", { description: `${inv.id}.pdf` })}
                      >
                        <Download className="mr-1.5 h-3.5 w-3.5" /> Download
                      </Button>
                    )}
                    {inv.status === "Pending" && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-navy/50">
                        <Clock className="h-3.5 w-3.5" /> Awaiting Payment
                      </span>
                    )}
                    {inv.status === "Unpaid" && (
                      <Button
                        size="sm"
                        onClick={() => setPayOpen(true)}
                        className="bg-brand-red text-white hover:bg-brand-red-dark"
                      >
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Pay Now
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment methods */}
      <div>
        <h3 className="mb-3 font-serif text-xl font-bold text-navy">Accepted Payment Methods</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <PaymentCard icon={<Globe className="h-6 w-6" />} name="Wise Transfer" />
          <PaymentCard icon={<CreditCard className="h-6 w-6" />} name="PayPal" />
          <PaymentCard icon={<Building2 className="h-6 w-6" />} name="Bank Transfer" />
        </div>
      </div>

      {/* Note banner */}
      <div className="flex items-start gap-3 rounded-2xl bg-navy p-5 text-white">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-white/70" />
        <p className="text-sm leading-relaxed text-white/90">
          All payments are processed securely by your dedicated project manager. No payment is ever taken without your explicit approval.
        </p>
      </div>

      {/* Pay Now Dialog */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-navy">Manual Payment Process</DialogTitle>
            <DialogDescription className="text-navy/70">
              All payments at American Writers Hub are processed manually by your project manager
              to ensure security and clarity. Please contact Sarah Collins to initiate payment for
              this invoice. She will guide you through the preferred method.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPayOpen(false)}>Close</Button>
            <Button asChild className="bg-brand-red text-white hover:bg-brand-red-dark">
              <Link to="/portal/messages">
                <Mail className="mr-1.5 h-4 w-4" /> Message Manager
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryCard({ icon, color, label, value }: { icon: React.ReactNode; color: string; label: string; value: string }) {
  return (
    <div className="card-portal">
      <div className={`flex items-center gap-2 ${color}`}>{icon}
        <span className="font-accent text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-3 font-serif text-3xl font-bold text-navy">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Paid: "bg-green-100 text-green-800",
    Pending: "bg-amber-100 text-amber-800",
    Unpaid: "bg-brand-red/10 text-brand-red",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

function PaymentCard({ icon, name }: { icon: React.ReactNode; name: string }) {
  return (
    <div className="card-portal flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy/5 text-navy">{icon}</div>
      <div>
        <div className="font-accent text-sm font-bold text-navy">{name}</div>
        <div className="text-xs text-navy/50">Contact your manager to initiate payment</div>
      </div>
    </div>
  );
}
