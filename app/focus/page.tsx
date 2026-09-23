import { AppShell } from "@/components/app-shell";
import { FocusMode } from "@/features/focus/focus-mode";
import { getFocusData } from "@/features/focus/focus-data";

type FocusPageProps = { searchParams: Promise<{ task?: string }> };

export default async function FocusPage({ searchParams }: FocusPageProps) {
  const { task } = await searchParams;
  const data = await getFocusData(task);

  return <AppShell><FocusMode data={data} /></AppShell>;
}
