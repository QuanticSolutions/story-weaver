// @ts-nocheck
// Wise Business API proxy — keeps WISE_API_TOKEN server-side.
// Invoke from client with: supabase.functions.invoke('wise-api', { body: { action, payload } })

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const TOKEN = Deno.env.get("WISE_API_TOKEN");
    const PROFILE_ID = Deno.env.get("WISE_PROFILE_ID");
    const ENV = (Deno.env.get("WISE_ENV") || "sandbox").toLowerCase();
    if (!TOKEN || !PROFILE_ID) return json({ error: "Wise credentials not configured" }, 500);

    const BASE = ENV === "sandbox" ? "https://api.sandbox.transferwise.tech" : "https://api.transferwise.com";

    const { action, payload = {} } = await req.json();

    const wiseFetch = async (path: string, init: RequestInit = {}) => {
      const res = await fetch(`${BASE}${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
          ...(init.headers || {}),
        },
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) return json({ error: data?.errors || data?.message || res.statusText, status: res.status }, res.status);
      return json(data);
    };

    switch (action) {
      case "get_profile":
        return wiseFetch(`/v1/profiles`);
      case "get_balance":
        return wiseFetch(`/v4/profiles/${PROFILE_ID}/balances?types=STANDARD`);
      case "create_quote":
        return wiseFetch(`/v3/profiles/${PROFILE_ID}/quotes`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      case "create_recipient":
        return wiseFetch(`/v1/accounts`, { method: "POST", body: JSON.stringify(payload) });
      case "create_transfer":
        return wiseFetch(`/v1/transfers`, { method: "POST", body: JSON.stringify(payload) });
      case "fund_transfer": {
        const { transferId, type = "BALANCE" } = payload;
        return wiseFetch(`/v3/profiles/${PROFILE_ID}/transfers/${transferId}/payments`, {
          method: "POST",
          body: JSON.stringify({ type }),
        });
      }
      case "get_transfer":
        return wiseFetch(`/v1/transfers/${payload.transferId}`);
      case "list_transfers":
        return wiseFetch(`/v1/transfers?profile=${PROFILE_ID}`);
      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
