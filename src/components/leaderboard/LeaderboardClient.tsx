"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Crown, Trophy, Medal, Search, Hammer, Coins, ExternalLink } from "lucide-react";
import { LEADERBOARD } from "@/lib/mock-data";
import { getTopCoins, type TopCoin } from "@/lib/market";
import { pumpFunCoinUrl } from "@/lib/pumpfun";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Pill } from "@/components/ui/Badge";
import { ProjectLogo } from "@/components/ui/ProjectLogo";
import { formatCompact, cn } from "@/lib/utils";
import type { Project } from "@/types";

type Tab = "builders" | "coins";
type BuilderSort = "workScore" | "credibility" | "progress";
type CoinSort = "marketCap" | "volume" | "change";

const STAGE_TONE: Record<Project["stage"], "purple" | "joy" | "green" | "neutral"> = {
  BUILDING: "purple",
  PROVING: "purple",
  ELIGIBLE: "green",
  LAUNCHING: "joy",
  LAUNCHED: "neutral",
};

const RANK_ICON = [Crown, Trophy, Medal];
const usd = (n: number) => `$${formatCompact(n)}`;

export function LeaderboardClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("builders");
  const [q, setQ] = useState("");
  const [builderSort, setBuilderSort] = useState<BuilderSort>("workScore");
  const [coinSort, setCoinSort] = useState<CoinSort>("marketCap");

  const [coins, setCoins] = useState<TopCoin[]>(() => getTopCoins());

  // Live market ticking (client-only so SSR/first render stays deterministic).
  useEffect(() => {
    const id = setInterval(() => {
      setCoins((prev) =>
        prev.map((c) => {
          const mcMult = 1 + (Math.random() - 0.48) * 0.03;
          const drift = (Math.random() - 0.47) * 5;
          return {
            ...c,
            marketCap: Math.max(2000, Math.round(c.marketCap * mcMult)),
            volume: Math.max(500, Math.round(c.volume * (1 + (Math.random() - 0.4) * 0.1))),
            change: Math.round((c.change + drift) * 10) / 10,
          };
        })
      );
    }, 1600);
    return () => clearInterval(id);
  }, []);

  const builderRows = LEADERBOARD.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  ).sort((a, b) => b[builderSort] - a[builderSort]);

  const coinRows = coins
    .filter(
      (c) =>
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.symbol.toLowerCase().includes(q.toLowerCase())
    )
    .sort((a, b) => b[coinSort] - a[coinSort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        <span className="chip bg-purple-100 text-purple-700">Global ranking</span>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">Leaderboard</h1>
        <p className="mt-2 text-muted">Ranked by verifiable work — or by market, pump.fun style.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-purple-100 bg-white/70 p-1">
          <TabBtn active={tab === "builders"} onClick={() => setTab("builders")} Icon={Hammer}>
            Top Builders
          </TabBtn>
          <TabBtn active={tab === "coins"} onClick={() => setTab("coins")} Icon={Coins}>
            Top Coins
          </TabBtn>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="rounded-xl border border-purple-100 bg-white/80 py-2 pl-9 pr-3 text-sm outline-none focus:border-purple-300"
            />
          </div>
          {tab === "builders" ? (
            <SortGroup
              value={builderSort}
              onChange={(v) => setBuilderSort(v as BuilderSort)}
              options={[
                ["workScore", "Score"],
                ["credibility", "Credibility"],
                ["progress", "Progress"],
              ]}
            />
          ) : (
            <SortGroup
              value={coinSort}
              onChange={(v) => setCoinSort(v as CoinSort)}
              options={[
                ["marketCap", "Market cap"],
                ["volume", "Volume"],
                ["change", "24h %"],
              ]}
            />
          )}
        </div>
      </div>

      {/* BUILDERS TABLE */}
      {tab === "builders" && (
        <div className="overflow-hidden rounded-2xl glass-strong">
          <div className="grid grid-cols-12 gap-2 border-b border-purple-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
            <div className="col-span-1">#</div>
            <div className="col-span-5 sm:col-span-4">Project</div>
            <div className="col-span-3 sm:col-span-2 text-right">Score</div>
            <div className="col-span-3 hidden sm:block sm:col-span-3">Progress</div>
            <div className="col-span-3 sm:col-span-2 text-right">Stage</div>
          </div>
          {builderRows.map((p, i) => {
            const Icon = RANK_ICON[i];
            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="grid grid-cols-12 items-center gap-2 border-b border-purple-50 px-5 py-4 hover:bg-purple-50/50"
              >
                <div className="col-span-1 flex items-center gap-1 font-mono font-bold text-purple-600">
                  {Icon ? <Icon className="h-4 w-4 text-joy-500" /> : null}
                  {i + 1}
                </div>
                <div className="col-span-5 sm:col-span-4">
                  <Link href={`/dashboard?p=${p.slug}`} className="flex items-center gap-3">
                    <ProjectLogo name={p.name} seed={p.slug} size={36} rounded="rounded-lg" />
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{p.name}</div>
                      <div className="truncate text-xs text-muted">{p.tagline}</div>
                    </div>
                  </Link>
                </div>
                <div className="col-span-3 sm:col-span-2 text-right font-display font-bold gradient-text">
                  {builderSort === "credibility" ? p.credibility : builderSort === "progress" ? `${p.progress}%` : p.workScore}
                </div>
                <div className="col-span-3 sm:col-span-3 hidden sm:block">
                  <ProgressBar value={p.progress} />
                </div>
                <div className="col-span-3 sm:col-span-2 text-right">
                  <Pill tone={STAGE_TONE[p.stage]}>{p.stage.toLowerCase()}</Pill>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* COINS TABLE (pump.fun style) */}
      {tab === "coins" && (
        <div className="overflow-hidden rounded-2xl glass-strong">
          <div className="grid grid-cols-12 gap-2 border-b border-purple-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
            <div className="col-span-1">#</div>
            <div className="col-span-4 sm:col-span-4">Coin</div>
            <div className="col-span-3 sm:col-span-2 text-right">Market cap</div>
            <div className="col-span-2 hidden text-right sm:block sm:col-span-2">Volume</div>
            <div className="col-span-2 sm:col-span-1 text-right">24h</div>
            <div className="col-span-2 sm:col-span-2 text-right">Trade</div>
          </div>
          {coinRows.map((c, i) => {
            const Icon = RANK_ICON[i];
            const up = c.change >= 0;
            return (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                onClick={() => router.push(`/token/${c.slug}`)}
                className="grid cursor-pointer grid-cols-12 items-center gap-2 border-b border-purple-50 px-5 py-4 hover:bg-purple-50/50"
              >
                <div className="col-span-1 flex items-center gap-1 font-mono font-bold text-purple-600">
                  {Icon ? <Icon className="h-4 w-4 text-joy-500" /> : null}
                  {i + 1}
                </div>
                <div className="col-span-4 sm:col-span-4">
                  <div className="flex items-center gap-3">
                    <ProjectLogo name={c.name} seed={c.slug} size={36} rounded="rounded-lg" />
                    <div className="min-w-0">
                      <div className="truncate font-semibold">${c.symbol}</div>
                      <div className="truncate text-xs text-muted">{c.name}</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-2 text-right font-display font-bold gradient-text">
                  {usd(c.marketCap)}
                </div>
                <div className="col-span-2 hidden text-right font-mono text-sm text-muted sm:block sm:col-span-2">
                  {usd(c.volume)}
                </div>
                <div
                  className={cn(
                    "col-span-2 sm:col-span-1 text-right text-sm font-bold",
                    up ? "text-emerald-600" : "text-rose-500"
                  )}
                >
                  {up ? "+" : ""}
                  {c.change.toFixed(0)}%
                </div>
                <div className="col-span-2 sm:col-span-2 flex justify-end">
                  <a
                    href={pumpFunCoinUrl(c.mint)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-600"
                  >
                    Buy <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  Icon: typeof Hammer;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition",
        active ? "bg-purple-600 text-white shadow-glow" : "text-muted hover:text-purple-700"
      )}
    >
      <Icon className="h-4 w-4" /> {children}
    </button>
  );
}

function SortGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="flex rounded-xl border border-purple-100 bg-white/70 p-1 text-sm">
      {options.map(([k, label]) => (
        <button
          key={k}
          onClick={() => onChange(k)}
          className={cn(
            "rounded-lg px-3 py-1.5 font-medium transition",
            value === k ? "bg-purple-600 text-white" : "text-muted hover:text-purple-700"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
