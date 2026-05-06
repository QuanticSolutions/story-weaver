import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCRMAuth } from "@/context/CRMAuthContext";
import { CRMLayout } from "./CRMLayout";

export function CRMGate({ children, allowedRoles }: { children: ReactNode; allowedRoles?: string[] }) {
  const { crmUser } = useCRMAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!crmUser) {
      navigate({ to: "/crm/login" });
    } else if (allowedRoles && !allowedRoles.includes(crmUser.role)) {
      navigate({ to: "/crm/dashboard" });
    }
  }, [crmUser, navigate, allowedRoles]);

  if (!crmUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-offwhite">
        <div className="text-sm text-navy/60">Redirecting…</div>
      </div>
    );
  }
  if (allowedRoles && !allowedRoles.includes(crmUser.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-offwhite">
        <div className="text-sm text-navy/60">Redirecting…</div>
      </div>
    );
  }

  return <CRMLayout>{children}</CRMLayout>;
}
