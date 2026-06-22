// Thin Helius API wrapper (server-side).
// Docs: https://docs.helius.dev

const HELIUS_KEY = process.env.HELIUS_API_KEY ?? "";
const BASE = "https://api.helius.xyz/v0";

async function heliusFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${BASE}${path}${sep}api-key=${HELIUS_KEY}`, init);
  if (!res.ok) throw new Error(`Helius ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

/** Fetch parsed transaction history for a wallet (used for builder reputation). */
export async function getWalletTransactions(address: string) {
  if (!HELIUS_KEY) return [];
  return heliusFetch<unknown[]>(`/addresses/${address}/transactions?limit=25`);
}

/** Fetch token metadata for a launched mint. */
export async function getTokenMetadata(mints: string[]) {
  if (!HELIUS_KEY) return [];
  return heliusFetch<unknown[]>(`/token-metadata`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mintAccounts: mints, includeOffChain: true }),
  });
}
