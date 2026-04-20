import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ArrowRight } from "lucide-react";

export type PortfolioItem = {
  title: string;
  genre: string;
  category: string;
  gradient: string;
};

const items: PortfolioItem[] = [
  { title: "The Last Cartographer", genre: "Literary Fiction", category: "Ghostwriting", gradient: "from-navy to-brand-red" },
  { title: "Quiet Empires", genre: "Business", category: "Cover Design", gradient: "from-brand-red to-navy" },
  { title: "Whispers of Cedar", genre: "Memoir", category: "Formatting", gradient: "from-navy to-navy-deep" },
  { title: "Blueprints of Tomorrow", genre: "Self-Help", category: "Marketing", gradient: "from-brand-red-dark to-navy" },
  { title: "Maya's Garden", genre: "Children's", category: "Author Websites", gradient: "from-gold/70 to-brand-red" },
  { title: "Threads of Memory", genre: "Romance", category: "Cover Design", gradient: "from-brand-red to-brand-red-dark" },
  { title: "The Founder's Edge", genre: "Business", category: "Ghostwriting", gradient: "from-navy-deep to-brand-red" },
  { title: "Echoes in the Pines", genre: "Thriller", category: "Marketing", gradient: "from-navy to-brand-red-dark" },
  { title: "A Quiet Faith", genre: "Spirituality", category: "Formatting", gradient: "from-navy to-gold/60" },
];

const filters = ["All", "Ghostwriting", "Cover Design", "Formatting", "Marketing", "Author Websites"];

export function PortfolioGrid({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <LayoutGroup id="portfolio-filters">
          {filters.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition ${
                  active ? "text-white" : "text-navy/70 hover:text-navy"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="portfolio-pill"
                    className="absolute inset-0 rounded-full bg-brand-red"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{f}</span>
              </button>
            );
          })}
        </LayoutGroup>
      </div>

      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {(compact ? visible.slice(0, 6) : visible).map((item) => (
            <motion.article
              key={item.title}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md"
            >
              <div
                className={`relative aspect-[3/4] bg-gradient-to-br ${item.gradient} p-6`}
              >
                <div className="absolute inset-x-6 top-6 text-xs font-semibold uppercase tracking-widest text-white/60">
                  American Writers Hub
                </div>
                <div className="absolute inset-x-6 bottom-6">
                  <p className="font-serif text-2xl font-bold leading-tight text-white">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-white/70">{item.genre}</p>
                </div>
                <motion.div
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-navy/85 p-6 text-center opacity-0 group-hover:opacity-100"
                >
                  <p className="font-serif text-xl font-bold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-white/70">{item.genre}</p>
                  <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-2 text-xs font-semibold text-white">
                    View Details <ArrowRight className="size-3" />
                  </button>
                </motion.div>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="rounded-full bg-brand-red/10 px-3 py-1 text-xs font-semibold text-brand-red">
                  {item.category}
                </span>
                <span className="text-xs text-navy/55">{item.genre}</span>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
