import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  variant?: "light" | "dark";
  align?: "center" | "left";
};

/**
 * Standardized section title with eyebrow label, animated underline that
 * draws from 0 → 60px on viewport entry, and optional subtitle.
 */
export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  variant = "light",
  align = "center",
}: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "-80px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const titleColor = variant === "light" ? "text-navy" : "text-white";
  const subColor = variant === "light" ? "text-navy/65" : "text-white/70";
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  const titleClass = `${
    align === "left" ? "left-bar" : ""
  } section-title ${inView ? "in-view" : ""} font-display font-bold ${titleColor} text-balance text-4xl md:text-5xl lg:text-[56px] leading-[1.05]`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className={`max-w-3xl ${alignCls}`}
    >
      {eyebrow && (
        <span className="label-eyebrow text-brand-red">{eyebrow}</span>
      )}
      <h2 ref={ref} className={`mt-3 ${titleClass}`}>
        {title}
      </h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className={`mt-5 text-lg ${subColor}`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
