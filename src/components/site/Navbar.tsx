import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();

  // Smoothly interpolate from translucent navy → opaque navy as user scrolls 0 → 60px
  const bg = useTransform(
    scrollY,
    [0, 60],
    ["rgba(11, 31, 75, 0.75)", "rgba(11, 31, 75, 1)"]
  );
  const blur = useTransform(scrollY, [0, 60], ["blur(20px)", "blur(28px)"]);
  const shadow = useTransform(
    scrollY,
    [0, 60],
    ["0 1px 0 rgba(255,255,255,0.06)", "0 10px 30px rgba(0,0,0,0.25)"]
  );

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <motion.header
      style={{ backgroundColor: bg, backdropFilter: blur, WebkitBackdropFilter: blur, boxShadow: shadow }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08]"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-md bg-brand-red text-white shadow-lg shadow-brand-red/30">
            <BookOpen className="size-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-white">
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
                  className="group relative inline-block py-1 text-sm font-medium text-white/85 transition-colors hover:text-white"
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-0.5 w-full origin-left bg-brand-red transition-transform duration-300 ease-out ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <Link
            to="/get-published"
            className="btn-uppercase glare glare-fast inline-flex items-center rounded-full bg-brand-red px-5 py-2.5 text-xs text-white shadow-lg shadow-brand-red/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_0_3px_rgba(139,26,43,0.35)]"
          >
            Start Your Book
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="text-white lg:hidden"
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
                  className="btn-uppercase block rounded-full bg-brand-red px-5 py-3 text-center text-xs text-white"
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
