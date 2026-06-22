"use client";

import dynamic from "next/dynamic";

/**
 * The wallet-adapter button reads `window` on mount, so it must be loaded
 * client-side only to avoid hydration mismatches.
 */
const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export function WalletButton() {
  return (
    <WalletMultiButtonDynamic
      style={{
        backgroundColor: "#6a2fe0",
        borderRadius: "0.75rem",
        height: "auto",
        paddingTop: "0.6rem",
        paddingBottom: "0.6rem",
        fontFamily: "inherit",
        fontWeight: 600,
      }}
    />
  );
}
