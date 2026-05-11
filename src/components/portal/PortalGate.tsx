import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { PortalDataProvider } from "@/context/PortalDataContext";

export function PortalGate({ children }: { children: ReactNode }) {
  const { isLoggedIn } = usePortalAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate({ to: "/portal/login" });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-offwhite">
        <div className="text-sm text-navy/60">Redirecting…</div>
      </div>
    );
  }

  return (
    <PortalDataProvider>
      <PortalLayout>{children}</PortalLayout>
    </PortalDataProvider>
  );
}
