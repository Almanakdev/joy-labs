"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  Vote,
  ShieldCheck,
  GitBranch,
  ScanLine,
  Sparkles,
  Award,
  Coins,
} from "lucide-react";
import { Section } from "@/components/ui/Section";

const FEATURES = [
  { Icon: Wallet, title: "Wallet connection", desc: "Phantom & Solflare via Solana Wallet Adapter." },
  { Icon: Coins, title: "Pump.fun-style launch", desc: "One-click SPL token + bonding-curve deploy, gated by Work Score." },
  { Icon: Vote, title: "Community voting", desc: "Token-weighted votes shape which projects launch." },
  { Icon: Award, title: "Builder reputation", desc: "On-chain history compounds into a portable rep score." },
  { Icon: ShieldCheck, title: "Anti-rug credibility", desc: "Renounced authorities & locked liquidity raise your score." },
  { Icon: GitBranch, title: "Open-source verification", desc: "Public repos with real commit history are verified." },
  { Icon: ScanLine, title: "Smart contract scanner", desc: "Automated bytecode heuristics flag risky programs." },
  { Icon: Sparkles, title: "AI project review", desc: "LLM-generated credibility assessment per project." },
];

export function Features() {
  return (
    <Section
      eyebrow="Built for trust"
      title="Everything stacked toward credibility"
      subtitle="A full toolkit so the work — not the marketing — decides who launches."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="glass rounded-2xl p-5 transition hover:shadow-glow"
          >
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-purple-100 text-purple-700">
              <f.Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
