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
    <section className="diagonal-lines relative bg-offwhite py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-accent text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            What We Do
          </span>
          <h2 className="mt-3 font-serif text-4xl font-bold text-balance text-navy md:text-5xl">
            Everything You Need to Publish a Professional Book
          </h2>
          <p className="mt-4 text-navy/65">
            From your first idea to a global readership — we cover every step.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((s) => (
            <motion.div
              key={s.title}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(11,31,75,0.15)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative rounded-2xl border-t-[3px] border-navy bg-white p-6 shadow-sm"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex size-12 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red"
              >
                <s.icon className="size-6" />
              </motion.div>
              <h3 className="mt-5 font-serif text-xl font-bold text-navy">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/65">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
