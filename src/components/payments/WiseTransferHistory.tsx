import { useEffect, useState } from "react";
import { wiseService } from "@/services/wiseService";

const STATUS_STYLES: Record<string, string> = {
  incoming_payment_waiting: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  funds_converted: "bg-indigo-100 text-indigo-800",
  outgoing_payment_sent: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export function WiseTransferHistory() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      try { setRows(await wiseService.listSavedTransfers()); } finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
      <h3 className="mb-4 font-serif text-lg font-bold text-navy">Transfer History</h3>
      {loading ? (
        <p className="text-sm text-navy/50">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-navy/50">No transfers yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[10px] uppercase tracking-wider text-navy/50">
              <tr><th className="py-2">Reference</th><th>From</th><th>To</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} onClick={() => setActive(r)} className="cursor-pointer border-t border-navy/5 hover:bg-offwhite/50">
                  <td className="py-2.5 font-medium text-navy">{r.reference || r.transfer_id}</td>
                  <td>{Number(r.source_amount).toFixed(2)} {r.source_currency}</td>
                  <td>{Number(r.target_amount).toFixed(2)} {r.target_currency}</td>
                  <td><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[r.status] || "bg-navy/10 text-navy"}`}>{r.status}</span></td>
                  <td className="text-navy/60">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setActive(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h4 className="mb-3 font-serif text-lg font-bold text-navy">Transfer Details</h4>
            <pre className="max-h-80 overflow-auto rounded-lg bg-offwhite p-3 text-[11px] text-navy/80">{JSON.stringify(active, null, 2)}</pre>
            <button onClick={() => setActive(null)} className="mt-3 w-full rounded-md bg-navy py-2 text-sm font-bold text-white">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
