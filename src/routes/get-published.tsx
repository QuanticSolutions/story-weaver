import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Tablet,
  Headphones,
  BookMarked,
  ChevronDown,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { FloatingOrbs } from "@/components/site/FloatingOrbs";
import { LeadForm } from "@/components/site/LeadForm";
import { PlatformMarquee } from "@/components/site/PlatformMarquee";
import { MidLeadCTA, FinalCTA } from "@/components/site/CTASections";
import { PublishStickyScroll } from "@/components/site/PublishStickyScroll";
import { GetPublishedWizard } from "@/components/site/GetPublishedWizard";

export const Route = createFileRoute("/get-published")({
  head: () => ({
    meta: [
      { title: "Get Published — American Writers Hub" },
      { name: "description", content: "Publish your book on 200+ platforms worldwide. Free consultation, NDA protection, and a dedicated project manager." },
      { property: "og:title", content: "Get Published — American Writers Hub" },
      { property: "og:description", content: "From idea to global launch. Confidential, full-service publishing." },
    ],
  }),
  component: GetPublishedPage,
});

const formats: { icon: LucideIcon; title: string; bullets: string[] }[] = [
  { icon: Tablet, title: "eBook", bullets: ["EPUB & MOBI files", "Optimized for Kindle, Apple, Kobo", "Reflowable & accessible"] },
  { icon: BookOpen, title: "Paperback", bullets: ["Print-ready PDF with bleed", "Industry-standard trim sizes", "POD distribution included"] },
  { icon: BookMarked, title: "Hardcover", bullets: ["Premium binding spec", "Dust jacket design available", "Perfect for collectors & gifts"] },
  { icon: Headphones, title: "Audiobook", bullets: ["Pro narration setup", "Audible & Apple Books ready", "Multiple voice options"] },
];

const stepsTimeline = [
  { title: "Contact Us", desc: "Reach out via the form or book a free consultation. Tell us about your project." },
  { title: "Free Consultation", desc: "Speak with a real publishing consultant. No bots — only senior advisors." },
  { title: "NDA Signed", desc: "We sign a mutual NDA to keep your manuscript and ideas fully confidential." },
  { title: "Project Begins", desc: "A dedicated project manager assembles your team and schedule." },
  { title: "Review & Approve", desc: "You review every milestone — manuscript, cover, formatting, marketing plan." },
  { title: "Global Launch", desc: "Your book goes live on 200+ platforms with marketing support." },
];

const genres = [
  "Fiction", "Non-Fiction", "Biography", "Self-Help", "Children's Books", "Business",
  "Romance", "Thriller", "Fantasy", "Memoir", "Health & Wellness", "Poetry",
];

const faqs = [
  { q: "Do I need a complete manuscript to get started?", a: "Not at all. Whether you have a finished manuscript, a partial draft, or just an idea, our ghostwriters and editors can take you from any starting point to publication." },
  { q: "How long does the publishing process take?", a: "Timelines vary by service scope. A typical project from manuscript to global launch takes 8–16 weeks. Ghostwriting from scratch can extend this to 4–6 months." },
  { q: "Will I retain full rights to my book?", a: "Absolutely. You retain 100% of the rights, royalties, and ownership of your work. We are a service provider, not a traditional publisher." },
  { q: "Do you offer ghostwriting services?", a: "Yes. Our team of professional ghostwriters specializes in fiction and non-fiction across every major genre, with multiple revision rounds included." },
  { q: "Which platforms will my book be listed on?", a: "200+ platforms including Amazon KDP, Apple Books, Barnes & Noble, Kobo, Google Play Books, IngramSpark, Draft2Digital, Audible, Blurb, Gardners, and Tolino." },
  { q: "What formats will my book be available in?", a: "eBook (EPUB/MOBI), Paperback, Hardcover, and Audiobook — all production-ready and meeting platform specifications." },
  { q: "Is there a free consultation?", a: "Yes. Every author begins with a complimentary, no-obligation consultation with a senior publishing advisor." },
  { q: "How does pricing work?", a: "Pricing is custom to your project's scope. Your consultant will provide a clear, itemized proposal after the free consultation." },
];

function GetPublishedPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* Hero */}
      <section className="navy-hero-bg grain-overlay relative overflow-hidden pt-32 pb-20">
        <FloatingOrbs />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-accent text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">
              Get Published
            </span>
            <h1 className="mt-3 font-serif text-5xl font-bold text-balance text-white md:text-6xl">
              Publish Your Book With Confidence.
            </h1>
            <p className="mt-5 max-w-xl text-white/75">
              Reach readers in every corner of the world. Distribute on 200+ platforms,
              backed by a confidential, full-service team that handles every detail.
            </p>
          </motion.div>
          <LeadForm />
        </div>
      </section>

      <GetPublishedWizard />

      {/* Why Publish With Us */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 md:grid-cols-3 lg:px-8">
          {[
            { stat: "200+", label: "Global Platforms" },
            { stat: "1,200+", label: "Books Published" },
            { stat: "Full-Service", label: "Support End-to-End" },
          ].map((c) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border-t-[3px] border-brand-red bg-offwhite p-8 text-center"
            >
              <p className="font-serif text-5xl font-bold text-navy">{c.stat}</p>
              <p className="mt-2 font-accent text-xs font-semibold uppercase tracking-widest text-navy/60">
                {c.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Formats */}
      <section className="bg-offwhite pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-4xl font-bold text-navy md:text-5xl">What We Publish</h2>
            <p className="mt-4 text-navy/65">Every format your readers expect — production-ready and platform-compliant.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {formats.map((f) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="rounded-2xl border-2 border-transparent bg-white p-6 shadow-sm hover:border-brand-red"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-navy text-white">
                  <f.icon className="size-6" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-bold text-navy">{f.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-navy/70">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-red" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms marquee */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <PlatformMarquee />
        </div>
      </section>

      {/* Step-by-step timeline */}
      <PublishStickyScroll />

      {/* Genres */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-navy md:text-5xl">Genres We Specialize In</h2>
          <p className="mt-4 text-navy/65">Whatever you're writing, we've published it before.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {genres.map((g) => (
              <span
                key={g}
                className="cursor-default rounded-full border-2 border-navy/20 px-5 py-2 text-sm font-medium text-navy transition hover:border-brand-red hover:bg-brand-red hover:text-white"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </section>

      <MidLeadCTA />

      {/* FAQ */}
      <section className="bg-offwhite py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-4xl font-bold text-navy md:text-5xl">Frequently Asked Questions</h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="overflow-hidden rounded-2xl border border-navy/10 bg-white">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-serif text-lg font-semibold text-navy">{f.q}</span>
                    <ChevronDown
                      className={`size-5 shrink-0 text-brand-red transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-navy/70">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
