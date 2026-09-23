import { AppShell } from "@/components/app-shell";
import { getDashboardData } from "@/features/dashboard/dashboard-data";
import { DashboardView } from "@/features/dashboard/dashboard-view";

export default async function Home() {
  const data = await getDashboardData();

  return (
    <AppShell>
      <DashboardView data={data} />
    </AppShell>
  );
}
