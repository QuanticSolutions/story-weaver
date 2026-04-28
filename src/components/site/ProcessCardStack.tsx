import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion";
import { Link } from "@tanstack/react-router";
import ReactLenis from "lenis/react";
import {
  PenLine,
  FileCheck,
  Layers,
  LayoutTemplate,
  Globe,
  Monitor,
  TrendingUp,
  Palette,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { FloatingOrbs } from "./FloatingOrbs";

type Step = {
  icon: LucideIcon;
  title: string;
  desc: string;
  cta: string;
  href: string;
};

const steps: Step[] = [
  { icon: PenLine, title: "Ghostwriting (Optional)", desc: "You share your idea, story outline, or raw notes — our professional ghostwriters craft a full manuscript that sounds authentically like you. Multiple revision rounds until you're completely satisfied.", cta: "View Ghostwriting Work", href: "/portfolio" },
  { icon: FileCheck, title: "Editing & Proofreading", desc: "Your manuscript goes through two layers of editing: Line Editing corrects grammar, punctuation, and sentence flow; Developmental Editing refines structure, pacing, character arcs, and overall storytelling impact.", cta: "View Editing Work", href: "/portfolio" },
  { icon: Layers, title: "Cover Design", desc: "Our designers present multiple cover concepts tailored to your genre. You select your favorite direction, request revisions, and approve the final design — a cover that truly sells your book.", cta: "View Cover Designs", href: "/portfolio" },
  { icon: LayoutTemplate, title: "Book Formatting", desc: "We format your book for every format it will live in: eBook (EPUB/MOBI), Paperback (PDF with bleed and trim), Hardcover, and Audiobook production-ready files — all meeting platform specifications.", cta: "View Formatting Work", href: "/portfolio" },
  { icon: Globe, title: "Global Publishing", desc: "We publish your book on 200+ platforms worldwide: Amazon KDP, Barnes & Noble Press, Apple Books, Google Play Books, Kobo, IngramSpark, Draft2Digital, Blurb, Gardners, Tolino, and many more.", cta: "View Published Books", href: "/portfolio" },
  { icon: Monitor, title: "Author Website", desc: "Every published author needs a home on the web. We build you a custom, branded author website — complete with book pages, biography, blog, newsletter signup, and direct sales integration.", cta: "View Author Websites", href: "/portfolio" },
  { icon: TrendingUp, title: "Book Marketing", desc: "We amplify your book's reach through Amazon PPC advertising, targeted social media ads, Google Knowledge Panel setup to establish your author authority, and ongoing digital promotion campaigns.", cta: "View Marketing Results", href: "/portfolio" },
  { icon: Palette, title: "Illustrations (Optional)", desc: "For children's books, graphic novels, or illustrated non-fiction — our illustrators create original, custom artwork that matches your vision, style, and target readership.", cta: "View Illustration Work", href: "/portfolio" },
];

function StickyCard({
  i,
  step,
  progress,
  range,
  targetScale,
  total,
}: {
  i: number;
  step: Step;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  total: number;
}) {
  const scale = useTransform(progress, range, [1, targetScale]);
  const Icon = step.icon;

  return (
    <div className="sticky top-0 flex h-screen items-center justify-center px-4">
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 24}px)`,
        }}
        className="glass-light relative grid w-full max-w-4xl origin-top items-start gap-8 rounded-3xl p-10 shadow-2xl md:grid-cols-[auto_1fr_auto]"
      >
        <div className="flex size-20 items-center justify-center rounded-2xl bg-brand-red text-white">
          <Icon className="size-9" />
        </div>
        <div>
          <p className="font-accent text-xs font-semibold uppercase tracking-widest text-brand-red">
            Step {i + 1} of {total}
          </p>
          <h3 className="mt-1 font-serif text-3xl font-bold text-white">
            {step.title}
          </h3>
          <p className="mt-3 max-w-2xl text-white/75">{step.desc}</p>
        </div>
        <Link
          to={step.href}
          className="inline-flex items-center gap-2 self-center rounded-full bg-brand-red px-5 py-3 text-sm font-semibold text-white hover:bg-brand-red-dark"
        >
          {step.cta} <ArrowRight className="size-4" />
        </Link>
      </motion.div>
    </div>
  );
}

export function ProcessCardStack() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(
      steps.length - 1,
      Math.max(0, Math.floor(v * steps.length))
    );
    setActive(idx);
  });

  // Initialize lenis-like smooth scroll at the root
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      <section className="navy-hero-bg grain-overlay relative overflow-hidden">
        <FloatingOrbs />
        <div className="relative mx-auto max-w-7xl px-5 pt-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="font-accent text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              How We Work
            </span>
            <h2 className="mt-3 font-serif text-4xl font-bold text-balance text-white md:text-5xl">
              From Idea to International Bestseller
            </h2>
            <p className="mt-4 text-white/70">
              A seamless, 8-step journey crafted around your vision.
            </p>
          </motion.div>
        </div>

        <div className="relative mx-auto mt-14 grid max-w-7xl gap-8 px-5 lg:grid-cols-[220px_1fr] lg:px-8">
          {/* Sticky tab rail */}
          <div className="hidden lg:block">
            <div className="sticky top-32 space-y-2">
              {steps.map((s, i) => {
                const isActive = i === active;
                return (
                  <div
                    key={s.title}
                    className="relative flex items-center gap-3 py-2 pl-4 text-sm transition-colors"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="process-rail-indicator"
                        className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 bg-brand-red"
                      />
                    )}
                    <span
                      className={`font-serif text-base ${
                        isActive ? "text-brand-red" : "text-white/40"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`transition-colors ${
                        isActive ? "text-white" : "text-white/50"
                      }`}
                    >
                      {s.title.replace(" (Optional)", "")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stacking cards */}
          <div ref={container} className="relative pb-[100vh]">
            {steps.map((step, i) => {
              const targetScale = 1 - (steps.length - i) * 0.04;
              return (
                <StickyCard
                  key={step.title}
                  i={i}
                  step={step}
                  progress={scrollYProgress}
                  range={[i * (1 / steps.length), 1]}
                  targetScale={targetScale}
                  total={steps.length}
                />
              );
            })}
          </div>
        </div>
      </section>
    </ReactLenis>
  );
}
