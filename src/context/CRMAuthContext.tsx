import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { crmUsers, type CRMUser } from "@/data/crmData";

interface CRMAuthValue {
  crmUser: CRMUser | null;
  login: (email: string, password: string) => CRMUser | null;
  logout: () => void;
}

const CRMAuthContext = createContext<CRMAuthValue | undefined>(undefined);
const STORAGE_KEY = "awh_crm_user_id";

export function CRMAuthProvider({ children }: { children: ReactNode }) {
  const [crmUser, setCrmUser] = useState<CRMUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const id = window.localStorage.getItem(STORAGE_KEY);
      if (id) {
        const u = crmUsers.find((u) => u.id === id);
        if (u) setCrmUser(u);
      }
    } catch {
      // ignore
    }
  }, []);

  const login = (email: string, password: string) => {
    const u = crmUsers.find(
      (x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password,
    );
    if (u) {
      setCrmUser(u);
      try {
        window.localStorage.setItem(STORAGE_KEY, u.id);
      } catch {}
      return u;
    }
    return null;
  };

  const logout = () => {
    setCrmUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <CRMAuthContext.Provider value={{ crmUser, login, logout }}>
      {children}
    </CRMAuthContext.Provider>
  );
}

export function useCRMAuth() {
  const ctx = useContext(CRMAuthContext);
  if (!ctx) throw new Error("useCRMAuth must be used within CRMAuthProvider");
  return ctx;
}
