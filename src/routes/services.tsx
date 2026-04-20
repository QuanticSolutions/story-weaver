import { createFileRoute } from "@tanstack/react-router";
import { ServicesGrid } from "@/components/site/ServicesGrid";
import { FloatingOrbs } from "@/components/site/FloatingOrbs";
import { FinalCTA } from "@/components/site/CTASections";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — American Writers Hub" },
      { name: "description", content: "Ghostwriting, editing, cover design, formatting, illustrations, publishing, author websites, and marketing." },
      { property: "og:title", content: "Services — American Writers Hub" },
      { property: "og:description", content: "Full-service book publishing from idea to global launch." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <section className="navy-hero-bg grain-overlay relative overflow-hidden pt-32 pb-20">
        <FloatingOrbs />
        <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
          <span className="font-accent text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">
            Our Services
          </span>
          <h1 className="mt-3 font-serif text-5xl font-bold text-balance text-white md:text-6xl">
            Every Step of Publishing, Handled.
          </h1>
          <p className="mt-5 text-white/75">
            Eight integrated services that take your manuscript from a first draft to a globally available book.
          </p>
        </div>
      </section>
      <ServicesGrid />
      <FinalCTA />
    </>
  );
}
