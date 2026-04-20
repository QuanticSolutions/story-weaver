import { motion } from "framer-motion";

export function FloatingOrbs({ variant = "navy" }: { variant?: "navy" | "light" }) {
  const colors =
    variant === "navy"
      ? ["bg-brand-red/40", "bg-navy/60", "bg-gold/30"]
      : ["bg-brand-red/15", "bg-navy/15", "bg-gold/15"];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className={`absolute -top-32 -left-32 size-[420px] rounded-full ${colors[0]}`}
        style={{ filter: "blur(120px)", opacity: 0.5 }}
        animate={{ x: [0, 80, -40, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.div
        className={`absolute top-1/3 -right-40 size-[520px] rounded-full ${colors[1]}`}
        style={{ filter: "blur(140px)", opacity: 0.45 }}
        animate={{ x: [0, -60, 40, 0], y: [0, 60, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.div
        className={`absolute bottom-0 left-1/3 size-[380px] rounded-full ${colors[2]}`}
        style={{ filter: "blur(120px)", opacity: 0.35 }}
        animate={{ x: [0, 40, -50, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
    </div>
  );
}
