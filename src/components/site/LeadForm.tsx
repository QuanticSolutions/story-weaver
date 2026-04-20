import { useState } from "react";
import { Lock, CheckCircle2 } from "lucide-react";

export function LeadForm({
  variant = "light",
  title = "Get a Free Consultation",
  cta = "Request Free Consultation",
}: {
  variant?: "light" | "dark";
  title?: string;
  cta?: string;
}) {
  const [sent, setSent] = useState(false);

  const inputClass =
    variant === "light"
      ? "w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/40 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
      : "w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/40";

  const containerClass =
    variant === "light"
      ? "glass-white rounded-2xl p-6 sm:p-8"
      : "glass-light rounded-2xl p-6 sm:p-8";

  const titleClass =
    variant === "light"
      ? "font-serif text-2xl font-bold text-navy"
      : "font-serif text-2xl font-bold text-white";

  const subtleClass = variant === "light" ? "text-navy/60" : "text-white/70";

  if (sent) {
    return (
      <div className={containerClass}>
        <div className="flex flex-col items-center py-8 text-center">
          <CheckCircle2 className="size-12 text-brand-red" />
          <h3 className={`mt-3 ${titleClass}`}>Thank You!</h3>
          <p className={`mt-2 text-sm ${subtleClass}`}>
            A publishing consultant will reach out within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <h3 className={titleClass}>{title}</h3>
      <p className={`mt-1 text-sm ${subtleClass}`}>
        Tell us about your book — we'll handle the rest.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="mt-5 space-y-3"
      >
        <input required placeholder="Full Name" className={inputClass} />
        <input required type="email" placeholder="Email Address" className={inputClass} />
        <input required placeholder="Phone Number" className={inputClass} />
        <label className={`flex items-start gap-2 text-xs ${subtleClass}`}>
          <input type="checkbox" className="mt-0.5 accent-brand-red" />
          <span>I agree to receive updates via SMS/WhatsApp</span>
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-brand-red py-3 text-sm font-semibold text-white shadow-lg shadow-brand-red/30 transition hover:-translate-y-0.5 hover:bg-brand-red-dark"
        >
          {cta}
        </button>
        <p className={`flex items-center justify-center gap-1.5 text-xs ${subtleClass}`}>
          <Lock className="size-3" /> 100% Confidential. No spam, ever.
        </p>
      </form>
    </div>
  );
}
