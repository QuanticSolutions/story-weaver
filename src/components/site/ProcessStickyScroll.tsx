import {
  PenLine,
  FileCheck,
  Layers,
  LayoutTemplate,
  Globe,
  Monitor,
  TrendingUp,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { FloatingOrbs } from "./FloatingOrbs";

const steps: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: PenLine, title: "Ghostwriting", description: "You share your idea, story outline, or raw notes — our professional ghostwriters craft a full manuscript that sounds authentically like you. Multiple revision rounds until you're completely satisfied." },
  { icon: FileCheck, title: "Editing & Proofreading", description: "Your manuscript goes through two layers of editing: Line Editing corrects grammar, punctuation, and sentence flow; Developmental Editing refines structure, pacing, character arcs, and overall storytelling impact." },
  { icon: Layers, title: "Cover Design", description: "Our designers present multiple cover concepts tailored to your genre. You select your favorite direction, request revisions, and approve the final design — a cover that truly sells your book." },
  { icon: LayoutTemplate, title: "Book Formatting", description: "We format your book for every format it will live in: eBook (EPUB/MOBI), Paperback (PDF with bleed and trim), Hardcover, and Audiobook production-ready files — all meeting platform specifications." },
  { icon: Globe, title: "Global Publishing", description: "We publish your book on 200+ platforms worldwide: Amazon KDP, Barnes & Noble Press, Apple Books, Google Play Books, Kobo, IngramSpark, Draft2Digital, Blurb, Gardners, Tolino, and many more." },
  { icon: Monitor, title: "Author Website", description: "Every published author needs a home on the web. We build you a custom, branded author website — complete with book pages, biography, blog, newsletter signup, and direct sales integration." },
  { icon: TrendingUp, title: "Book Marketing", description: "We amplify your book's reach through Amazon PPC advertising, targeted social media ads, Google Knowledge Panel setup to establish your author authority, and ongoing digital promotion campaigns." },
  { icon: Palette, title: "Illustrations", description: "For children's books, graphic novels, or illustrated non-fiction — our illustrators create original, custom artwork that matches your vision, style, and target readership." },
];

export function ProcessStickyScroll() {
  const content = steps.map((s, i) => {
    const Icon = s.icon;
    return {
      title: s.title,
      description: s.description,
      content: (
        <div className="relative flex h-full w-full flex-col items-center justify-center p-8 text-white">
          <span
            className="absolute right-6 top-2 select-none font-bold leading-none text-white/10"
            style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 140 }}
          >
            0{i + 1}
          </span>
          <Icon className="size-20" strokeWidth={1.5} />
          <p
            className="mt-6 text-center text-2xl font-bold"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            {s.title}
          </p>
        </div>
      ),
    };
  });

  return (
    <section className="navy-hero-bg grain-overlay relative overflow-hidden py-24">
      <FloatingOrbs />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-accent text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            How We Work
          </span>
          <h2 className="mt-3 font-serif text-4xl font-bold text-balance text-white md:text-5xl">
            From Idea to International Bestseller
          </h2>
          <p className="mt-4 text-white/70">
            A seamless, 8-step journey crafted around your vision.
          </p>
        </div>
        <div className="mt-14">
          <StickyScroll content={content} />
        </div>
      </div>
    </section>
  );
}
