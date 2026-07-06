"use client";

import { motion } from "framer-motion";
import { Hammer, BadgeCheck, Rocket, TrendingUp } from "lucide-react";
import { Section } from "@/components/ui/Section";

const STEPS = [
  {
    n: "01",
    title: "Build",
    desc: "Ship your website, whitepaper, demo and public repo. Real artifacts, not promises.",
    Icon: Hammer,
    tone: "from-purple-500 to-purple-700",
  },
  {
    n: "02",
    title: "Prove",
    desc: "Submit proof for each milestone. Verification by the DAO, audits and on-chain checks.",
    Icon: BadgeCheck,
    tone: "from-purple-400 to-purple-600",
  },
  {
    n: "03",
    title: "Launch",
    desc: "Hit the Work Score threshold to unlock the Launch Arena and deploy your token.",
    Icon: Rocket,
    tone: "from-joy-400 to-joy-600",
  },
  {
    n: "04",
    title: "Scale",
    desc: "Grow reputation, raise capital and earn community trust through transparent execution.",
    Icon: TrendingUp,
    tone: "from-purple-500 to-joy-500",
  },
];

export function HowItWorks() {
  return (
    <Section
      id="how"
      eyebrow="How it works"
      title="Four steps from idea to launch"
      subtitle="A progression system — like leveling up — where the only currency is verifiable work."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-2xl glass-strong p-6"
          >
            <span className="absolute -right-3 -top-2 font-display text-7xl font-extrabold text-purple-300/20">
              {s.n}
            </span>
            <div className={`relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${s.tone} text-white shadow-glow`}>
              <s.Icon className="h-6 w-6" />
            </div>
            <h3 className="relative mt-4 font-display text-xl font-bold">{s.title}</h3>
            <p className="relative mt-2 text-sm text-muted">{s.desc}</p>
            {i < STEPS.length - 1 && (
              <div className="absolute right-0 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-purple-200 lg:block" />
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
