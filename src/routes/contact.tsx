import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Users,
  CheckCircle2,
} from "lucide-react";
import { FloatingOrbs } from "@/components/site/FloatingOrbs";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — American Writers Hub" },
      { name: "description", content: "Talk to a real publishing consultant. No bots, no automated responses. Response within 24 hours." },
      { property: "og:title", content: "Contact — American Writers Hub" },
      { property: "og:description", content: "Let's talk about your book." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="navy-hero-bg grain-overlay relative overflow-hidden pt-32 pb-20">
        <FloatingOrbs />
        <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
          <span className="font-accent text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">
            Contact
          </span>
          <h1 className="mt-3 font-serif text-5xl font-bold text-balance text-white md:text-6xl">
            Let's Talk About Your Book.
          </h1>
          <p className="mt-5 text-white/75">
            No bots. No automated responses. A real publishing consultant will contact you within 24 hours.
          </p>
        </div>
      </section>

      <section className="bg-offwhite py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          {/* Left: details */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-navy">Get in Touch</h2>
            <p className="mt-3 text-navy/70">
              Whether you have a manuscript, an outline, or just an idea — we'd love to hear from you.
            </p>
            <ul className="mt-8 space-y-5">
              <li className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
                  <Mail className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-navy">Email</p>
                  <p className="text-sm text-navy/65">info@americanwritershub.com</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
                  <Phone className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-navy">Phone</p>
                  <p className="text-sm text-navy/65">+1 (800) 000-0000</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
                  <MapPin className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-navy">Office</p>
                  <p className="text-sm text-navy/65">1500 
                    N GRANT ST STE R
                    DENVER, CO, 80203, USA</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
                  <Clock className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-navy">Hours</p>
                  <p className="text-sm text-navy/65">Mon–Fri · 9 AM – 7 PM EST</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-white p-8 shadow-xl shadow-navy/10"
          >
            {sent ? (
              <div className="flex flex-col items-center py-12 text-center">
                <CheckCircle2 className="size-14 text-brand-red" />
                <h3 className="mt-4 font-serif text-2xl font-bold text-navy">Message Received</h3>
                <p className="mt-2 text-navy/65">A publishing consultant will reach out within 24 hours.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-4"
              >
                <h3 className="font-serif text-2xl font-bold text-navy">Send a Message</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required placeholder="Full Name" className="w-full rounded-lg border border-navy/15 px-4 py-3 text-sm focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20" />
                  <input required type="email" placeholder="Email" className="w-full rounded-lg border border-navy/15 px-4 py-3 text-sm focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20" />
                </div>
                <input required placeholder="Phone" className="w-full rounded-lg border border-navy/15 px-4 py-3 text-sm focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20" />
                <select required defaultValue="" className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20">
                  <option value="" disabled>Book Genre</option>
                  {["Fiction","Non-Fiction","Biography","Self-Help","Children's","Business","Romance","Thriller","Fantasy","Memoir","Other"].map(g => <option key={g}>{g}</option>)}
                </select>
                <textarea required rows={5} placeholder="Tell us about your book..." className="w-full rounded-lg border border-navy/15 px-4 py-3 text-sm focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20" />
                <label className="flex items-start gap-2 text-xs text-navy/60">
                  <input type="checkbox" className="mt-0.5 accent-brand-red" />
                  <span>I agree to receive updates via SMS/WhatsApp</span>
                </label>
                <button type="submit" className="w-full rounded-lg bg-brand-red py-3 text-sm font-semibold text-white shadow-lg shadow-brand-red/30 transition hover:-translate-y-0.5 hover:bg-brand-red-dark">
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Info cards */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-3 lg:px-8">
          {[
            { icon: Clock, title: "24-Hour Response", desc: "Every inquiry is answered by a senior consultant within one business day." },
            { icon: ShieldCheck, title: "NDA Protected", desc: "Mutual NDA signed before any manuscript or idea is shared." },
            { icon: Users, title: "Dedicated Consultant", desc: "One human point of contact through your entire publishing journey." },
          ].map((c) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-navy/10 bg-offwhite p-6"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-red text-white">
                <c.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-serif text-lg font-bold text-navy">{c.title}</h3>
              <p className="mt-2 text-sm text-navy/65">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Coverage map placeholder */}
      <section className="bg-offwhite pb-20">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="navy-hero-bg grain-overlay relative overflow-hidden rounded-3xl p-12 text-center">
            <FloatingOrbs />
            <div className="relative">
              <h3 className="font-serif text-3xl font-bold text-white">Serving Authors Across the United States</h3>
              <p className="mx-auto mt-3 max-w-xl text-white/75">
                Headquartered in the U.S., publishing books for authors in every state and on every continent.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
