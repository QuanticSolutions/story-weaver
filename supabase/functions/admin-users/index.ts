// @ts-nocheck
// Admin user management — verifies caller is admin, then uses service role to manage auth.users.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const auth = req.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    // Verify caller is admin
    const userClient = createClient(SUPABASE_URL, ANON, { global: { headers: { Authorization: auth } } });
    const { data: u, error: ue } = await userClient.auth.getUser();
    if (ue || !u.user) return json({ error: "Invalid session" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", u.user.id);
    const isAdmin = (roles || []).some((r: any) => r.role === "admin");
    if (!isAdmin) return json({ error: "Admin only" }, 403);

    const { action, payload = {} } = await req.json();

    switch (action) {
      case "list_users": {
        const { data: profiles } = await admin.from("profiles").select("*").order("created_at", { ascending: false });
        const { data: allRoles } = await admin.from("user_roles").select("*");
        const merged = (profiles || []).map((p: any) => ({
          ...p,
          roles: (allRoles || []).filter((r: any) => r.user_id === p.id).map((r: any) => r.role),
        }));
        return json({ users: merged });
      }
      case "create_user": {
        const { email, password, name, role, phone = "", department = "", project_id = null } = payload;
        if (!email || !password || !role) return json({ error: "email, password, role required" }, 400);
        const avatar = (name || email).substring(0, 2).toUpperCase();
        const { data: created, error: cErr } = await admin.auth.admin.createUser({
          email, password, email_confirm: true,
          user_metadata: { name, role, phone, department, avatar, project_id, joined_date: new Date().toISOString().split("T")[0] },
        });
        if (cErr) return json({ error: cErr.message }, 400);
        return json({ user: created.user });
      }
      case "delete_user": {
        const { user_id } = payload;
        if (!user_id) return json({ error: "user_id required" }, 400);
        const { error: dErr } = await admin.auth.admin.deleteUser(user_id);
        if (dErr) return json({ error: dErr.message }, 400);
        return json({ ok: true });
      }
      case "set_role": {
        const { user_id, role } = payload;
        if (!user_id || !role) return json({ error: "user_id, role required" }, 400);
        await admin.from("user_roles").delete().eq("user_id", user_id);
        const { error: rErr } = await admin.from("user_roles").insert({ user_id, role });
        if (rErr) return json({ error: rErr.message }, 400);
        return json({ ok: true });
      }
      case "reset_password": {
        const { user_id, password } = payload;
        if (!user_id || !password) return json({ error: "user_id, password required" }, 400);
        const { error } = await admin.auth.admin.updateUserById(user_id, { password });
        if (error) return json({ error: error.message }, 400);
        return json({ ok: true });
      }
      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
