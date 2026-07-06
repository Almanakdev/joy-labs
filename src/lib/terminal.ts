// Data for the JoyLabs Terminal — a pro trading view inspired by
// Axiom / Padre. Deterministic mock token discovery feed.

export type TerminalCategory = "new" | "graduating" | "graduated";

export interface TerminalToken {
  slug: string;
  name: string;
  symbol: string;
  ageSec: number;
  marketCap: number; // USD
  volume: number; // USD (5m)
  holders: number;
  priceChange: number; // %
  bondingProgress: number; // 0-100
  txns: number; // last 5m
  dev: number; // dev holding %
  top10: number; // top-10 holders %
  snipers: number; // sniper %
  category: TerminalCategory;
}

function hash(s: string): number {
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Seed = [name: string, symbol: string, category: TerminalCategory];

const SEEDS: Seed[] = [
  ["Quantum Fox", "QFOX", "new"],
  ["Neon Llama", "NEON", "new"],
  ["Turbo Turtle", "TURT", "new"],
  ["Pixel Pump", "PXPM", "new"],
  ["Hyper Hodl", "HODL", "new"],
  ["Solar Shiba", "SLSH", "new"],
  ["Moon Mule", "MULE", "new"],
  ["Degen Duck", "DUCK", "new"],
  ["Rocket Raccoon", "RKT", "graduating"],
  ["Vault Viper", "VIPR", "graduating"],
  ["Cyber Crane", "CRNE", "graduating"],
  ["Astro Ant", "ANT", "graduating"],
  ["Prism Panda", "PRSM", "graduating"],
  ["Echo Eagle", "EGLE", "graduating"],
  ["Nova Newt", "NEWT", "graduating"],
  ["Forge Falcon", "FRGE", "graduated"],
  ["Lumen Lynx", "LMNX", "graduated"],
  ["Titan Toad", "TITN", "graduated"],
  ["Orbit Otter", "ORBT", "graduated"],
  ["Sigma Swan", "SGMA", "graduated"],
  ["Zenith Zebra", "ZNTH", "graduated"],
  ["Comet Cat", "COMT", "graduated"],
];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function build([name, symbol, category]: Seed): TerminalToken {
  const slug = slugify(name);
  const r = rng(hash(slug));
  const base =
    category === "new"
      ? { mc: 8_000 + r() * 60_000, age: 20 + r() * 900, bond: r() * 40 }
      : category === "graduating"
      ? { mc: 40_000 + r() * 55_000, age: 600 + r() * 5400, bond: 60 + r() * 38 }
      : { mc: 120_000 + r() * 3_000_000, age: 3600 + r() * 200000, bond: 100 };

  return {
    slug,
    name,
    symbol,
    ageSec: Math.round(base.age),
    marketCap: Math.round(base.mc),
    volume: Math.round(base.mc * (0.15 + r() * 0.9)),
    holders: Math.round(20 + r() * 3200),
    priceChange: Math.round((r() * 260 - 40) * 10) / 10,
    bondingProgress: Math.round(base.bond),
    txns: Math.round(5 + r() * 400),
    dev: Math.round(r() * 8 * 10) / 10,
    top10: Math.round((8 + r() * 45) * 10) / 10,
    snipers: Math.round(r() * 18 * 10) / 10,
    category,
  };
}

export const TERMINAL_TOKENS: TerminalToken[] = SEEDS.map(build);

export function tokensByCategory(cat: TerminalCategory): TerminalToken[] {
  return TERMINAL_TOKENS.filter((t) => t.category === cat).sort(
    (a, b) => b.volume - a.volume
  );
}

/** Turn a slug into a display name (fallback for the token page). */
export function prettifySlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
