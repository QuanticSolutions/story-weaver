import { MacbookScroll } from "@/components/ui/macbook-scroll";

const screen = (
  <div
    className="relative flex h-full w-full items-center justify-center"
    style={{
      background:
        "linear-gradient(135deg, #0B1F4B 0%, #1a3a7a 40%, #8B1A2B 100%)",
      backgroundImage: `linear-gradient(135deg, #0B1F4B 0%, #1a3a7a 40%, #8B1A2B 100%), repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 28px)`,
      backgroundBlendMode: "normal, overlay, overlay",
    }}
  >
    <span
      className="text-white/90"
      style={{
        fontFamily: '"Montserrat", sans-serif',
        fontSize: 14,
        letterSpacing: "0.25em",
        textTransform: "uppercase",
      }}
    >
      americanwritershub.com
    </span>
  </div>
);

export function HomeMacbookSection() {
  return (
    <section className="relative overflow-hidden bg-[#0B1F4B] pb-24">
      <div className="mx-auto max-w-5xl px-5 pt-12 text-center lg:px-8">
        <span className="font-accent text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">
          Trusted by 1,200+ Authors
        </span>
        <h2
          className="mt-3 text-4xl font-bold text-balance text-white md:text-5xl"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          Your Book. Published Everywhere.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/70">
          See how American Writers Hub takes your manuscript from raw idea to a live listing on 200+ global platforms.
        </p>
      </div>
      <MacbookScroll
        title={<span>Your Book. Published Everywhere.</span>}
        screenContent={screen}
        showGradient={false}
      />
    </section>
  );
}
