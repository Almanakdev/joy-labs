import { LeaderboardClient } from "@/components/leaderboard/LeaderboardClient";

export const metadata = {
  title: "Leaderboard — HyperJoy",
  description: "Global ranking of all projects by Work Score.",
};

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
