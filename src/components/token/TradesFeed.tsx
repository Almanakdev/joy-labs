"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Trade } from "@/lib/market";
import { SOL_USD_PRICE } from "@/lib/market";
import { formatCompact } from "@/lib/utils";

function age(s: number): string {
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}h`;
}

function randAccount(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
  const part = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${part(4)}…${part(4)}`;
}

export function TradesFeed({
  trades: initial,
  symbol,
  price,
}: {
  trades: Trade[];
  symbol: string;
  price: number;
}) {
  const [trades, setTrades] = useState<Trade[]>(initial);

  useEffect(() => {
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      const isBuy = Math.random() > 0.45;
      const sol = Math.round((0.05 + Math.random() * 12) * 100) / 100;
      const fresh: Trade = {
        id: `live-${Date.now()}-${n}`,
        type: isBuy ? "buy" : "sell",
        sol,
        tokens: Math.round((sol * SOL_USD_PRICE) / price),
        account: randAccount(),
        ageSec: 0,
      };
      setTrades((prev) => [fresh, ...prev].slice(0, 20));
    }, 2500);
    return () => clearInterval(id);
  }, [price]);

  return (
    <div className="rounded-2xl glass-strong p-4">
      <h3 className="mb-3 px-1 font-semibold">Recent trades</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-2 py-2 font-medium">Type</th>
              <th className="px-2 py-2 font-medium">SOL</th>
              <th className="px-2 py-2 font-medium">{symbol}</th>
              <th className="px-2 py-2 font-medium">Trader</th>
              <th className="px-2 py-2 text-right font-medium">Age</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {trades.map((t) => (
                <motion.tr
                  key={t.id}
                  layout
                  initial={{ opacity: 0, backgroundColor: t.type === "buy" ? "#d1fae5" : "#ffe4e6" }}
                  animate={{ opacity: 1, backgroundColor: "rgba(0,0,0,0)" }}
                  transition={{ duration: 0.6 }}
                  className="border-t border-purple-50"
                >
                  <td className="px-2 py-2">
                    <span
                      className={`font-semibold ${
                        t.type === "buy" ? "text-emerald-600" : "text-rose-500"
                      }`}
                    >
                      {t.type === "buy" ? "Buy" : "Sell"}
                    </span>
                  </td>
                  <td className="px-2 py-2 font-mono">{t.sol.toFixed(2)}</td>
                  <td className="px-2 py-2 font-mono">{formatCompact(t.tokens)}</td>
                  <td className="px-2 py-2 font-mono text-muted">{t.account}</td>
                  <td className="px-2 py-2 text-right text-muted">{age(t.ageSec)}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
