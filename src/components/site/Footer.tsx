import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";

export function Footer() {
  const services = [
    "Ghostwriting",
    "Editing & Proofreading",
    "Cover Design",
    "Book Formatting",
    "Illustrations",
    "Publishing",
    "Author Website",
    "Marketing",
  ];
  const company = [
    { label: "About Us", to: "/" },
    { label: "Our Process", to: "/process" },
    { label: "Portfolio", to: "/portfolio" },
    { label: "Get Published", to: "/get-published" },
    { label: "Contact Us", to: "/contact" },
    { label: "Start Your Book", to: "/get-published" },
  ] as const;

  return (
    <footer className="relative bg-[#060F26] text-white/80">
      <div className="mx-auto h-px max-w-7xl bg-brand-red/70" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-md bg-brand-red text-white">
              <BookOpen className="size-5" />
            </span>
            <span className="font-serif text-lg font-bold text-white">
              American Writers Hub
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/65">
            Turning stories into published realities, one author at a time.
          </p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Instagram, Youtube, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-brand-red hover:bg-brand-red hover:text-white"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-accent text-xs font-semibold uppercase tracking-widest text-white">
            Services
          </h4>
          <ul className="mt-5 space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s}>
                <Link to="/services" className="hover:text-brand-red">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-accent text-xs font-semibold uppercase tracking-widest text-white">
            Company
          </h4>
          <ul className="mt-5 space-y-2.5 text-sm">
            {company.map((c) => (
              <li key={c.label}>
                <Link to={c.to} className="hover:text-brand-red">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-accent text-xs font-semibold uppercase tracking-widest text-white">
            Contact
          </h4>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 text-brand-red" />
              <span>United States</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 text-brand-red" />
              <span>info@americanwritershub.com</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 text-brand-red" />
              <span>+1 (800) 000-0000</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MessageCircle className="size-4 text-brand-red" />
              <span>Live Chat Available</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-white/55 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} American Writers Hub. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
