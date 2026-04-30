import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type PortalAuthValue = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

const PortalAuthContext = createContext<PortalAuthValue | undefined>(undefined);

const STORAGE_KEY = "awh_portal_logged_in";

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setIsLoggedIn(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // ignore
    }
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <PortalAuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) throw new Error("usePortalAuth must be used within PortalAuthProvider");
  return ctx;
}
