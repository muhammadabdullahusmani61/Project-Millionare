import Link from "next/link";
import { ArrowLeft, CheckCircle2, Focus, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";

type FocusPageProps = { searchParams: Promise<{ task?: string }> };

export default async function FocusPage({ searchParams }: FocusPageProps) {
  const { task } = await searchParams;

  return (
    <AppShell>
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center px-5 py-12 sm:px-8 lg:min-h-screen lg:px-12">
        <section className="w-full rounded-3xl border border-[var(--primary-soft)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-md)] sm:p-12">
          <Badge tone="primary" dot>Focus preparation</Badge>
          <span className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--primary-tint)] text-[var(--primary)]"><Focus size={30} /></span>
          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.05em]">Focus Mode is ready for its timer.</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[var(--muted)]">The dashboard has carried the selected task into this route. The full timer and distraction-free workflow will arrive in a later phase.</p>
          {task ? <p className="mx-auto mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--surface-muted)] px-4 py-3 text-xs text-[var(--ink-soft)]"><Zap size={15} className="text-[var(--primary)]" />Selected task is ready to focus</p> : null}
          <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--line-strong)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--primary-soft)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"><ArrowLeft size={16} />Back to dashboard</Link><Link href="/tasks" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"><CheckCircle2 size={16} />View task</Link></div>
        </section>
      </div>
    </AppShell>
  );
}
