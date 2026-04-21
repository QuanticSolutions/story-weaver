import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

const stepsTimeline = [
  { title: "Contact Us", description: "Reach out via the form or book a free consultation. Tell us about your project, your goals, and your timeline." },
  { title: "Free Consultation", description: "Speak with a real publishing consultant. No bots — only senior advisors who understand your genre and audience." },
  { title: "NDA Signed", description: "We sign a mutual NDA to keep your manuscript, ideas, and personal details fully confidential from day one." },
  { title: "Project Begins", description: "A dedicated project manager assembles your team, builds the schedule, and walks you through every milestone." },
  { title: "Review & Approve", description: "You review every milestone — manuscript, cover, formatting, and marketing plan — and approve before we proceed." },
  { title: "Global Launch", description: "Your book goes live on 200+ platforms worldwide with marketing support to drive readers from day one." },
];

export function PublishStickyScroll() {
  const content = stepsTimeline.map((s, i) => ({
    title: s.title,
    description: s.description,
    content: (
      <div className="relative flex h-full w-full flex-col items-center justify-center p-8 text-white">
        <span
          className="select-none font-bold leading-none text-white/15"
          style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 180 }}
        >
          {String(i + 1).padStart(2, "0")}
        </span>
        <p
          className="mt-2 text-center text-3xl font-bold"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          {s.title}
        </p>
      </div>
    ),
  }));

  return (
    <section className="bg-offwhite py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-4xl font-bold text-navy md:text-5xl">
            Step-by-Step Publishing Process
          </h2>
          <p className="mt-4 text-navy/65">
            A transparent journey from first contact to global launch.
          </p>
        </div>
        <div className="mt-12">
          <StickyScroll content={content} />
        </div>
      </div>
    </section>
  );
}
