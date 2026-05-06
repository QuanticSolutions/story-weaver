import { type ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Kanban,
  CheckSquare,
  MessageSquare,
  FileText,
  Users2,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Volume2,
} from "lucide-react";
import { useCRMAuth } from "@/context/CRMAuthContext";
import { useCRM } from "@/context/CRMContext";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; badge?: "chat" | "notif" };

const navByRole: Record<string, NavItem[]> = {
  project_manager: [
    { to: "/crm/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/crm/leads", label: "Leads", icon: Users },
    { to: "/crm/projects", label: "Projects", icon: Kanban },
    { to: "/crm/tasks", label: "Tasks", icon: CheckSquare },
    { to: "/crm/chat", label: "Live Chat", icon: MessageSquare, badge: "chat" },
    { to: "/crm/contracts", label: "Contracts & NDAs", icon: FileText },
    { to: "/crm/team", label: "Team", icon: Users2 },
    { to: "/crm/notifications", label: "Notifications", icon: Bell, badge: "notif" },
    { to: "/crm/settings", label: "Settings", icon: Settings },
  ],
  salesperson: [
    { to: "/crm/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/crm/leads", label: "Leads", icon: Users },
    { to: "/crm/chat", label: "Live Chat", icon: MessageSquare, badge: "chat" },
    { to: "/crm/notifications", label: "Notifications", icon: Bell, badge: "notif" },
  ],
  production: [
    { to: "/crm/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/crm/tasks", label: "My Tasks", icon: CheckSquare },
    { to: "/crm/chat", label: "Messages", icon: MessageSquare, badge: "chat" },
    { to: "/crm/notifications", label: "Notifications", icon: Bell, badge: "notif" },
  ],
};

const roleLabel: Record<string, string> = {
  project_manager: "Project Manager",
  salesperson: "Sales",
  production: "Production",
};

const roleBadgeColor: Record<string, string> = {
  project_manager: "bg-brand-red/15 text-brand-red border-brand-red/30",
  salesperson: "bg-navy/15 text-navy border-navy/30",
  production: "bg-amber-100 text-amber-800 border-amber-300",
};

function pageTitleFor(path: string) {
  if (path.startsWith("/crm/dashboard")) return "Dashboard";
  if (path.startsWith("/crm/leads")) return "Leads";
  if (path.startsWith("/crm/projects")) return "Projects";
  if (path.startsWith("/crm/tasks")) return "Tasks";
  if (path.startsWith("/crm/chat")) return "Live Chat";
  if (path.startsWith("/crm/contracts")) return "Contracts & NDAs";
  if (path.startsWith("/crm/team")) return "Team";
  if (path.startsWith("/crm/notifications")) return "Notifications";
  if (path.startsWith("/crm/settings")) return "Settings";
  return "CRM";
}

export function CRMLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { crmUser, logout } = useCRMAuth();
  const { unreadChatCount, unreadNotificationCount, chats } = useCRM();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!crmUser) return null;

  const items = navByRole[crmUser.role] || [];
  const unreadNotif = unreadNotificationCount(crmUser.role);
  const hasActiveVisitor = chats.some((c) => c.status === "Active" || c.status === "Waiting");

  const handleLogout = () => {
    logout();
    navigate({ to: "/crm/login" });
  };

  const Sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-6 pt-7 pb-5">
        <div className="font-serif text-2xl font-bold leading-none text-white">AWH CRM</div>
        <div className="mt-1 font-accent text-[10px] uppercase tracking-[0.2em] text-white/40">
          Internal System
        </div>
      </div>

      <div className="mx-3 mb-3 flex items-center gap-3 rounded-lg bg-white/5 p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red font-serif text-sm font-bold text-white">
          {crmUser.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-white">{crmUser.name}</div>
          <span
            className={cn(
              "mt-1 inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
              roleBadgeColor[crmUser.role],
            )}
          >
            {roleLabel[crmUser.role]}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
            const badge =
              item.badge === "chat" ? unreadChatCount : item.badge === "notif" ? unreadNotif : 0;
            return (
              <li key={item.to} className="relative">
                {active && (
                  <motion.span
                    layoutId="crmActive"
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r bg-brand-red"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <Link
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-[rgba(139,26,43,0.12)] text-white"
                      : "text-white/55 hover:bg-white/5 hover:text-white/90",
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {badge > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1.5 text-[10px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-offwhite">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] bg-[#060F26] lg:block">
        {Sidebar}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] bg-[#060F26] lg:hidden"
            >
              {Sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <header className="fixed inset-x-0 top-0 z-30 border-b border-navy/[0.08] bg-white lg:left-[260px]">
        <div className="flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-2 text-navy hover:bg-navy/5 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="font-serif text-2xl font-bold text-navy">{pageTitleFor(location.pathname)}</h1>
          </div>
          <div className="flex items-center gap-3">
            {hasActiveVisitor && (
              <Link
                to="/crm/chat"
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-red/40 bg-brand-red/10 px-2.5 py-1 text-[11px] font-semibold text-brand-red"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-red" />
                </span>
                <Volume2 className="h-3 w-3" />
                Active visitor
              </Link>
            )}
            <Link
              to="/crm/notifications"
              className="relative rounded-full p-2 text-navy/70 hover:bg-navy/5 hover:text-navy"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadNotif > 0 && (
                <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[9px] font-bold text-white">
                  {unreadNotif}
                </span>
              )}
            </Link>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy font-serif text-sm font-bold text-white">
              {crmUser.avatar}
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16 lg:pl-[260px]">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="px-4 py-6 lg:px-8 lg:py-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
