import { getProject, MOVERS } from "@/lib/mock-data";

// Deterministic mock market data for a token's trading page.
// Replace with live Helius / DEX / bonding-curve data in production.

export interface Candle {
  i: number;
  o: number;
  h: number;
  l: number;
  c: number;
}

export interface Trade {
  id: string;
  type: "buy" | "sell";
  sol: number;
  tokens: number;
  account: string;
  ageSec: number;
}

export interface TokenMarket {
  slug: string;
  name: string;
  symbol: string;
  mint: string;
  price: number; // USD
  change24h: number; // %
  marketCap: number; // USD
  volume24h: number; // USD
  holders: number;
  liquidity: number; // USD
  bondingProgress: number; // 0-100, % to graduation
  candles: Candle[];
  trades: Trade[];
}

const SUPPLY = 1_000_000_000; // 1B tokens (pump.fun standard)
const SOL_USD = 165; // mock SOL price

function hash(s: string): number {
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function base58ish(rnd: () => number, n = 4): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
  let s = "";
  for (let i = 0; i < n; i++) s += chars[Math.floor(rnd() * chars.length)];
  return s;
}

function symbolFor(slug: string, name: string): string {
  const mover = MOVERS.find((m) => m.slug === slug);
  if (mover) return mover.symbol;
  return name.replace(/[^a-zA-Z]/g, "").slice(0, 5).toUpperCase();
}

export function getTokenMarket(slug: string): TokenMarket | null {
  const project = getProject(slug);
  const mover = MOVERS.find((m) => m.slug === slug);
  const name = project?.name ?? mover?.name;
  if (!name) return null;

  const rnd = mulberry32(hash(slug));
  const symbol = symbolFor(slug, name);

  const marketCap = mover?.marketCap ?? Math.round(40_000 + rnd() * 120_000);
  const change24h = mover?.priceChange ?? Math.round((rnd() * 80 - 20) * 10) / 10;
  const price = marketCap / SUPPLY;

  // Candles interpolate from the 24h-ago price up to the current price.
  const n = 64;
  const start = price / (1 + change24h / 100);
  const candles: Candle[] = [];
  let prev = start;
  for (let i = 0; i < n; i++) {
    const prog = i / (n - 1);
    const drift = start + (price - start) * prog;
    const o = prev;
    const noise = (rnd() - 0.5) * drift * 0.07;
    let c = Math.max(drift + noise, drift * 0.4);
    if (i === n - 1) c = price;
    const h = Math.max(o, c) * (1 + rnd() * 0.035);
    const l = Math.min(o, c) * (1 - rnd() * 0.035);
    candles.push({ i, o, h, l, c });
    prev = c;
  }

  const volume24h = Math.round(marketCap * (0.3 + rnd() * 1.4));
  const holders = Math.round(120 + rnd() * 4200);
  const liquidity = Math.round(marketCap * (0.12 + rnd() * 0.2));
  const bondingProgress = mover
    ? Math.min(99, Math.round(40 + rnd() * 55))
    : Math.round(rnd() * 35);

  const trades: Trade[] = Array.from({ length: 18 }).map((_, k) => {
    const isBuy = rnd() > 0.42;
    const sol = Math.round((0.05 + rnd() * 12) * 100) / 100;
    return {
      id: `${slug}-tx-${k}`,
      type: isBuy ? "buy" : "sell",
      sol,
      tokens: Math.round((sol * SOL_USD) / price),
      account: `${base58ish(rnd)}…${base58ish(rnd)}`,
      ageSec: Math.round(8 + k * (15 + rnd() * 40)),
    };
  });

  return {
    slug,
    name,
    symbol,
    mint: mover?.mint ?? base58ish(rnd, 44),
    price,
    change24h,
    marketCap,
    volume24h,
    holders,
    liquidity,
    bondingProgress,
    candles,
    trades,
  };
}

export const SOL_USD_PRICE = SOL_USD;
export const TOKEN_SUPPLY = SUPPLY;
