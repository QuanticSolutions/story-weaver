import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { wiseService } from "@/services/wiseService";
import { toast } from "sonner";

type Props = { open: boolean; onClose: () => void; defaultReference?: string };

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "INR"];

export function WisePaymentModal({ open, onClose, defaultReference }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  // Step 1
  const [sourceCurrency, setSourceCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const [sourceAmount, setSourceAmount] = useState("100");
  const [quote, setQuote] = useState<any>(null);
  // Step 2
  const [holder, setHolder] = useState("");
  const [iban, setIban] = useState("");
  const [recipient, setRecipient] = useState<any>(null);
  // Step 3+
  const [reference, setReference] = useState(defaultReference || "Payment");
  const [transfer, setTransfer] = useState<any>(null);

  if (!open) return null;

  const reset = () => { setStep(1); setQuote(null); setRecipient(null); setTransfer(null); };
  const close = () => { reset(); onClose(); };

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const q = await wiseService.createQuote({
        sourceCurrency, targetCurrency, sourceAmount: parseFloat(sourceAmount) || 0,
      });
      setQuote(q); setStep(2);
    } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  const saveRecipient = async () => {
    setLoading(true);
    try {
      const rec = await wiseService.createRecipient({
        currency: targetCurrency,
        type: targetCurrency === "EUR" ? "iban" : "sort_code",
        profile: undefined,
        accountHolderName: holder,
        details: { legalType: "PRIVATE", IBAN: iban },
      });
      setRecipient(rec); setStep(3);
    } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  const confirmTransfer = async () => {
    setLoading(true);
    try {
      const t = await wiseService.createTransfer(quote.id, recipient.id, reference);
      await wiseService.fundTransfer(t.id);
      await wiseService.saveTransfer({
        transfer_id: String(t.id), quote_id: String(quote.id), recipient_id: String(recipient.id),
        source_currency: sourceCurrency, target_currency: targetCurrency,
        source_amount: Number(quote.sourceAmount), target_amount: Number(quote.targetAmount),
        status: t.status || "processing", reference,
      });
      setTransfer(t); setStep(4);
    } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-navy/10 px-5 py-4">
            <h3 className="font-serif text-lg font-bold text-navy">Send via Wise · Step {step} of 4</h3>
            <button onClick={close} className="text-navy/50 hover:text-navy"><X className="h-5 w-5" /></button>
          </div>

          <div className="space-y-4 p-5">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-xs">From
                    <select value={sourceCurrency} onChange={(e) => setSourceCurrency(e.target.value)} className="mt-1 w-full rounded-md border border-navy/15 px-3 py-2 text-sm">
                      {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </label>
                  <label className="text-xs">To
                    <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)} className="mt-1 w-full rounded-md border border-navy/15 px-3 py-2 text-sm">
                      {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </label>
                </div>
                <label className="block text-xs">Amount
                  <input type="number" value={sourceAmount} onChange={(e) => setSourceAmount(e.target.value)} className="mt-1 w-full rounded-md border border-navy/15 px-3 py-2 text-sm" />
                </label>
                <button onClick={fetchQuote} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-red py-2.5 text-sm font-bold text-white disabled:opacity-50">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />} Get Quote
                </button>
              </>
            )}

            {step === 2 && quote && (
              <>
                <div className="rounded-lg bg-offwhite p-3 text-sm">
                  <div className="flex justify-between"><span>Rate</span><strong>{quote.rate}</strong></div>
                  <div className="flex justify-between"><span>Fee</span><strong>{quote.fee || quote.feeBreakdown?.transferwise || "—"}</strong></div>
                  <div className="flex justify-between"><span>Recipient gets</span><strong>{quote.targetAmount} {targetCurrency}</strong></div>
                </div>
                <input value={holder} onChange={(e) => setHolder(e.target.value)} placeholder="Account holder name" className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm" />
                <input value={iban} onChange={(e) => setIban(e.target.value)} placeholder="IBAN / Account number" className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm" />
                <button onClick={saveRecipient} disabled={loading || !holder || !iban} className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-red py-2.5 text-sm font-bold text-white disabled:opacity-50">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />} Save Recipient
                </button>
              </>
            )}

            {step === 3 && quote && recipient && (
              <>
                <div className="rounded-lg bg-offwhite p-3 text-sm space-y-1">
                  <div className="flex justify-between"><span>You send</span><strong>{quote.sourceAmount} {sourceCurrency}</strong></div>
                  <div className="flex justify-between"><span>Recipient</span><strong>{holder}</strong></div>
                  <div className="flex justify-between"><span>Gets</span><strong>{quote.targetAmount} {targetCurrency}</strong></div>
                  <div className="flex justify-between"><span>Arrives by</span><strong>{quote.formattedEstimatedDelivery || "—"}</strong></div>
                </div>
                <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Reference" className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm" />
                <button onClick={confirmTransfer} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-red py-2.5 text-sm font-bold text-white disabled:opacity-50">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />} Confirm & Fund
                </button>
              </>
            )}

            {step === 4 && transfer && (
              <div className="py-6 text-center">
                <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-green-600" />
                <h4 className="font-serif text-xl font-bold text-navy">Transfer Initiated</h4>
                <p className="mt-1 text-sm text-navy/60">ID: {transfer.id}</p>
                <p className="text-xs text-navy/50">Status: {transfer.status}</p>
                <button onClick={close} className="mt-5 rounded-md bg-navy px-6 py-2 text-sm font-bold text-white">Done</button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
