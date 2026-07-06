import { Suspense } from "react";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata = {
  title: "Dashboard — HyperJoy",
  description: "Track your Work Score, milestones and launch eligibility.",
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted">
          Loading dashboard…
        </div>
      }
    >
      <DashboardClient />
    </Suspense>
  );
}
