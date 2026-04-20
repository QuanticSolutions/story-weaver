import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/process", label: "Our Process" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/get-published", label: "Get Published" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const isDark = scrolled;

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: isDark ? "rgba(11,31,75,0.97)" : "rgba(255,255,255,0)",
        backdropFilter: isDark ? "blur(14px)" : "blur(0px)",
        boxShadow: isDark ? "0 8px 30px rgba(0,0,0,0.18)" : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.3 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span
            className={`flex size-9 items-center justify-center rounded-md ${
              isDark ? "bg-brand-red text-white" : "bg-navy text-white"
            }`}
          >
            <BookOpen className="size-5" />
          </span>
          <span
            className={`font-serif text-xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-navy"
            }`}
          >
            American Writers Hub
          </span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`relative text-sm font-medium transition-colors ${
                    isDark ? "text-white/85 hover:text-white" : "text-navy/80 hover:text-navy"
                  }`}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-brand-red"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <Link
            to="/get-published"
            className="inline-flex items-center rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-red/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-red/40"
          >
            Start Your Book
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className={`lg:hidden ${isDark ? "text-white" : "text-navy"}`}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-navy lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="block rounded-md px-3 py-3 text-base text-white/90 hover:bg-white/10"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  to="/get-published"
                  className="block rounded-full bg-brand-red px-5 py-3 text-center text-sm font-semibold text-white"
                >
                  Start Your Book
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
