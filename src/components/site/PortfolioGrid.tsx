import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ArrowRight } from "lucide-react";
import roadToHeaven from "@/assets/portfolio/road-to-heaven.jpg";
import maybe from "@/assets/portfolio/maybe.jpg";
import sacredFlowers from "@/assets/portfolio/sacred-language-flowers.jpg";
import giantDepressionPink from "@/assets/portfolio/giant-depression-pink.jpg";
import ageWontDictate from "@/assets/portfolio/age-wont-dictate.jpg";
import giantDepression from "@/assets/portfolio/giant-depression.jpg";
import proofLifeBeLivin from "@/assets/portfolio/proof-life-be-livin.jpg";
import proofNeverSerious from "@/assets/portfolio/proof-never-serious.jpg";
import proofHappiness from "@/assets/portfolio/proof-happiness-choice.jpg";
import proofImSexy from "@/assets/portfolio/proof-im-sexy.jpg";
import proofStandard from "@/assets/portfolio/proof-standard.jpg";
import pubAgeWontDictate from "@/assets/portfolio/pub-age-wont-dictate.jpg";
import pubRoadToHeaven from "@/assets/portfolio/pub-road-to-heaven.jpg";
import pubSacredFlowers from "@/assets/portfolio/pub-sacred-flowers.jpg";
import pubGiantDepression from "@/assets/portfolio/pub-giant-depression.jpg";

export type PortfolioItem = {
  id: string;
  title: string;
  genre: string;
  category: string;
  image?: string;
  gradient?: string;
};

const items: PortfolioItem[] = [
  { id: "cover-road-to-heaven", title: "Road to Heaven", genre: "Inspirational Fiction", category: "Cover Design", image: roadToHeaven },
  { id: "cover-maybe", title: "Maybe", genre: "Children's", category: "Cover Design", image: maybe },
  { id: "cover-sacred-flowers", title: "The Sacred Language of Flowers", genre: "Poetry", category: "Cover Design", image: sacredFlowers },
  { id: "cover-depression-pink", title: "Slaying the Giant of Depression", genre: "Self-Help", category: "Cover Design", image: giantDepressionPink },
  { id: "cover-age-wont-dictate", title: "Age Won't Dictate My Achievements", genre: "Memoir", category: "Cover Design", image: ageWontDictate },
  { id: "cover-depression-dark", title: "Slaying the Giant of Depression", genre: "Self-Help", category: "Cover Design", image: giantDepression },
  { id: "proof-life-be-livin", title: "Life Be Livin'", genre: "Personal Essay", category: "Proofreading", image: proofLifeBeLivin },
  { id: "proof-never-serious", title: "It's Never Really That Serious", genre: "Self-Help", category: "Proofreading", image: proofNeverSerious },
  { id: "proof-happiness", title: "Happiness Is A Choice", genre: "Motivational", category: "Proofreading", image: proofHappiness },
  { id: "proof-im-sexy", title: "I'm Sexy. It Is What It Is.", genre: "Self-Love", category: "Proofreading", image: proofImSexy },
  { id: "proof-standard", title: "The Standard Is The Standard", genre: "Motivational", category: "Proofreading", image: proofStandard },
  { id: "pub-age-wont-dictate", title: "Age Won't Dictate My Achievements", genre: "Memoir", category: "Published", image: pubAgeWontDictate },
  { id: "pub-road-to-heaven", title: "Road to Heaven", genre: "Romantic Comedy", category: "Published", image: pubRoadToHeaven },
  { id: "pub-sacred-flowers", title: "The Sacred Language of Flowers", genre: "Poetry", category: "Published", image: pubSacredFlowers },
  { id: "pub-depression", title: "Slaying the Giant of Depression", genre: "Christian Self-Help", category: "Published", image: pubGiantDepression },
];

const filters = ["All", "Cover Design", "Proofreading", "Published"];

export function PortfolioGrid({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <div>
      <div className="mb-12 flex flex-wrap justify-center gap-2">
        <LayoutGroup id="portfolio-filters">
          {filters.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn-uppercase relative rounded-full px-5 py-2.5 text-[11px] transition ${
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
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              whileHover={{ y: -6 }}
              className="group glare relative overflow-hidden rounded-[16px] border border-navy/10 bg-white shadow-[0_4px_24px_rgba(11,31,75,0.06)] transition-all duration-500 hover:border-brand-red/50 hover:shadow-[0_24px_60px_rgba(11,31,75,0.16)]"
            >
              <div className="relative overflow-hidden">
                <div
                  className={`relative aspect-[3/4] ${item.image ? "bg-navy" : `bg-gradient-to-br ${item.gradient}`} p-6 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06]`}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  {item.image && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />}
                  {/* Stylized book spine line */}
                  <div className="absolute inset-y-0 left-3 w-px bg-white/15" />
                  <div className="absolute inset-x-6 top-6 font-accent text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
                    American Writers Hub
                  </div>
                  <div className="absolute inset-x-6 bottom-6">
                    <p className="font-display text-2xl font-bold leading-tight text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs italic text-white/70">{item.genre}</p>
                  </div>

                  {/* Frosted glass tag */}
                  <span
                    className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white"
                    style={{
                      background: "rgba(255,255,255,0.18)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                {/* Sliding overlay */}
                <div
                  className="absolute inset-x-0 bottom-0 flex h-0 flex-col items-center justify-center overflow-hidden p-6 text-center transition-[height] duration-500 ease-out group-hover:h-full"
                  style={{
                    background: "rgba(11,31,75,0.88)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  <p className="font-display text-xl font-bold text-white">{item.title}</p>
                  <p className="mt-1 text-sm italic text-white/70">{item.genre}</p>
                  <button className="btn-uppercase mt-5 inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-2 text-[10px] text-white">
                    View Details <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4">
                <span className="font-accent text-[10px] font-semibold uppercase tracking-widest text-brand-red">
                  {item.category}
                </span>
                <span className="text-xs italic text-navy/55">{item.genre}</span>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
