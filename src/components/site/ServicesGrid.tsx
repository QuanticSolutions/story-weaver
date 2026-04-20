import { motion } from "framer-motion";
import {
  PenLine,
  FileCheck,
  Layers,
  LayoutTemplate,
  Palette,
  Globe,
  Monitor,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { LightSectionDecor } from "./LightSectionDecor";
import { SectionTitle } from "./SectionTitle";

type Service = { icon: LucideIcon; title: string; desc: string };

const services: Service[] = [
  { icon: PenLine, title: "Ghostwriting", desc: "We transform your ideas into a compelling, professionally written manuscript." },
  { icon: FileCheck, title: "Editing & Proofreading", desc: "Line editing, developmental editing, and meticulous proofreading to perfect your work." },
  { icon: Layers, title: "Cover Design", desc: "Custom, genre-appropriate cover designs that command attention on any shelf." },
  { icon: LayoutTemplate, title: "Book Formatting", desc: "Professional formatting for eBook, Paperback, Hardcover, and Audiobook." },
  { icon: Palette, title: "Illustrations", desc: "Custom artwork and illustrations that bring your story visually to life." },
  { icon: Globe, title: "Global Publishing", desc: "Distribution to 200+ platforms worldwide including Amazon, Apple Books, and Kobo." },
  { icon: Monitor, title: "Author Website", desc: "A stunning personal website to build your author brand and sell directly to readers." },
  { icon: TrendingUp, title: "Book Marketing", desc: "Amazon PPC, social ads, Google Knowledge Panel, and strategic digital promotions." },
];

export function ServicesGrid() {
  return (
    <section className="paper-grain relative overflow-hidden bg-offwhite py-28">
      <LightSectionDecor />
      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex justify-center">
          <SectionTitle
            eyebrow="What We Do"
            title="Everything You Need to Publish a Professional Book"
            subtitle="From your first idea to a global readership — we cover every step."
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.96 },
                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
              }}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group glare relative rounded-[20px] border-l-[3px] border-brand-red p-7 shadow-[0_4px_24px_rgba(11,31,75,0.06)] transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(11,31,75,0.14)]"
              style={{ background: "linear-gradient(145deg, #ffffff 0%, #f4f6fb 100%)" }}
            >
              {/* Watermark icon */}
              <s.icon
                className="pointer-events-none absolute right-3 top-3 text-navy"
                style={{ width: 120, height: 120, opacity: 0.05 }}
              />

              {/* Card number */}
              <span
                className="label-eyebrow absolute right-5 top-5 text-navy/20"
                style={{ fontSize: 11 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Icon circle */}
              <div
                className="relative flex size-[52px] items-center justify-center rounded-full text-white shadow-md"
                style={{ background: "linear-gradient(135deg, #0B1F4B, #1a3a7a)" }}
              >
                <s.icon className="size-6" />
              </div>

              <h3 className="relative mt-6 font-display text-2xl font-bold text-navy">
                {s.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-navy/70">
                {s.desc}
              </p>

              <span className="accent-line" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
