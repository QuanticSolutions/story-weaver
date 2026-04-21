import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";

export type StickyContent = {
  title: string;
  description: string;
  content: React.ReactNode;
};

const backgroundColors = ["#0B1F4B", "#060F26", "#0f172a"];
const linearGradients = [
  "linear-gradient(to bottom right, #0B1F4B, #8B1A2B)",
  "linear-gradient(to bottom right, #8B1A2B, #0B1F4B)",
  "linear-gradient(to bottom right, #0B1F4B, #1a3a7a)",
];

export function StickyScroll({
  content,
  contentClassName,
}: {
  content: StickyContent[];
  contentClassName?: string;
}) {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const [bgGradient, setBgGradient] = useState(linearGradients[0]);
  useEffect(() => {
    setBgGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      transition={{ duration: 0.6 }}
      className="relative flex h-[30rem] justify-center space-x-10 overflow-y-auto rounded-2xl p-10 scrollbar-hide"
      ref={ref}
    >
      <div className="div relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}
                className="font-serif text-3xl font-bold text-white md:text-4xl"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}
                className="mt-4 max-w-sm text-white/70"
                style={{ fontFamily: '"Lato", sans-serif' }}
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <motion.div
        animate={{ background: bgGradient }}
        transition={{ duration: 0.6 }}
        className={cn(
          "sticky top-10 hidden h-72 w-96 overflow-hidden rounded-xl shadow-2xl lg:block",
          contentClassName
        )}
      >
        {content[activeCard]?.content ?? null}
      </motion.div>
    </motion.div>
  );
}
