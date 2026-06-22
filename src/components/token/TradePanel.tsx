"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Settings2, ExternalLink, Loader2, CheckCircle2, FlaskConical } from "lucide-react";
import { SOL_USD_PRICE } from "@/lib/market";
import { swap } from "@/lib/solana";
import { pumpFunCoinUrl } from "@/lib/pumpfun";
import { formatCompact } from "@/lib/utils";
import type { TokenMarket } from "@/lib/market";

const BUY_PRESETS = [0.1, 0.5, 1, 5];
const SELL_PRESETS = [25, 50, 75, 100]; // % of balance

export function TradePanel({ market }: { market: TokenMarket }) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<{ filled: number; sig: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const amt = parseFloat(amount) || 0;
  const estTokens = side === "buy" ? (amt * SOL_USD_PRICE) / market.price : 0;
  const estSol = side === "sell" ? (amt * market.price) / SOL_USD_PRICE : 0;

  const tradeUrl = pumpFunCoinUrl(market.mint);

  async function demoTrade() {
    setError(null);
    setDone(null);
    setPending(true);
    try {
      const res = await swap({
        mint: market.mint,
        side,
        amount: amt,
        price: market.price,
        wallet: "DEMO",
      });
      setDone({ filled: res.filled, sig: res.signature });
      setAmount("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Trade failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-2xl glass-strong p-5">
      {/* Demo badge */}
      <div className="mb-3 flex items-center gap-1.5 rounded-lg bg-joy-100 px-2.5 py-1.5 text-xs font-semibold text-joy-800">
        <FlaskConical className="h-3.5 w-3.5" />
        Demo mode — try trading without a wallet
      </div>

      {/* Buy / Sell toggle */}
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-purple-50 p-1">
        {(["buy", "sell"] as const).map((s) => (
          <button
            key={s}
            onClick={() => {
              setSide(s);
              setAmount("");
              setDone(null);
            }}
            className={`rounded-lg py-2 text-sm font-bold capitalize transition ${
              side === s
                ? s === "buy"
                  ? "bg-emerald-500 text-white shadow"
                  : "bg-rose-500 text-white shadow"
                : "text-muted hover:text-ink"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Settings */}
      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span>{side === "buy" ? "Amount in SOL" : `Amount in ${market.symbol}`}</span>
        <button
          onClick={() => setShowSettings((v) => !v)}
          className="inline-flex items-center gap-1 hover:text-purple-700"
        >
          <Settings2 className="h-3.5 w-3.5" /> {slippage}% slippage
        </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 flex gap-1">
              {[0.5, 1, 2, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSlippage(s)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                    slippage === s ? "bg-purple-600 text-white" : "bg-purple-50 text-muted"
                  }`}
                >
                  {s}%
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Amount input */}
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-purple-100 bg-white/70 px-3 py-2.5">
        <input
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full bg-transparent text-lg font-semibold outline-none"
        />
        <span className="text-sm font-bold text-muted">
          {side === "buy" ? "SOL" : market.symbol}
        </span>
      </div>

      {/* Presets */}
      <div className="mt-2 flex gap-1">
        {(side === "buy" ? BUY_PRESETS : SELL_PRESETS).map((p) => (
          <button
            key={p}
            onClick={() => setAmount(String(p))}
            className="flex-1 rounded-lg bg-purple-50 py-1.5 text-xs font-semibold text-purple-700 transition hover:bg-purple-100"
          >
            {side === "buy" ? `${p} SOL` : `${p}%`}
          </button>
        ))}
      </div>

      {/* Estimate */}
      {amt > 0 && (
        <p className="mt-3 text-center text-xs text-muted">
          ≈ {side === "buy" ? formatCompact(estTokens) : estSol.toFixed(4)}{" "}
          {side === "buy" ? market.symbol : "SOL"} received
        </p>
      )}

      {/* Primary: demo trade (no wallet) */}
      <button
        onClick={demoTrade}
        disabled={pending || amt <= 0}
        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
          side === "buy" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600"
        }`}
      >
        {pending ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Simulating…</>
        ) : (
          `Demo ${side === "buy" ? "buy" : "sell"} ${market.symbol}`
        )}
      </button>

      {/* Secondary: real trade on pump.fun */}
      <a
        href={tradeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-purple-200 bg-white/70 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-white"
      >
        Trade for real on Pump.fun
        <ExternalLink className="h-3.5 w-3.5" />
      </a>

      {error && <p className="mt-2 text-center text-xs text-rose-600">{error}</p>}

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>
              Demo filled {formatCompact(done.filled)} {side === "buy" ? market.symbol : "SOL"} · sim tx{" "}
              {done.sig.slice(0, 8)}…
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
