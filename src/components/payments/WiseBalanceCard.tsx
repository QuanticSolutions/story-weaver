import { useEffect, useState } from "react";
import { RefreshCw, Wallet } from "lucide-react";
import { wiseService } from "@/services/wiseService";
import { toast } from "sonner";

type Balance = { id: number; currency: string; amount: { value: number; currency: string }; type: string };

export function WiseBalanceCard() {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await wiseService.getBalance();
      setBalances(Array.isArray(data) ? data : []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load balances");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-brand-red" />
          <h3 className="font-serif text-lg font-bold text-navy">Wise Balances</h3>
        </div>
        <button onClick={load} disabled={loading} className="rounded-md p-1.5 text-navy/60 hover:bg-navy/5 disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
      {balances.length === 0 ? (
        <p className="text-sm text-navy/50">{loading ? "Loading…" : "No balances available."}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {balances.map((b) => (
            <div key={b.id} className="rounded-lg bg-offwhite px-3 py-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-navy/50">{b.amount?.currency || b.currency}</div>
              <div className="font-serif text-lg font-bold text-navy">
                {(b.amount?.value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
