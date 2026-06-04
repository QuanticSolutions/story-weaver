import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCRMAuth } from "@/context/CRMAuthContext";
import { CRMLayout } from "./CRMLayout";

export function CRMGate({ children, allowedRoles }: { children: ReactNode; allowedRoles?: string[] }) {
  const { crmUser } = useCRMAuth();
  const navigate = useNavigate();

  // Admin bypasses all role gates
  const hasAccess = crmUser && (crmUser.role === "admin" || !allowedRoles || allowedRoles.includes(crmUser.role));

  useEffect(() => {
    if (!crmUser) {
      navigate({ to: "/crm/login" });
    } else if (!hasAccess) {
      navigate({ to: "/crm/dashboard" });
    }
  }, [crmUser, navigate, hasAccess]);

  if (!crmUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-offwhite">
        <div className="text-sm text-navy/60">Redirecting…</div>
      </div>
    );
  }
  if (!hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-offwhite">
        <div className="text-sm text-navy/60">Redirecting…</div>
      </div>
    );
  }

  return <CRMLayout>{children}</CRMLayout>;
}
