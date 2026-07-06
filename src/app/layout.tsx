import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { Chrome } from "@/components/layout/Chrome";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const logo = Poppins({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-logo", display: "swap" });

export const metadata: Metadata = {
  title: "HyperJoy — Don't Buy The Hype. Buy The Work.",
  description:
    "The first Web3 launchpad where builders earn launch rights through real execution instead of paying deployment fees.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  icons: {
    icon: "/joylabs-logo.png",
    shortcut: "/joylabs-logo.png",
    apple: "/joylabs-logo.png",
  },
  openGraph: {
    title: "HyperJoy — Proof-of-Work Launchpad",
    description: "Builders earn launch rights through real execution. Built on Solana.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} ${mono.variable} ${logo.variable}`}>
      <body>
        <WalletProvider>
          <Chrome>{children}</Chrome>
        </WalletProvider>
      </body>
    </html>
  );
}
