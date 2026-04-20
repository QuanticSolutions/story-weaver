import { createFileRoute } from "@tanstack/react-router";
import { PortfolioGrid } from "@/components/site/PortfolioGrid";
import { FloatingOrbs } from "@/components/site/FloatingOrbs";
import { FinalCTA } from "@/components/site/CTASections";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — American Writers Hub" },
      { name: "description", content: "Our published work: fiction, non-fiction, business, memoir, children's, and more — across 200+ platforms." },
      { property: "og:title", content: "Portfolio — American Writers Hub" },
      { property: "og:description", content: "Hundreds of books brought to life across every genre." },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <>
      <section className="navy-hero-bg grain-overlay relative overflow-hidden pt-32 pb-20">
        <FloatingOrbs />
        <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
          <span className="font-accent text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">
            Portfolio
          </span>
          <h1 className="mt-3 font-serif text-5xl font-bold text-balance text-white md:text-6xl">
            Our Published Work
          </h1>
          <p className="mt-5 text-white/75">
            A selection of books we've ghostwritten, edited, designed, formatted, and launched globally.
          </p>
        </div>
      </section>
      <section className="bg-offwhite py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <PortfolioGrid />
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
