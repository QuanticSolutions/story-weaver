import { useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Animated background layer for light/off-white sections.
 * Renders soft outline circles, ink-blot blobs, and manuscript lines that drift
 * slowly with parallax based on page scroll. Sits behind content (z-0).
 */
export function LightSectionDecor() {
  const { scrollY } = useScroll();
  const yA = useTransform(scrollY, [0, 1500], [0, -120]);
  const yB = useTransform(scrollY, [0, 1500], [0, -180]);
  const yC = useTransform(scrollY, [0, 1500], [0, -250]);

  // Stable random delays
  const delays = useMemo(() => Array.from({ length: 20 }, () => Math.random() * 4), []);

  const circles = [
    { size: 280, top: "8%", left: "6%", border: 1 },
    { size: 140, top: "18%", left: "82%", border: 1 },
    { size: 90, top: "62%", left: "14%", border: 1 },
    { size: 200, top: "70%", left: "78%", border: 1 },
    { size: 80, top: "42%", left: "50%", border: 1 },
  ];

  const lines = [
    { top: "22%", left: "30%", rot: -3 },
    { top: "26%", left: "30%", rot: -2 },
    { top: "30%", left: "30%", rot: -4 },
    { top: "78%", left: "55%", rot: 2 },
    { top: "82%", left: "55%", rot: 3 },
    { top: "86%", left: "55%", rot: 1.5 },
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      {/* Ink-blot blobs */}
      <motion.svg
        style={{ y: yA }}
        className="absolute -left-20 top-[6%] h-[420px] w-[420px]"
        viewBox="0 0 200 200"
      >
        <motion.path
          fill="rgba(11, 31, 75, 0.04)"
          d="M40,-60C52,-50,62,-37,68,-22C73,-7,73,10,67,24C61,38,49,49,35,57C20,65,3,71,-15,69C-32,67,-50,57,-59,42C-68,28,-69,9,-66,-9C-63,-27,-56,-44,-44,-55C-31,-66,-13,-71,3,-74C19,-77,38,-70,40,-60Z"
          transform="translate(100 100)"
          animate={{ rotate: [0, 6, -4, 0] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: delays[0] }}
        />
      </motion.svg>

      <motion.svg
        style={{ y: yB }}
        className="absolute -right-24 top-[40%] h-[480px] w-[480px]"
        viewBox="0 0 200 200"
      >
        <motion.path
          fill="rgba(11, 31, 75, 0.035)"
          d="M50,-65C62,-55,68,-37,71,-19C74,0,74,18,66,33C58,48,42,60,24,67C6,74,-15,76,-32,69C-49,62,-63,46,-69,28C-75,10,-72,-10,-63,-25C-54,-40,-39,-50,-23,-60C-7,-70,10,-79,26,-79C41,-78,55,-66,50,-65Z"
          transform="translate(100 100)"
          animate={{ rotate: [0, -5, 3, 0] }}
          transition={{ duration: 22, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: delays[1] }}
        />
      </motion.svg>

      <motion.svg
        style={{ y: yC }}
        className="absolute -left-16 bottom-[4%] h-[380px] w-[380px]"
        viewBox="0 0 200 200"
      >
        <motion.path
          fill="rgba(139, 26, 43, 0.035)"
          d="M44,-58C56,-49,63,-33,67,-17C71,-1,72,16,64,28C56,40,40,47,24,55C8,63,-9,72,-25,68C-41,64,-56,47,-63,29C-70,10,-69,-10,-61,-25C-53,-40,-38,-50,-23,-58C-8,-66,7,-72,21,-71C35,-70,32,-66,44,-58Z"
          transform="translate(100 100)"
          animate={{ rotate: [0, 7, -5, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: delays[2] }}
        />
      </motion.svg>

      {/* Geometric outline circles */}
      {circles.map((c, i) => (
        <motion.div
          key={`c-${i}`}
          style={{
            width: c.size,
            height: c.size,
            top: c.top,
            left: c.left,
            borderWidth: c.border,
            y: i % 2 === 0 ? yA : yB,
          }}
          className="absolute rounded-full border-navy/[0.06]"
          animate={{ y: [-15, 15, -15], rotate: [0, 4, -4, 0] }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: delays[3 + i],
          }}
        />
      ))}

      {/* Floating book-page lines, stacked */}
      {lines.map((l, i) => (
        <motion.div
          key={`l-${i}`}
          style={{
            top: l.top,
            left: l.left,
            rotate: l.rot,
            y: i % 2 === 0 ? yB : yC,
          }}
          className="absolute h-px w-[120px] bg-brand-red/[0.05]"
          animate={{ x: [-10, 10, -10] }}
          transition={{
            duration: 14 + i,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: delays[10 + i],
          }}
        />
      ))}
    </div>
  );
}
