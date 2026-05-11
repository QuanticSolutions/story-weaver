import { type ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  FolderOpen,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Hash,
  Menu,
  X,
} from "lucide-react";
import { useClient } from "@/context/PortalDataContext";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/portal/project", label: "My Project", icon: BookOpen },
  { to: "/portal/billing", label: "Billing", icon: CreditCard },
  { to: "/portal/files", label: "Files & Documents", icon: FolderOpen },
  { to: "/portal/messages", label: "Messages", icon: MessageSquare, badgeKey: "messages" as const },
  { to: "/portal/notifications", label: "Notifications", icon: Bell, badgeKey: "notifications" as const },
  { to: "/portal/profile", label: "My Profile", icon: User },
];

const titleMap: Record<string, string> = {
  "/portal/dashboard": "Dashboard",
  "/portal/project": "My Project",
  "/portal/billing": "Billing & Invoices",
  "/portal/files": "Files & Documents",
  "/portal/messages": "Messages",
  "/portal/notifications": "Notifications",
  "/portal/profile": "My Profile",
};

export function PortalLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = usePortalAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const unreadNotifications = sampleClient.notifications.filter((n) => !n.read).length;
  const unreadMessages = 1;

  const getBadge = (key?: "messages" | "notifications") => {
    if (key === "messages") return unreadMessages;
    if (key === "notifications") return unreadNotifications;
    return 0;
  };

  const currentTitle = titleMap[location.pathname] ?? "Portal";

  const handleLogout = () => {
    logout();
    navigate({ to: "/portal/login" });
  };

  const SidebarInner = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="px-6 pt-7 pb-5">
        <div className="font-serif text-3xl font-bold leading-none text-white">AWH</div>
        <div className="mt-1 font-accent text-[10px] uppercase tracking-[0.2em] text-white/40">
          Client Portal
        </div>
      </div>

      {/* Project ID pill */}
      <div className="px-6 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-red/60 px-3 py-1.5 text-[11px] font-semibold tracking-wider text-brand-red">
          <Hash className="h-3 w-3" />
          {sampleClient.projectId}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            const badge = getBadge(item.badgeKey);
            return (
              <li key={item.to} className="relative">
                {active && (
                  <motion.span
                    layoutId="portalActive"
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
                      : "text-white/50 hover:bg-white/5 hover:text-white/80",
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

      {/* Bottom user */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy font-serif text-sm font-bold text-white">
            {sampleClient.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-white">{sampleClient.name}</div>
            <div className="truncate text-[11px] text-white/40">{sampleClient.email}</div>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="rounded-md p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] bg-[#060F26] lg:block">
        {SidebarInner}
      </aside>

      {/* Mobile sidebar overlay */}
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
              {SidebarInner}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
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
            <h1 className="font-serif text-2xl font-bold text-navy">{currentTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/portal/notifications"
              className="relative rounded-full p-2 text-navy/70 transition-colors hover:bg-navy/5 hover:text-navy"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[9px] font-bold text-white">
                  {unreadNotifications}
                </span>
              )}
            </Link>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-navy font-serif text-sm font-bold text-white"
              >
                {sampleClient.avatar}
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 top-12 w-44 overflow-hidden rounded-lg border border-navy/10 bg-white shadow-lg"
                  >
                    <Link
                      to="/portal/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-navy hover:bg-navy/5"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full px-4 py-2.5 text-left text-sm text-brand-red hover:bg-brand-red/5"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
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
