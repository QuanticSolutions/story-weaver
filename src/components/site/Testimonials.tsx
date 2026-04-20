import { useRef } from "react";
import { motion } from "framer-motion";
import { Play, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { FloatingOrbs } from "./FloatingOrbs";

const videos = [
  { author: "Sarah Linwood", book: "The Last Cartographer" },
  { author: "Marcus Reed", book: "Quiet Empires" },
  { author: "Elena Vasquez", book: "Whispers of Cedar" },
  { author: "Dr. James Holt", book: "Blueprints of Tomorrow" },
];

const reviews = [
  {
    name: "Patricia M.",
    book: "Threads of Memory",
    quote:
      "From ghostwriting to global launch, the team handled every detail with care. Seeing my book on Amazon and Apple Books still feels surreal.",
  },
  {
    name: "David K.",
    book: "The Founder's Edge",
    quote:
      "Their editors elevated my draft into something truly professional. The cover design alone has driven hundreds of pre-orders.",
  },
  {
    name: "Aisha R.",
    book: "Echoes in the Pines",
    quote:
      "A dedicated project manager, transparent process, and a final product I'm genuinely proud of. American Writers Hub delivered.",
  },
];

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section className="navy-hero-bg grain-overlay relative overflow-hidden py-24">
      <FloatingOrbs />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-accent text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            Testimonials
          </span>
          <h2 className="mt-3 font-serif text-4xl font-bold text-balance text-white md:text-5xl">
            What Our Authors Say
          </h2>
          <p className="mt-4 text-white/70">
            Real stories from real authors we've helped publish.
          </p>
        </motion.div>

        {/* Video slider */}
        <div className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-xl text-white">Video Testimonials</h3>
            <div className="flex gap-2">
              <button
                onClick={() => scroll(-1)}
                aria-label="Previous"
                className="flex size-10 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={() => scroll(1)}
                aria-label="Next"
                className="flex size-10 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {videos.map((v) => (
              <motion.div
                key={v.author}
                whileHover={{ y: -4 }}
                className="glass-light min-w-[300px] snap-start overflow-hidden rounded-2xl sm:min-w-[360px]"
              >
                <div className="relative aspect-video bg-gradient-to-br from-navy to-brand-red">
                  <button
                    aria-label="Play video"
                    className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-white/95 text-brand-red shadow-xl transition hover:scale-105"
                  >
                    <Play className="size-7 fill-current" />
                  </button>
                </div>
                <div className="p-5">
                  <p className="font-serif text-lg font-semibold text-white">{v.author}</p>
                  <p className="text-sm text-white/65">{v.book}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Written reviews */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {reviews.map((r) => (
            <motion.div
              key={r.name}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="glass-light rounded-2xl p-6"
            >
              <div className="flex gap-1 text-brand-red">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 italic text-white/85">"{r.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-brand-red/30 font-serif text-sm font-bold text-white">
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{r.name}</p>
                  <p className="text-xs text-white/60">{r.book}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
