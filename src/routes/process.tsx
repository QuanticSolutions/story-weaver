import { createFileRoute } from "@tanstack/react-router";
import { ProcessSection } from "@/components/site/ProcessSection";
import { FinalCTA } from "@/components/site/CTASections";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Our Process — American Writers Hub" },
      { name: "description", content: "Our 8-step publishing process: ghostwriting, editing, cover, formatting, publishing, websites, marketing, illustrations." },
      { property: "og:title", content: "Our Process — American Writers Hub" },
      { property: "og:description", content: "From idea to international bestseller in 8 deliberate steps." },
    ],
  }),
  component: ProcessPage,
});

function ProcessPage() {
  return (
    <>
      <div className="pt-20" />
      <ProcessSection />
      <FinalCTA />
    </>
  );
}
