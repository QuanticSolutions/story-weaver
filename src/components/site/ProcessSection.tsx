import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { Link } from "@tanstack/react-router";
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
  ChevronDown,
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

function StickyStepCard({
  index,
  step,
  progress,
  totalCount,
}: {
  index: number;
  step: Step;
  progress: MotionValue<number>;
  totalCount: number;
}) {
  // Each card occupies an equal slice of the scroll range.
  // Card i starts shrinking when the next card begins.
  const start = index / totalCount;
  const end = (index + 1) / totalCount;
  const targetScale = Math.max(0.85, 1 - (totalCount - index - 1) * 0.025);

  const scale = useTransform(progress, [start, end], [1, targetScale]);
  const Icon = step.icon;

  return (
    <div
      className="sticky flex items-center justify-center"
      style={{ top: `calc(20vh + ${index * 18}px)` }}
    >
      <motion.div
        style={{ scale, transformOrigin: "top center" }}
        className="glass-light grid w-full items-start gap-8 rounded-3xl p-8 md:p-10 md:grid-cols-[auto_1fr_auto]"
      >
        <div className="flex size-20 items-center justify-center rounded-2xl bg-brand-red text-white">
          <Icon className="size-9" />
        </div>
        <div>
          <p className="font-accent text-xs font-semibold uppercase tracking-widest text-brand-red">
            Step {index + 1} of {totalCount}
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

export function ProcessSection() {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);

  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)));
    setActive(idx);
  });

  return (
    <section className="navy-hero-bg grain-overlay relative overflow-hidden py-24">
      <FloatingOrbs />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
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

        {/* Desktop: sticky tabs + stacking cards */}
        <div className="mt-14 hidden lg:block">
          <div className="sticky top-20 z-20 -mx-5 bg-[#0B1F4B]/80 px-5 pt-4 pb-2 backdrop-blur-xl lg:-mx-8 lg:px-8">
            <div className="flex flex-wrap justify-center gap-2 border-b border-white/10 pb-1">
              {steps.map((s, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={s.title}
                    onClick={() => {
                      // scroll to the corresponding card
                      const el = stackRef.current;
                      if (!el) return;
                      const rect = el.getBoundingClientRect();
                      const totalScrollable = rect.height - window.innerHeight;
                      const target =
                        window.scrollY +
                        rect.top +
                        (i / steps.length) * totalScrollable +
                        1;
                      window.scrollTo({ top: target, behavior: "smooth" });
                    }}
                    className="relative px-4 py-3 text-sm transition-colors"
                  >
                    <span
                      className={`mr-2 font-serif text-lg ${
                        isActive ? "text-brand-red" : "text-white/40"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span className={isActive ? "text-white" : "text-white/60"}>
                      {s.title.replace(" (Optional)", "")}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="process-underline"
                        className="absolute -bottom-px left-2 right-2 h-0.5 bg-brand-red"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-brand-red"
                animate={{ width: `${((active + 1) / steps.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 22 }}
              />
            </div>
          </div>

          {/* Stacking cards container — tall to allow scroll-driven stacking */}
          <div
            ref={stackRef}
            className="relative mt-10"
            style={{ height: `${steps.length * 90}vh` }}
          >
            {steps.map((s, i) => (
              <StickyStepCard
                key={s.title}
                index={i}
                step={s}
                progress={scrollYProgress}
                totalCount={steps.length}
              />
            ))}
          </div>
        </div>

        {/* Mobile accordion */}
        <div className="mt-10 space-y-3 lg:hidden">
          {steps.map((s, i) => {
            const isOpen = openMobile === i;
            const Icon = s.icon;
            return (
              <div key={s.title} className="glass-light rounded-2xl">
                <button
                  onClick={() => setOpenMobile(isOpen ? null : i)}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left"
                >
                  <span className="font-serif text-2xl text-brand-red">0{i + 1}</span>
                  <span className="flex-1 font-serif text-lg font-semibold text-white">
                    {s.title}
                  </span>
                  <ChevronDown
                    className={`size-5 text-white/70 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-brand-red text-white">
                          <Icon className="size-5" />
                        </div>
                        <p className="text-sm text-white/75">{s.desc}</p>
                        <Link
                          to={s.href}
                          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-red"
                        >
                          {s.cta} <ArrowRight className="size-4" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
