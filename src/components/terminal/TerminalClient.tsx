"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  TerminalSquare,
  Sparkles,
  Rocket,
  BadgeCheck,
  Zap,
  TrendingUp,
  TrendingDown,
  Star,
  Keyboard,
  Users,
  Activity,
  Search,
} from "lucide-react";
import { ProjectLogo } from "@/components/ui/ProjectLogo";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { formatCompact } from "@/lib/utils";
import { playBuy, playSell } from "@/lib/sound";
import { TERMINAL_TOKENS, type TerminalToken, type TerminalCategory } from "@/lib/terminal";

const QUICK_BUYS = [0.5, 1, 2, 5];

interface Position {
  id: string;
  slug: string;
  symbol: string;
  name: string;
  sizeSol: number;
  entryMcap: number;
  mult: number;
}
interface Toast {
  id: string;
  text: string;
  tone: "buy" | "sell";
}

type ColKey = TerminalCategory | "watch";

const COLS: { key: ColKey; label: string; Icon: typeof Rocket; accent: string }[] = [
  { key: "new", label: "New", Icon: Sparkles, accent: "text-joy-300" },
  { key: "graduating", label: "Soon", Icon: Rocket, accent: "text-[#c9a3ff]" },
  { key: "graduated", label: "Migrated", Icon: BadgeCheck, accent: "text-emerald-300" },
  { key: "watch", label: "Watchlist", Icon: Star, accent: "text-joy-300" },
];

const usd = (n: number) => `$${formatCompact(n)}`;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const riskCol = (v: number, warn: number, bad: number) =>
  v >= bad ? "text-rose-400" : v >= warn ? "text-amber-300" : "text-emerald-400";
function ageLabel(s: number) {
  if (s < 60) return `${Math.floor(s)}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

const ORDERED = [...TERMINAL_TOKENS].sort((a, b) => b.volume - a.volume);

export function TerminalClient() {
  const router = useRouter();
  const [tokens, setTokens] = useState<TerminalToken[]>(ORDERED);
  const [quick, setQuick] = useState(1);
  const [balance, setBalance] = useState(100);
  const [positions, setPositions] = useState<Position[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [clock, setClock] = useState("");
  const [colQuery, setColQuery] = useState<Record<string, string>>({});
  const [watch, setWatch] = useState<string[]>([]);
  const [focus, setFocus] = useState({ col: 0, row: 0 });

  const columns = useMemo(() => {
    const match = (t: TerminalToken, key: string) => {
      const q = (colQuery[key] || "").trim().toLowerCase();
      return !q || t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q);
    };
    return COLS.map((c) => ({
      ...c,
      items: tokens.filter((t) =>
        c.key === "watch" ? watch.includes(t.slug) && match(t, "watch") : t.category === c.key && match(t, c.key)
      ),
    }));
  }, [tokens, colQuery, watch]);

  const ref = useRef({ columns, focus, quick, balance });
  ref.current = { columns, focus, quick, balance };

  function pushToast(text: string, tone: "buy" | "sell") {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((p) => [...p, { id, text, tone }].slice(-4));
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 2600);
  }
  function buyToken(t: TerminalToken) {
    const q = ref.current.quick;
    if (ref.current.balance < q) return pushToast("Insufficient demo balance", "sell");
    setBalance((b) => Math.round((b - q) * 100) / 100);
    setPositions((prev) => [
      { id: `${t.slug}-${Date.now()}`, slug: t.slug, symbol: t.symbol, name: t.name, sizeSol: q, entryMcap: t.marketCap, mult: 1 },
      ...prev,
    ]);
    playBuy();
    pushToast(`Bought ${q} ◎ of $${t.symbol}`, "buy");
  }
  function sell(p: Position) {
    const value = Math.round(p.sizeSol * p.mult * 100) / 100;
    setBalance((b) => Math.round((b + value) * 100) / 100);
    setPositions((prev) => prev.filter((x) => x.id !== p.id));
    playSell();
    pushToast(`Sold $${p.symbol} for ${value} ◎`, "sell");
  }
  function toggleWatch(slug: string) {
    setWatch((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }
  function moveFocus(dCol: number, dRow: number) {
    const cols = ref.current.columns;
    let { col, row } = ref.current.focus;
    if (dCol) {
      col = clamp(col + dCol, 0, cols.length - 1);
      row = clamp(row, 0, Math.max(0, cols[col].items.length - 1));
    }
    if (dRow) {
      const len = cols[col].items.length;
      if (len) row = clamp(row + dRow, 0, len - 1);
    }
    setFocus({ col, row });
    requestAnimationFrame(() =>
      document.getElementById(`row-${col}-${row}`)?.scrollIntoView({ block: "nearest" })
    );
  }
  function focusedToken() {
    const { columns: cols, focus: f } = ref.current;
    return cols[f.col]?.items[f.row];
  }

  useEffect(() => {
    const t = setInterval(() => setClock(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTokens((prev) =>
        prev.map((t) => {
          const drift = (Math.random() - 0.45) * 6;
          const mcMult = 1 + (Math.random() - 0.48) * 0.04;
          return {
            ...t,
            ageSec: t.ageSec + 1.5,
            priceChange: Math.round((t.priceChange + drift) * 10) / 10,
            marketCap: Math.max(2000, Math.round(t.marketCap * mcMult)),
            volume: Math.max(500, Math.round(t.volume * (1 + (Math.random() - 0.4) * 0.1))),
            txns: t.txns + Math.floor(Math.random() * 4),
          };
        })
      );
      setPositions((prev) =>
        prev.map((p) => ({ ...p, mult: Math.max(0.15, p.mult * (1 + (Math.random() - 0.47) * 0.05)) }))
      );
    }, 1500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement;
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        if (e.key === "Escape") el.blur();
        return;
      }
      if (e.key >= "1" && e.key <= "4") return setQuick(QUICK_BUYS[Number(e.key) - 1]);
      switch (e.key) {
        case "ArrowDown":
        case "j":
          e.preventDefault();
          return moveFocus(0, 1);
        case "ArrowUp":
        case "k":
          e.preventDefault();
          return moveFocus(0, -1);
        case "ArrowRight":
        case "l":
          e.preventDefault();
          return moveFocus(1, 0);
        case "ArrowLeft":
        case "h":
          e.preventDefault();
          return moveFocus(-1, 0);
        case "b":
        case "B": {
          const t = focusedToken();
          if (t) buyToken(t);
          return;
        }
        case "w":
        case "W": {
          const t = focusedToken();
          if (t) toggleWatch(t.slug);
          return;
        }
        case "Enter": {
          const t = focusedToken();
          if (t) router.push(`/token/${t.slug}`);
          return;
        }
        case "/": {
          e.preventDefault();
          const key = ref.current.columns[ref.current.focus.col]?.key;
          document.getElementById(`search-${key}`)?.focus();
          return;
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen bg-[#140826] text-[#ece7f7]">
      {/* ambient purple glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(60rem_40rem_at_20%_-10%,rgba(124,71,245,0.25),transparent_60%),radial-gradient(50rem_40rem_at_100%_0%,rgba(214,110,255,0.18),transparent_55%)]" />

      <div className="relative mx-auto max-w-[1600px] px-3 py-4 sm:px-4">
        {/* Top bar */}
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-[#3a2560] bg-[#1d1138]/80 px-4 py-3 backdrop-blur">
          <Link href="/" className="flex items-center gap-2" title="Back to Joy Labs">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-purple-600 text-white shadow-[0_0_18px_rgba(124,71,245,0.6)]">
              <TerminalSquare className="h-4 w-4" />
            </span>
            <div>
              <div className="font-display text-sm font-bold leading-none">
                <span className="text-joy-300">Hyper</span>Joy
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#9a8cc4]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Live · <span suppressHydrationWarning>{clock || "—"}</span>
              </div>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1 text-xs text-[#9a8cc4] sm:flex">
              <Zap className="h-3.5 w-3.5 text-joy-300" /> Buy
            </span>
            <div className="flex rounded-lg border border-[#3a2560] bg-[#140826] p-0.5">
              {QUICK_BUYS.map((q, i) => (
                <button
                  key={q}
                  onClick={() => setQuick(q)}
                  title={`Hotkey ${i + 1}`}
                  className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${
                    quick === q ? "bg-purple-600 text-white" : "text-[#9a8cc4] hover:text-white"
                  }`}
                >
                  {q}◎
                </button>
              ))}
            </div>
            <div className="rounded-lg border border-[#3a2560] bg-[#140826] px-3 py-1.5 text-xs">
              <span className="text-[#9a8cc4]">Bal </span>
              <span className="font-bold text-joy-300">{balance}◎</span>
            </div>
            <SoundToggle className="rounded-lg border border-[#3a2560] bg-[#140826] p-2 text-[#9a8cc4] transition hover:text-white" />
          </div>
        </div>

        {/* Hotkey legend */}
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-[11px] text-[#7c6ca6]">
          <span className="flex items-center gap-1 font-semibold text-[#9a8cc4]">
            <Keyboard className="h-3.5 w-3.5" /> Hotkeys
          </span>
          <Kbd>1–4</Kbd> size <Kbd>↑↓</Kbd> move <Kbd>← →</Kbd> column <Kbd>B</Kbd> buy <Kbd>W</Kbd> watch <Kbd>↵</Kbd> open <Kbd>/</Kbd> search
        </div>

        {/* Columns */}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((col, ci) => (
            <div key={col.key} className="rounded-xl border border-[#3a2560] bg-[#1a0f33]/80 backdrop-blur">
              <div className="flex items-center gap-2 border-b border-[#33205e] px-3 py-2.5">
                <col.Icon className={`h-4 w-4 ${col.accent}`} />
                <span className="font-semibold">{col.label}</span>
                <span className="rounded-md bg-[#140826] px-1.5 py-0.5 text-[10px] text-[#9a8cc4]">
                  {col.items.length}
                </span>
                <div className="relative ml-auto">
                  <Search className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#6f5f99]" />
                  <input
                    id={`search-${col.key}`}
                    value={colQuery[col.key] || ""}
                    onChange={(e) => setColQuery((p) => ({ ...p, [col.key]: e.target.value }))}
                    placeholder="Search"
                    className="w-24 rounded-md border border-[#33205e] bg-[#140826] py-1 pl-6 pr-2 text-xs text-white outline-none transition focus:w-36 focus:border-purple-500 placeholder:text-[#6f5f99]"
                  />
                </div>
              </div>

              <div className="max-h-[64vh] divide-y divide-[#241546] overflow-y-auto no-scrollbar">
                {col.items.length === 0 ? (
                  <div className="px-3 py-8 text-center text-xs text-[#6f5f99]">
                    {col.key === "watch" ? "Press W on a token to add it." : "No tokens."}
                  </div>
                ) : (
                  col.items.map((t, ri) => (
                    <Row
                      key={t.slug}
                      id={`row-${ci}-${ri}`}
                      t={t}
                      quick={quick}
                      focused={focus.col === ci && focus.row === ri}
                      watched={watch.includes(t.slug)}
                      onFocus={() => setFocus({ col: ci, row: ri })}
                      onOpen={() => router.push(`/token/${t.slug}`)}
                      onBuy={() => buyToken(t)}
                      onWatch={() => toggleWatch(t.slug)}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Positions */}
        <div className="mt-3 rounded-xl border border-[#3a2560] bg-[#1a0f33]/80 backdrop-blur">
          <div className="flex items-center justify-between border-b border-[#33205e] px-3 py-2.5">
            <div className="flex items-center gap-2 font-semibold">
              <TrendingUp className="h-4 w-4 text-[#c9a3ff]" /> Positions
            </div>
            <span className="text-xs text-[#9a8cc4]">{positions.length} open</span>
          </div>
          {positions.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[#9a8cc4]">
              No open positions — press <span className="font-bold text-joy-300">B</span> or tap a buy pill (demo).
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-[#9a8cc4]">
                    <th className="px-3 py-2 font-medium">Token</th>
                    <th className="px-3 py-2 font-medium">Size</th>
                    <th className="px-3 py-2 font-medium">Entry MC</th>
                    <th className="px-3 py-2 font-medium">Now MC</th>
                    <th className="px-3 py-2 font-medium">PnL</th>
                    <th className="px-3 py-2 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((p) => {
                    const pnl = (p.mult - 1) * 100;
                    const green = pnl >= 0;
                    return (
                      <tr key={p.id} className="border-t border-[#241546]">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <ProjectLogo name={p.name} seed={p.slug} size={24} rounded="rounded-md" />
                            <span className="font-semibold">${p.symbol}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 font-mono">{p.sizeSol}◎</td>
                        <td className="px-3 py-2 font-mono text-[#9a8cc4]">{usd(p.entryMcap)}</td>
                        <td className="px-3 py-2 font-mono">{usd(p.entryMcap * p.mult)}</td>
                        <td className={`px-3 py-2 font-mono font-bold ${green ? "text-emerald-400" : "text-rose-400"}`}>
                          {green ? "+" : ""}
                          {pnl.toFixed(1)}%
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() => sell(p)}
                            className="rounded-md bg-rose-500/90 px-3 py-1 text-xs font-bold text-white transition hover:bg-rose-500"
                          >
                            Sell
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Toasts */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold shadow-lg ${
                t.tone === "buy"
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                  : "border-rose-500/40 bg-rose-500/15 text-rose-300"
              }`}
            >
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-[#3a2560] bg-[#140826] px-1.5 py-0.5 font-mono text-[10px] text-[#c9c2ea]">
      {children}
    </kbd>
  );
}

function Row({
  id,
  t,
  quick,
  focused,
  watched,
  onFocus,
  onOpen,
  onBuy,
  onWatch,
}: {
  id: string;
  t: TerminalToken;
  quick: number;
  focused: boolean;
  watched: boolean;
  onFocus: () => void;
  onOpen: () => void;
  onBuy: () => void;
  onWatch: () => void;
}) {
  const up = t.priceChange >= 0;
  return (
    <div
      id={id}
      onClick={onOpen}
      onMouseEnter={onFocus}
      className={`group flex cursor-pointer gap-2.5 px-2.5 py-2 transition ${
        focused ? "bg-[#2b1a52] ring-1 ring-inset ring-purple-500/70" : "hover:bg-[#241443]"
      }`}
    >
      {/* logo with badge */}
      <div className="relative shrink-0 self-center">
        <ProjectLogo name={t.name} seed={t.slug} size={44} rounded="rounded-xl" className="ring-2 ring-[#3a2560]" />
        <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-[#1a0f33]">
          <span className="h-2 w-2 rounded-full bg-joy-300" />
        </span>
      </div>

      {/* middle */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-bold text-white">{t.symbol}</span>
          <span className="truncate text-xs text-[#9a8cc4]">{t.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatch();
            }}
            title="Watch (W)"
            className={`shrink-0 transition ${watched ? "text-joy-300" : "text-[#4d4676] hover:text-[#9a8cc4]"}`}
          >
            <Star className="h-3 w-3" fill={watched ? "currentColor" : "none"} />
          </button>
          <span className="ml-auto text-[10px] font-medium text-emerald-300">{ageLabel(t.ageSec)}</span>
        </div>

        <div className="mt-1 flex items-center gap-2 text-[10px] text-[#7c6ca6]">
          <span className="flex items-center gap-0.5">
            <Users className="h-2.5 w-2.5" />
            {formatCompact(t.holders)}
          </span>
          <span className="flex items-center gap-0.5">
            <Activity className="h-2.5 w-2.5" />
            {t.txns}
          </span>
          <span>
            Dev <b className={riskCol(t.dev, 4, 7)}>{t.dev}%</b>
          </span>
          <span>
            T10 <b className={riskCol(t.top10, 30, 50)}>{t.top10}%</b>
          </span>
          <span className={`ml-auto flex items-center gap-0.5 font-bold ${up ? "text-emerald-400" : "text-rose-400"}`}>
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {up ? "+" : ""}
            {t.priceChange.toFixed(0)}%
          </span>
        </div>

        {t.category !== "graduated" && (
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#241546]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-joy-300"
              style={{ width: `${t.bondingProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* right: MC / V / buy */}
      <div className="flex shrink-0 flex-col items-end justify-center gap-0.5 pl-1">
        <div className="whitespace-nowrap text-[10px] text-[#6f5f99]">
          MC <span className="font-bold text-emerald-300">{usd(t.marketCap)}</span>
        </div>
        <div className="whitespace-nowrap text-[10px] text-[#6f5f99]">
          V <span className="font-bold text-[#8ec5ff]">{usd(t.volume)}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBuy();
          }}
          className="mt-1 flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white transition hover:bg-emerald-400"
        >
          <Zap className="h-3 w-3" /> {quick}◎
        </button>
      </div>
    </div>
  );
}
