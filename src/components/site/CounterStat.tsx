import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

type Props = {
  to: number;
  suffix?: string;
  label: string;
  duration?: number;
};

export function CounterStat({ to, suffix = "+", label, duration = 1.6 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-5xl font-bold text-white md:text-6xl">
        {val.toLocaleString()}
        <span
          className={`ml-1 text-brand-red transition-opacity duration-300 ${
            done ? "opacity-100" : "opacity-0"
          }`}
        >
          {suffix}
        </span>
      </div>
      <div className="label-eyebrow mt-2 text-white/70">{label}</div>
    </div>
  );
}
