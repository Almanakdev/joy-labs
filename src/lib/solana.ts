import { Connection, PublicKey, clusterApiUrl, type Cluster } from "@solana/web3.js";

const NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? "devnet") as Cluster;

export const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_HELIUS_RPC_URL ||
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  clusterApiUrl(NETWORK);

/** Shared read-only connection for the client. */
export function getConnection(): Connection {
  return new Connection(SOLANA_RPC_URL, "confirmed");
}

export const LAMPORTS_PER_SOL = 1_000_000_000;

export function lamportsToSol(lamports: number | bigint): number {
  return Number(lamports) / LAMPORTS_PER_SOL;
}

/**
 * Pump.fun-style token deployment (STUB).
 *
 * In production this builds and sends a transaction creating an SPL mint
 * + bonding-curve pool, gated server-side on the project's Work Score.
 * Returns a fake mint + signature so the UI flow is fully wired.
 */
export async function deployToken(params: {
  projectSlug: string;
  name: string;
  symbol: string;
  ownerWallet: string;
  workScore: number;
}): Promise<{ mint: string; signature: string }> {
  if (params.workScore < Number(process.env.NEXT_PUBLIC_MIN_LAUNCH_SCORE ?? 750)) {
    throw new Error("Work Score below launch threshold — keep building.");
  }
  // TODO: integrate @solana/spl-token + bonding curve program.
  const fakeMint = new PublicKey(
    Uint8Array.from({ length: 32 }, () => Math.floor(Math.random() * 256))
  ).toBase58();
  await new Promise((r) => setTimeout(r, 600));
  return {
    mint: fakeMint,
    signature: "SIM_" + Math.random().toString(36).slice(2, 14),
  };
}

/**
 * Bonding-curve swap (STUB).
 *
 * Production: route through the bonding-curve / AMM program, applying
 * slippage and fees, and send a signed transaction. Here we simulate a fill
 * so the buy/sell UI is fully interactive.
 */
export async function swap(params: {
  mint: string;
  side: "buy" | "sell";
  amount: number; // SOL when buying, token qty when selling
  price: number; // current token price (USD)
  wallet: string;
}): Promise<{ signature: string; filled: number }> {
  if (!params.amount || params.amount <= 0) throw new Error("Enter an amount first.");
  await new Promise((r) => setTimeout(r, 700));
  const SOL_USD = 165;
  const filled =
    params.side === "buy"
      ? (params.amount * SOL_USD) / params.price // tokens received
      : (params.amount * params.price) / SOL_USD; // SOL received
  return {
    signature: "SIM_" + Math.random().toString(36).slice(2, 14),
    filled,
  };
}

/**
 * Smart-contract scanner (STUB).
 * Production: pull program bytecode via Helius, run heuristics
 * (mint authority renounced? freeze authority? upgradeable?).
 */
export async function scanContract(mint: string): Promise<{
  safe: boolean;
  mintAuthorityRenounced: boolean;
  freezeAuthorityRenounced: boolean;
  notes: string[];
}> {
  await new Promise((r) => setTimeout(r, 400));
  return {
    safe: true,
    mintAuthorityRenounced: true,
    freezeAuthorityRenounced: true,
    notes: [`Scanned ${mint.slice(0, 6)}… — no critical issues found.`],
  };
}
