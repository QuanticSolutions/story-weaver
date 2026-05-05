import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  PenLine,
  FileCheck,
  Palette,
  LayoutTemplate,
  Globe,
  Monitor,
  TrendingUp,
  Brush,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

type Step = {
  num: string;
  title: string;
  optional?: boolean;
  desc: string;
  tags: string[];
  icon: LucideIcon;
};

const steps: Step[] = [
  {
    num: "01",
    title: "Ghostwriting",
    optional: true,
    desc: "Share an idea, outline, or raw notes. Our professional ghostwriters craft a full manuscript in your authentic voice with unlimited revisions until it's perfect.",
    tags: ["Idea", "Outline", "Draft", "Revisions", "Approval"],
    icon: PenLine,
  },
  {
    num: "02",
    title: "Editing & Proofreading",
    desc: "Two layers of editing — line edits for grammar and flow, developmental edits for structure, pacing, character arcs and overall impact.",
    tags: ["Line Editing", "Developmental Editing", "Copyediting", "Proofreading"],
    icon: FileCheck,
  },
  {
    num: "03",
    title: "Cover Design",
    desc: "Multiple original concepts tailored to your genre. You select a direction, request revisions, and approve a cover that truly sells your book.",
    tags: ["Concepts", "Revisions", "Print-Ready", "Digital-Ready"],
    icon: Palette,
  },
  {
    num: "04",
    title: "Book Formatting",
    desc: "We format your manuscript for every format it will live in — eBook, paperback, hardcover, and audiobook production-ready files.",
    tags: ["eBook", "Paperback", "Hardcover", "Audiobook"],
    icon: LayoutTemplate,
  },
  {
    num: "05",
    title: "Global Publishing",
    desc: "Distribution on 200+ platforms worldwide so readers can find your book wherever they shop, read, or listen.",
    tags: ["Amazon", "Apple Books", "Kobo", "IngramSpark", "+196 more"],
    icon: Globe,
  },
  {
    num: "06",
    title: "Author Website",
    desc: "A branded author website with book pages, biography, blog, newsletter signup, and direct sales integration.",
    tags: ["Branding", "Book Pages", "Blog", "Newsletter"],
    icon: Monitor,
  },
  {
    num: "07",
    title: "Book Marketing",
    desc: "Amazon PPC, social media ads, Google Knowledge Panel, and digital campaigns to maximize visibility and authority.",
    tags: ["Amazon PPC", "Social Ads", "Google Panel", "Digital Promos"],
    icon: TrendingUp,
  },
  {
    num: "08",
    title: "Illustrations",
    optional: true,
    desc: "Custom illustrations for children's books, graphic novels, and any visual storytelling project.",
    tags: ["Custom Art", "Children's", "Graphic Novel", "Illustrated"],
    icon: Brush,
  },
];

function Card({ step }: { step: Step }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
      className="rounded-[20px] border bg-[#FDFAF4] px-7 py-8 shadow-[0_8px_30px_rgba(11,31,75,0.06)] md:px-9"
      style={{ borderColor: "rgba(201,168,76,0.35)", borderWidth: "1.5px" }}
    >
      <div className="flex items-center gap-4">
        <span
          className="font-serif text-4xl italic md:text-5xl"
          style={{ color: "#C9A84C" }}
        >
          {step.num}
        </span>
        <h3 className="font-serif text-2xl font-bold text-navy md:text-[26px]">
          {step.title}
        </h3>
        {step.optional && (
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{
              color: "#9C7A1F",
              background: "rgba(201,168,76,0.12)",
              border: "1px solid rgba(201,168,76,0.4)",
            }}
          >
            Optional
          </span>
        )}
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-navy/65">{step.desc}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {step.tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-[#FBF6E8] px-3 py-1 text-xs font-medium text-navy/75"
            style={{ border: "1px solid rgba(201,168,76,0.35)" }}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition hover:gap-2.5"
          style={{ color: "#9C7A1F" }}
        >
          View Work <ArrowRight className="size-4" />
        </Link>
      </div>
    </motion.div>
  );
}

function Connector({ Icon }: { Icon: LucideIcon }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center"
    >
      <div
        className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm"
        style={{ border: "1.5px solid rgba(201,168,76,0.5)" }}
      >
        <Icon className="size-6" style={{ color: "#C9A84C" }} />
      </div>
    </motion.div>
  );
}

export function PublishingJourney() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="font-serif text-4xl font-bold text-navy md:text-6xl"
            style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", serif' }}
          >
            Your Publishing Journey
          </h2>
          <p className="mt-5 text-lg text-navy/55">
            A proven, end-to-end process — from the first spark of your idea to your book on
            shelves worldwide.
          </p>
        </div>

        {/* Desktop alternating layout */}
        <div className="relative mt-16 hidden md:block">
          {/* center vertical line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: "rgba(201,168,76,0.3)" }}
            aria-hidden
          />
          <div className="space-y-10">
            {steps.map((step, i) => {
              const left = i % 2 === 0;
              return (
                <div
                  key={step.num}
                  className="grid grid-cols-[1fr_auto_1fr] items-center gap-8"
                >
                  <div>{left && <Card step={step} />}</div>
                  <Connector Icon={step.icon} />
                  <div>{!left && <Card step={step} />}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile stacked layout */}
        <div className="mt-12 space-y-6 md:hidden">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center gap-4">
              <Connector Icon={step.icon} />
              <Card step={step} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
