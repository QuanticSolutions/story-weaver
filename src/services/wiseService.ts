import { supabase } from "@/integrations/supabase/client";

async function call<T = any>(action: string, payload: Record<string, any> = {}): Promise<T> {
  const { data, error } = await supabase.functions.invoke("wise-api", { body: { action, payload } });
  if (error) throw new Error(error.message || "Wise request failed");
  if (data?.error) throw new Error(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
  return data as T;
}

export interface WiseQuoteInput {
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmount?: number;
  targetAmount?: number;
}

export const wiseService = {
  getProfile: () => call("get_profile"),
  getBalance: () => call("get_balance"),
  createQuote: (input: WiseQuoteInput) =>
    call("create_quote", {
      sourceCurrency: input.sourceCurrency,
      targetCurrency: input.targetCurrency,
      sourceAmount: input.sourceAmount,
      targetAmount: input.targetAmount,
      payOut: "BALANCE",
    }),
  createRecipient: (accountDetails: Record<string, any>) => call("create_recipient", accountDetails),
  createTransfer: (quoteId: string, recipientId: string, reference: string, customerTransactionId?: string) =>
    call("create_transfer", {
      targetAccount: recipientId,
      quoteUuid: quoteId,
      customerTransactionId: customerTransactionId || crypto.randomUUID(),
      details: { reference, transferPurpose: "verification.transfers.purpose.other", sourceOfFunds: "verification.source.of.funds.other" },
    }),
  fundTransfer: (transferId: string) => call("fund_transfer", { transferId, type: "BALANCE" }),
  getTransfer: (transferId: string) => call("get_transfer", { transferId }),
  listTransfers: () => call("list_transfers"),

  // DB helpers
  async saveTransfer(row: {
    transfer_id: string; quote_id: string; recipient_id: string;
    source_currency: string; target_currency: string;
    source_amount: number; target_amount: number;
    status: string; reference: string;
  }) {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw new Error("Sign in required");
    const { data, error } = await supabase.from("wise_transfers").insert({ ...row, user_id: u.user.id }).select().single();
    if (error) throw error;
    return data;
  },
  async listSavedTransfers() {
    const { data, error } = await supabase.from("wise_transfers").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
};
