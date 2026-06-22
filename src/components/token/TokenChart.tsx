"use client";

import { useEffect, useRef, useState } from "react";
import type { Candle } from "@/lib/market";
import { formatUsdPrice } from "@/lib/utils";

const W = 640;
const H = 360;
const PAD_L = 8;
const PAD_R = 64;
const PAD_TOP = 16;
const PRICE_H = 244;
const VOL_TOP = PAD_TOP + PRICE_H + 14;
const VOL_H = 62;
const MAX_CANDLES = 64;

const FRAMES = ["1m", "5m", "15m", "1H", "4H"];

// Deterministic seed volume per candle (so SSR and first client render match).
function seedVol(c: Candle): number {
  return 28 + ((c.i * 53) % 44) + (c.c >= c.o ? 12 : 0);
}

export function TokenChart({ candles: initial }: { candles: Candle[] }) {
  const [frame, setFrame] = useState("5m");
  const [candles, setCandles] = useState<Candle[]>(initial);
  const [vols, setVols] = useState<number[]>(() => initial.map(seedVol));
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const tick = useRef(0);

  // Live simulation: nudge the last candle (buy/sell pressure), roll a new
  // candle every few ticks, and pump volume. Client-only -> no hydration risk.
  useEffect(() => {
    const id = setInterval(() => {
      tick.current += 1;
      const rollNew = tick.current % 6 === 0;

      setCandles((prev) => {
        const arr = prev.slice();
        const last = { ...arr[arr.length - 1] };
        const buy = Math.random() > 0.46; // slight buy bias
        const move = last.c * (0.004 + Math.random() * 0.02) * (buy ? 1 : -1);
        const next = Math.max(last.c + move, last.c * 0.6);
        last.c = next;
        last.h = Math.max(last.h, next);
        last.l = Math.min(last.l, next);
        arr[arr.length - 1] = last;
        setFlash(buy ? "up" : "down");

        if (rollNew) {
          const fresh: Candle = {
            i: last.i + 1,
            o: next,
            c: next,
            h: next * (1 + Math.random() * 0.004),
            l: next * (1 - Math.random() * 0.004),
          };
          arr.push(fresh);
          if (arr.length > MAX_CANDLES) arr.shift();
        }
        return arr;
      });

      setVols((prev) => {
        const arr = prev.slice();
        arr[arr.length - 1] = (arr[arr.length - 1] ?? 30) + Math.random() * 22;
        if (rollNew) {
          arr.push(24 + Math.random() * 40);
          if (arr.length > MAX_CANDLES) arr.shift();
        }
        return arr;
      });
    }, 900);
    return () => clearInterval(id);
  }, []);

  // clear the flash highlight shortly after each tick
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 350);
    return () => clearTimeout(t);
  }, [flash]);

  const highs = candles.map((c) => c.h);
  const lows = candles.map((c) => c.l);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const range = max - min || 1;
  const maxVol = Math.max(...vols, 1);

  const innerW = W - PAD_L - PAD_R;
  const step = innerW / candles.length;
  const cw = Math.max(2, step * 0.62);

  const y = (v: number) => PAD_TOP + PRICE_H - ((v - min) / range) * PRICE_H;
  const x = (i: number) => PAD_L + i * step + step / 2;
  const vh = (v: number) => (v / maxVol) * VOL_H;

  const last = candles[candles.length - 1];
  const liveChange = ((last.c - candles[0].c) / candles[0].c) * 100;
  const up = liveChange >= 0;
  const gridLines = 4;

  return (
    <div className="rounded-2xl glass-strong p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {FRAMES.map((f) => (
              <button
                key={f}
                onClick={() => setFrame(f)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  frame === f
                    ? "bg-purple-600 text-white"
                    : "text-muted hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="ml-1 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Live
          </span>
        </div>
        <span
          suppressHydrationWarning
          className={`text-sm font-bold ${up ? "text-emerald-600" : "text-rose-500"}`}
        >
          {up ? "▲" : "▼"} {up ? "+" : ""}
          {liveChange.toFixed(2)}%
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* price grid + axis labels */}
        {Array.from({ length: gridLines + 1 }).map((_, g) => {
          const yy = PAD_TOP + (PRICE_H / gridLines) * g;
          const price = max - (range / gridLines) * g;
          return (
            <g key={g}>
              <line x1={PAD_L} y1={yy} x2={W - PAD_R} y2={yy} stroke="rgba(124,71,245,0.10)" />
              <text x={W - PAD_R + 6} y={yy + 3} fontSize={9} fill="#6b6486" className="font-mono">
                {formatUsdPrice(price)}
              </text>
            </g>
          );
        })}

        {/* candles */}
        {candles.map((c, i) => {
          const bull = c.c >= c.o;
          const color = bull ? "#10b981" : "#f43f5e";
          const cx = x(i);
          const bodyTop = y(Math.max(c.o, c.c));
          const bodyBot = y(Math.min(c.o, c.c));
          return (
            <g key={c.i}>
              <line x1={cx} y1={y(c.h)} x2={cx} y2={y(c.l)} stroke={color} strokeWidth={1} />
              <rect
                x={cx - cw / 2}
                y={bodyTop}
                width={cw}
                height={Math.max(1, bodyBot - bodyTop)}
                fill={color}
                rx={1}
              />
            </g>
          );
        })}

        {/* volume bars */}
        {candles.map((c, i) => {
          const bull = c.c >= c.o;
          const v = vols[i] ?? 0;
          const h = vh(v);
          return (
            <rect
              key={`v-${c.i}`}
              x={x(i) - cw / 2}
              y={VOL_TOP + VOL_H - h}
              width={cw}
              height={h}
              rx={1}
              fill={bull ? "#10b981" : "#f43f5e"}
              opacity={0.5}
            />
          );
        })}
        <text x={PAD_L} y={VOL_TOP - 4} fontSize={9} fill="#6b6486" className="uppercase">
          Volume
        </text>

        {/* live last-price line + pulsing marker */}
        <line
          x1={PAD_L}
          y1={y(last.c)}
          x2={W - PAD_R}
          y2={y(last.c)}
          stroke={up ? "#10b981" : "#f43f5e"}
          strokeWidth={1}
          strokeDasharray="4 3"
          opacity={0.75}
        />
        <circle cx={x(candles.length - 1)} cy={y(last.c)} r={flash ? 5 : 3} fill={up ? "#10b981" : "#f43f5e"}>
          <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <rect x={W - PAD_R} y={y(last.c) - 8} width={PAD_R} height={16} fill={up ? "#10b981" : "#f43f5e"} rx={2} />
        <text x={W - PAD_R + 5} y={y(last.c) + 3} fontSize={9} fill="#fff" className="font-mono font-bold">
          {formatUsdPrice(last.c)}
        </text>
      </svg>
    </div>
  );
}
