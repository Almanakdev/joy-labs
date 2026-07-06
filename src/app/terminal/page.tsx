import { TerminalClient } from "@/components/terminal/TerminalClient";

export const metadata = {
  title: "Terminal — HyperJoy",
  description: "Pro trading terminal: live token discovery, quick-buy, and positions.",
};

export default function TerminalPage() {
  return <TerminalClient />;
}
