import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FloatingOrbs } from "@/components/site/FloatingOrbs";
import { LeadForm } from "@/components/site/LeadForm";
import { PlatformMarquee } from "@/components/site/PlatformMarquee";
import { ServicesGrid } from "@/components/site/ServicesGrid";
import { ProcessSection } from "@/components/site/ProcessSection";
import { PortfolioGrid } from "@/components/site/PortfolioGrid";
import { Testimonials } from "@/components/site/Testimonials";
import { MidLeadCTA, FinalCTA } from "@/components/site/CTASections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "American Writers Hub — Premium Book Publishing Services" },
      {
        name: "description",
        content:
          "Ghostwriting, editing, cover design, formatting, and global distribution on 200+ platforms. Your story deserves to be published.",
      },
      { property: "og:title", content: "American Writers Hub — Your Story, Published" },
      { property: "og:description", content: "From manuscript to bestseller — full-service book publishing." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-center font-accent text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            Your Book, Published Everywhere
          </p>
          <div className="mt-8">
            <PlatformMarquee />
          </div>
        </div>
      </section>
      <ServicesGrid />
      <ProcessSection />
      <MidLeadCTA />
      <section className="bg-offwhite py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-accent text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              Portfolio
            </span>
            <h2 className="mt-3 font-serif text-4xl font-bold text-navy md:text-5xl">
              Our Published Work
            </h2>
            <p className="mt-4 text-navy/65">
              Hundreds of books brought to life across every genre.
            </p>
          </div>
          <div className="mt-12">
            <PortfolioGrid compact />
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 rounded-full border-2 border-brand-red px-6 py-3 text-sm font-semibold text-brand-red transition hover:bg-brand-red hover:text-white"
            >
              View Full Portfolio <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
      <Testimonials />
      <FinalCTA />
    </>
  );
}

function Hero() {
  const stats = [
    "1,200+ Books Published",
    "200+ Global Platforms",
    "10+ Years of Excellence",
  ];
  return (
    <section className="navy-hero-bg grain-overlay relative overflow-hidden pt-32 pb-20 md:min-h-screen md:pt-40">
      <FloatingOrbs />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="font-accent text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">
            Professional Publishing Services
          </span>
          <h1 className="mt-4 font-serif text-5xl font-bold leading-[1.05] text-balance text-white md:text-6xl lg:text-7xl">
            Your Story Deserves to Be Published.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/75">
            From manuscript to bestseller — we handle ghostwriting, editing, design, formatting, and
            global distribution on 200+ platforms. Let's bring your book to life.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {stats.map((s) => (
              <span
                key={s}
                className="glass-light flex items-center gap-2 rounded-full border-l-4 border-brand-red bg-white/10 px-4 py-2 text-sm text-white"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/get-published"
              className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-brand-red/40 transition hover:-translate-y-0.5"
            >
              Start Your Book Journey <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View Our Work
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: [40, 0, -8, 0] }}
          transition={{
            opacity: { duration: 0.6 },
            y: { duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
          }}
        >
          <LeadForm />
        </motion.div>
      </div>
    </section>
  );
}
