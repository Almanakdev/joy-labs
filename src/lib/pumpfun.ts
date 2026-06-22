// Pump.fun integration helpers.
// Joy Labs deploys tokens via a pump.fun-style bonding curve; trading is
// completed on pump.fun itself, where the user connects their wallet.

export const PUMPFUN_BASE = "https://pump.fun";

/** Coin page where users connect a wallet and buy/sell the token. */
export function pumpFunCoinUrl(mint: string): string {
  return `${PUMPFUN_BASE}/coin/${mint}`;
}

/** Page to create / launch a new coin on pump.fun. */
export function pumpFunCreateUrl(): string {
  return `${PUMPFUN_BASE}/create`;
}
