import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, UserPlus, Trash2, KeyRound, Loader2 } from "lucide-react";
import { CRMGate } from "@/components/crm/CRMGate";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/crm/users")({
  head: () => ({ meta: [{ title: "User Management — AWH CRM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <CRMGate allowedRoles={["admin"]}>
      <UserManagementPage />
    </CRMGate>
  ),
});

type UserRow = {
  id: string;
  name: string;
  email: string | null;
  avatar: string;
  phone: string;
  department: string;
  project_id: string | null;
  roles: string[];
};

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "project_manager", label: "Project Manager" },
  { value: "salesperson", label: "Salesperson" },
  { value: "production", label: "Production" },
  { value: "client", label: "Client" },
];

const ROLE_BADGE: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  project_manager: "bg-brand-red/15 text-brand-red",
  salesperson: "bg-navy/15 text-navy",
  production: "bg-amber-100 text-amber-800",
  client: "bg-green-100 text-green-700",
};

async function adminCall(action: string, payload: Record<string, any> = {}) {
  const { data, error } = await supabase.functions.invoke("admin-users", { body: { action, payload } });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
  return data;
}

function UserManagementPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { users } = await adminCall("list_users");
      setUsers(users);
    } catch (e: any) {
      toast.error(e.message);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This permanently removes their account.`)) return;
    try { await adminCall("delete_user", { user_id: id }); toast.success("User deleted"); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  const changeRole = async (id: string, role: string) => {
    try { await adminCall("set_role", { user_id: id, role }); toast.success("Role updated"); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  const resetPwd = async (id: string) => {
    const pwd = prompt("Enter new password (min 6 chars):");
    if (!pwd || pwd.length < 6) return;
    try { await adminCall("reset_password", { user_id: id, password: pwd }); toast.success("Password reset"); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-4">
      <div className="card-portal flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-purple-600" />
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy">User Management</h2>
            <p className="text-xs text-navy/60">Create staff, admins, and client portal accounts.</p>
          </div>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-md bg-brand-red px-4 py-2 text-sm font-bold uppercase text-white">
          <UserPlus className="h-4 w-4" /> New User
        </button>
      </div>

      <div className="card-portal !p-0 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-navy/60"><Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />Loading users…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-navy/10 bg-offwhite/60 text-left text-[10px] uppercase tracking-wider text-navy/60">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const primary = u.roles[0] || "client";
                  return (
                    <tr key={u.id} className="border-b border-navy/5 hover:bg-offwhite/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">{u.avatar || "?"}</div>
                          <span className="font-medium text-navy">{u.name}</span>
                        </div>
                      </td>
                      <td className="text-navy/70">{u.email}</td>
                      <td className="text-navy/60">{u.department || "—"}</td>
                      <td>
                        <select
                          value={primary}
                          onChange={(e) => changeRole(u.id, e.target.value)}
                          className={cn("rounded-md border-0 px-2 py-1 text-[11px] font-bold uppercase", ROLE_BADGE[primary] || "bg-navy/10")}
                        >
                          {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button onClick={() => resetPwd(u.id)} title="Reset password" className="rounded p-1.5 text-navy/60 hover:bg-navy/5"><KeyRound className="h-4 w-4" /></button>
                          <button onClick={() => remove(u.id, u.name)} title="Delete" className="rounded p-1.5 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); load(); }} />}
    </div>
  );
}

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "project_manager",
    phone: "", department: "", project_id: "",
  });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await adminCall("create_user", {
        ...form,
        project_id: form.role === "client" ? form.project_id || null : null,
      });
      toast.success(`${form.name} created`);
      onCreated();
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="font-serif text-xl font-bold text-navy">Create New User</h3>

        <label className="block text-xs font-medium">Role
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-1 w-full rounded-md border border-navy/15 px-3 py-2 text-sm">
            {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="rounded-md border border-navy/15 px-3 py-2 text-sm" />
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="rounded-md border border-navy/15 px-3 py-2 text-sm" />
        </div>

        <input required type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Temporary password (min 6)" className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm" />

        <div className="grid grid-cols-2 gap-3">
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="rounded-md border border-navy/15 px-3 py-2 text-sm" />
          <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Department" className="rounded-md border border-navy/15 px-3 py-2 text-sm" />
        </div>

        {form.role === "client" && (
          <input value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })} placeholder="Project ID (link client to project)" className="w-full rounded-md border border-navy/15 px-3 py-2 text-sm" />
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-md border border-navy/15 px-4 py-2 text-sm">Cancel</button>
          <button disabled={busy} type="submit" className="flex items-center gap-2 rounded-md bg-brand-red px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Create
          </button>
        </div>
      </form>
    </div>
  );
}
