import { motion } from "framer-motion";
import { CheckCircle, ShieldCheck, Clock, Award } from "lucide-react";
import { LeadForm } from "./LeadForm";
import { FloatingOrbs } from "./FloatingOrbs";

export function MidLeadCTA() {
  return (
    <section className="grain-overlay relative overflow-hidden bg-brand-red py-20">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.42 0.13 22) 0%, oklch(0.32 0.12 18) 100%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-4 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl font-bold text-balance text-white md:text-5xl">
            Ready to Start Your Publishing Journey?
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              "Free consultation with no obligations",
              "Confidential — NDA signed before we begin",
              "Dedicated project manager from day one",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-white/90">
                <CheckCircle className="mt-0.5 size-5 shrink-0 text-white" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <LeadForm variant="light" title="Talk to a Publishing Consultant" />
        </motion.div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24" style={{
      background: "linear-gradient(180deg, oklch(0.22 0.07 265) 0%, oklch(0.1 0.05 265) 100%)",
    }}>
      <FloatingOrbs />
      <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl font-bold text-balance text-white md:text-5xl">
            Your Book Won't Write Itself — But We Can Help.
          </h2>
          <p className="mt-4 text-white/70">
            Join over 1,200 authors who trusted American Writers Hub to take their story to the world.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-10 max-w-xl"
        >
          <LeadForm variant="dark" />
        </motion.div>

        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-white/70">
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-brand-red" /> 100% Confidential
          </span>
          <span className="flex items-center gap-2">
            <Clock className="size-4 text-brand-red" /> Response Within 24 Hours
          </span>
          <span className="flex items-center gap-2">
            <Award className="size-4 text-brand-red" /> Published on 200+ Platforms
          </span>
        </div>
      </div>
    </section>
  );
}
