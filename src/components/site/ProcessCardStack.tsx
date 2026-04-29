import { useRef, useState } from "react";
import {
  motion,
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
  {
    icon: PenLine,
    title: "Ghostwriting (Optional)",
    desc: "You share your idea, story outline, or raw notes — our professional ghostwriters craft a full manuscript that sounds authentically like you. Multiple revision rounds until you're completely satisfied.",
    cta: "View Ghostwriting Work",
    href: "/portfolio",
  },
  {
    icon: FileCheck,
    title: "Editing & Proofreading",
    desc: "Your manuscript goes through two layers of editing: Line Editing corrects grammar, punctuation, and sentence flow; Developmental Editing refines structure, pacing, character arcs, and overall storytelling impact.",
    cta: "View Editing Work",
    href: "/portfolio",
  },
  {
    icon: Layers,
    title: "Cover Design",
    desc: "Our designers present multiple cover concepts tailored to your genre. You select your favorite direction, request revisions, and approve the final design — a cover that truly sells your book.",
    cta: "View Cover Designs",
    href: "/portfolio",
  },
  {
    icon: LayoutTemplate,
    title: "Book Formatting",
    desc: "We format your book for every format it will live in: eBook (EPUB/MOBI), Paperback, Hardcover, and Audiobook production-ready files.",
    cta: "View Formatting Work",
    href: "/portfolio",
  },
  {
    icon: Globe,
    title: "Global Publishing",
    desc: "We publish your book on 200+ platforms worldwide including Amazon KDP, Apple Books, Google Play, Kobo, IngramSpark, and more.",
    cta: "View Published Books",
    href: "/portfolio",
  },
  {
    icon: Monitor,
    title: "Author Website",
    desc: "We build you a branded author website with book pages, biography, blog, newsletter signup, and direct sales integration.",
    cta: "View Author Websites",
    href: "/portfolio",
  },
  {
    icon: TrendingUp,
    title: "Book Marketing",
    desc: "Amazon PPC, social media ads, Google Knowledge Panel, and digital campaigns to maximize visibility and authority.",
    cta: "View Marketing Results",
    href: "/portfolio",
  },
  {
    icon: Palette,
    title: "Illustrations (Optional)",
    desc: "Custom illustrations for children's books, graphic novels, and visual storytelling projects.",
    cta: "View Illustration Work",
    href: "/portfolio",
  },
];

function StickyCard({
  i,
  step,
  total,
  scrollYProgress,
}: {
  i: number;
  step: Step;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const Icon = step.icon;

  const segmentStart = i / total;
  const segmentEnd = (i + 1) / total;
  const prevSegmentStart = Math.max(0, segmentStart - 1 / total);

  const y = useTransform(
    scrollYProgress,
    [prevSegmentStart, segmentStart, segmentEnd],
    [120, 0, -40]
  );

  const scale = useTransform(
    scrollYProgress,
    [segmentStart, segmentEnd],
    [1, 0.96]
  );

  const opacity = useTransform(
    scrollYProgress,
    [segmentStart, segmentEnd],
    [1, 0.82]
  );

  return (
    <motion.div
      style={{
        y,
        scale,
        opacity,
        zIndex: i + 1,
        position: "absolute",
        top: "50%",
        translateY: "-50%",
        left: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
        maxWidth: "56rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        transformOrigin: "top center",
      }}
    >
      {/* Outer wrapper: border + blur on the page background */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl backdrop-blur-3xl">
        {/* Solid navy backing — blocks cards stacked behind from showing through */}
        <div className="absolute inset-0 bg-[#0b1a35]/90" />

        {/* Card content sits above the solid backing */}
        <div className="relative grid w-full items-start gap-6 p-8 md:grid-cols-[auto_1fr] lg:gap-8 lg:p-10">
          {/* Icon */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brand-red text-white lg:size-20">
              <Icon className="size-8 lg:size-9" />
            </div>
            <p className="font-accent text-xs font-semibold uppercase tracking-widest text-brand-red">
              Step {i + 1}/{total}
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-2xl font-bold text-white lg:text-3xl">
              {step.title}
            </h3>

            <p className="text-sm leading-relaxed text-white/75 lg:text-base">
              {step.desc}
            </p>

            <div className="pt-1">
              <Link
                to={step.href}
                className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-red-dark"
              >
                {step.cta}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProcessCardStack() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
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

  return (
    <>
      {/* Header */}
      <div className="navy-hero-bg grain-overlay relative overflow-hidden">
        <FloatingOrbs />
        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8">
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
      </div>

      {/* Scroll Section */}
      <div
        ref={sectionRef}
        className="navy-hero-bg relative"
        style={{ height: `${steps.length * 100}vh` }}
      >
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="relative mx-auto flex h-full max-w-7xl gap-8 px-5 lg:px-8">
            {/* Sidebar */}
            <div className="hidden lg:flex lg:w-[220px] lg:shrink-0 lg:items-center">
              <div className="space-y-1">
                {steps.map((s, i) => {
                  const isActive = i === active;

                  return (
                    <div
                      key={s.title}
                      className="relative flex items-center gap-3 py-2 pl-4 text-sm"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="process-rail-indicator"
                          className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 bg-brand-red"
                        />
                      )}

                      <span
                        className={`font-serif text-base transition-colors duration-300 ${
                          isActive ? "text-brand-red" : "text-white/40"
                        }`}
                      >
                        0{i + 1}
                      </span>

                      <span
                        className={`transition-colors duration-300 ${
                          isActive ? "text-white" : "text-white/40"
                        }`}
                      >
                        {s.title.replace(" (Optional)", "")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stair Stack */}
            <div className="relative flex-1">
              {steps.map((step, i) => (
                <StickyCard
                  key={step.title}
                  i={i}
                  step={step}
                  total={steps.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}