import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { CRMUser, CRMRole } from "@/data/crmData";

interface CRMAuthValue {
  crmUser: CRMUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<CRMUser | null>;
  logout: () => Promise<void>;
}

const CRMAuthContext = createContext<CRMAuthValue | undefined>(undefined);

async function loadStaffUser(userId: string): Promise<CRMUser | null> {
  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId),
  ]);
  if (!profile || !roles) return null;
  const staffRole = (roles as { role: CRMRole }[]).find((r) =>
    ["project_manager", "salesperson", "production"].includes(r.role),
  );
  if (!staffRole) return null;
  return {
    id: userId,
    name: profile.name,
    email: profile.email || "",
    password: "",
    role: staffRole.role,
    avatar: profile.avatar || "",
    phone: profile.phone || "",
    department: profile.department || "",
    joinedDate: profile.joined_date || "",
  };
}

export function CRMAuthProvider({ children }: { children: ReactNode }) {
  const [crmUser, setCrmUser] = useState<CRMUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!session?.user) { setCrmUser(null); return; }
      setTimeout(() => { void loadStaffUser(session.user.id).then(setCrmUser); }, 0);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        loadStaffUser(data.session.user.id).then(setCrmUser).finally(() => setLoading(false));
      } else setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return null;
    const u = await loadStaffUser(data.user.id);
    if (!u) { await supabase.auth.signOut(); return null; }
    setCrmUser(u);
    return u;
  };

  const logout = async () => { await supabase.auth.signOut(); setCrmUser(null); };

  return <CRMAuthContext.Provider value={{ crmUser, loading, login, logout }}>{children}</CRMAuthContext.Provider>;
}

export function useCRMAuth() {
  const ctx = useContext(CRMAuthContext);
  if (!ctx) throw new Error("useCRMAuth must be used within CRMAuthProvider");
  return ctx;
}
