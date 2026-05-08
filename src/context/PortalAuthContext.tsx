import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type PortalAuthValue = {
  isLoggedIn: boolean;
  loading: boolean;
  userId: string | null;
  projectId: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const PortalAuthContext = createContext<PortalAuthValue | undefined>(undefined);

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  const hydrate = async (uid: string | null) => {
    if (!uid) { setProjectId(null); setIsLoggedIn(false); return; }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    const isClient = (roles || []).some((r: any) => r.role === "client");
    if (!isClient) { setIsLoggedIn(false); return; }
    const { data: profile } = await supabase.from("profiles").select("project_id").eq("id", uid).maybeSingle();
    setProjectId(profile?.project_id || null);
    setIsLoggedIn(true);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      const uid = session?.user?.id || null;
      setUserId(uid);
      setTimeout(() => { void hydrate(uid); }, 0);
    });
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id || null;
      setUserId(uid);
      hydrate(uid).finally(() => setLoading(false));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return false;
    await hydrate(data.user.id);
    return true;
  };
  const logout = async () => { await supabase.auth.signOut(); setIsLoggedIn(false); setProjectId(null); };

  return <PortalAuthContext.Provider value={{ isLoggedIn, loading, userId, projectId, login, logout }}>{children}</PortalAuthContext.Provider>;
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) throw new Error("usePortalAuth must be used within PortalAuthProvider");
  return ctx;
}
