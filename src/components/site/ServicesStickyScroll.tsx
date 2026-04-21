import {
  PenLine,
  FileCheck,
  Layers,
  LayoutTemplate,
  Palette,
  Globe,
  Monitor,
  TrendingUp,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { LightSectionDecor } from "./LightSectionDecor";
import { SectionTitle } from "./SectionTitle";

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  highlights: [string, string, string];
};

const services: Service[] = [
  { icon: PenLine, title: "Ghostwriting", description: "We transform your ideas into a compelling, professionally written manuscript that sounds authentically like you, with multiple rounds of revisions.", highlights: ["Sounds authentically like you", "Unlimited revision rounds", "Fiction & non-fiction experts"] },
  { icon: FileCheck, title: "Editing & Proofreading", description: "Line editing, developmental editing, and meticulous proofreading to perfect every sentence, paragraph, and chapter of your manuscript.", highlights: ["Line & developmental editing", "Final proofreading pass", "Style guide compliance"] },
  { icon: Layers, title: "Cover Design", description: "Custom, genre-appropriate cover designs that command attention on any shelf and convert browsers into buyers.", highlights: ["Multiple concept directions", "Genre-tested designs", "Print + digital ready"] },
  { icon: LayoutTemplate, title: "Book Formatting", description: "Professional formatting for eBook, Paperback, Hardcover, and Audiobook — fully compliant with every platform specification.", highlights: ["EPUB, MOBI, PDF outputs", "Bleed & trim accurate", "Audiobook-ready masters"] },
  { icon: Palette, title: "Illustrations", description: "Custom artwork and illustrations that bring your story visually to life — for children's books, graphic novels, and illustrated non-fiction.", highlights: ["Custom original art", "Style-matched to brand", "Print-resolution files"] },
  { icon: Globe, title: "Global Publishing", description: "Distribution to 200+ platforms worldwide including Amazon, Apple Books, Kobo, IngramSpark, Barnes & Noble, and many more.", highlights: ["200+ global platforms", "Worldwide distribution", "ISBN management included"] },
  { icon: Monitor, title: "Author Website", description: "A stunning personal website to build your author brand, host your book pages, and sell directly to readers without intermediaries.", highlights: ["Custom branded design", "Book pages & blog", "Newsletter integration"] },
  { icon: TrendingUp, title: "Book Marketing", description: "Amazon PPC, social ads, Google Knowledge Panel, and strategic digital promotions that amplify your book's reach to the right readers.", highlights: ["Amazon PPC campaigns", "Google Knowledge Panel", "Targeted social ads"] },
];

export function ServicesStickyScroll() {
  const content = services.map((s) => {
    const Icon = s.icon;
    return {
      title: s.title,
      description: s.description,
      content: (
        <div className="relative flex h-full w-full flex-col items-center justify-center p-8 text-white">
          <Icon className="size-20" strokeWidth={1.5} />
          <p
            className="mt-4 text-center text-2xl font-bold"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            {s.title}
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-white/85">
            {s.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    };
  });

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
        <div className="mt-12">
          <StickyScroll content={content} />
        </div>
      </div>
    </section>
  );
}
