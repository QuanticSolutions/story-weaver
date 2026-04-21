import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { FloatingOrbs } from "@/components/site/FloatingOrbs";
import { LeadForm } from "@/components/site/LeadForm";
import { PlatformMarquee } from "@/components/site/PlatformMarquee";
import { ServicesStickyScroll } from "@/components/site/ServicesStickyScroll";
import { ProcessStickyScroll } from "@/components/site/ProcessStickyScroll";
import { PortfolioGrid } from "@/components/site/PortfolioGrid";
import { Testimonials } from "@/components/site/Testimonials";
import { MidLeadCTA, FinalCTA } from "@/components/site/CTASections";
import { CounterStat } from "@/components/site/CounterStat";
import { LightSectionDecor } from "@/components/site/LightSectionDecor";
import { SectionTitle } from "@/components/site/SectionTitle";

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
      <section className="relative overflow-hidden bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="label-eyebrow text-center text-brand-red">
            Your Book, Published Everywhere
          </p>
          <div className="mt-8">
            <PlatformMarquee />
          </div>
          {/* Counter stats */}
          <div
            className="relative mt-16 grid gap-10 rounded-2xl px-8 py-12 sm:grid-cols-3"
            style={{ background: "linear-gradient(135deg, #0B1F4B 0%, #14306b 100%)" }}
          >
            <CounterStat to={1200} suffix="+" label="Books Published" />
            <CounterStat to={200} suffix="+" label="Global Platforms" />
            <CounterStat to={10} suffix="+ Years" label="Of Excellence" />
          </div>
        </div>
      </section>
      <ServicesStickyScroll />
      <ProcessStickyScroll />
      <MidLeadCTA />
      <section className="paper-grain relative overflow-hidden bg-offwhite py-28">
        <LightSectionDecor />
        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex justify-center">
            <SectionTitle
              eyebrow="Portfolio"
              title="Our Published Work"
              subtitle="Hundreds of books brought to life across every genre."
            />
          </div>
          <div className="mt-14">
            <PortfolioGrid compact />
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/portfolio"
              className="btn-uppercase glare glare-fast inline-flex items-center gap-2 rounded-full border-2 border-brand-red px-6 py-3 text-xs text-brand-red transition hover:bg-brand-red hover:text-white"
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
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Three-layer parallax
  const bgY = useTransform(scrollY, [0, 500], [0, -120]);
  const headingY = useTransform(scrollY, [0, 400], [0, -60]);
  const formY = useTransform(scrollY, [0, 400], [0, -30]);

  const stats = [
    "1,200+ Books Published",
    "200+ Global Platforms",
    "10+ Years of Excellence",
  ];

  return (
    <section
      ref={ref}
      className="navy-hero-bg grain-overlay relative overflow-hidden pt-32 pb-24 md:min-h-screen md:pt-40"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <FloatingOrbs />
      </motion.div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <motion.div style={{ y: headingY }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="label-eyebrow text-brand-red">
              Professional Publishing Services
            </span>
            <h1 className="mt-5 font-display font-bold leading-[1.02] tracking-tight text-balance text-white text-[38px] md:text-[52px] lg:text-[80px]">
              Your Story Deserves to Be Published.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
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
                className="btn-uppercase glare glare-fast inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-4 text-xs text-white shadow-xl shadow-brand-red/40 transition hover:-translate-y-0.5 hover:shadow-[0_0_0_3px_rgba(139,26,43,0.35),0_15px_40px_rgba(139,26,43,0.45)]"
              >
                Start Your Book Journey <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/portfolio"
                className="btn-uppercase glare glare-fast inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-4 text-xs text-white transition hover:bg-white/10"
              >
                View Our Work
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: formY }}>
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
        </motion.div>
      </div>
    </section>
  );
}
