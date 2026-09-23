"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowRight, CalendarClock, CircleAlert, Timer } from "lucide-react";
import { setDashboardTaskComplete } from "@/app/actions/dashboard-actions";
import type { DashboardTask } from "@/features/dashboard/dashboard-data";
import { CompletionIndicator } from "@/components/progress/progress-visuals";
import { TaskState } from "@/components/feedback/feedback-patterns";
import { Badge } from "@/components/ui/badge";

export function DashboardTaskList({ tasks, mostImportantTaskId }: { tasks: DashboardTask[]; mostImportantTaskId: string | null }) {
  const [completedIds, setCompletedIds] = useState(() => new Set(tasks.filter((task) => task.completedToday).map((task) => task.id)));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleTask(taskId: string) {
    const complete = !completedIds.has(taskId);
    setError(null);
    setCompletedIds((current) => {
      const next = new Set(current);
      if (complete) next.add(taskId);
      else next.delete(taskId);
      return next;
    });

    startTransition(async () => {
      const result = await setDashboardTaskComplete(taskId, complete);
      if (!result.ok) {
        setCompletedIds((current) => {
          const next = new Set(current);
          if (complete) next.delete(taskId);
          else next.add(taskId);
          return next;
        });
        setError(result.error);
      }
    });
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--line-strong)] bg-[var(--surface)] p-6 text-center">
        <p className="text-sm font-semibold">No tasks planned for today.</p>
        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[var(--muted)]">Give the day one clear target. Your first task is enough to create momentum.</p>
        <Link href="/tasks" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">Create today&apos;s first task <ArrowRight size={16} /></Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2">
        {tasks.map((task) => {
          const complete = completedIds.has(task.id);
          const isMostImportant = task.id === mostImportantTaskId;
          const overdue = Boolean(task.dueOn && task.dueOn < new Date().toISOString().slice(0, 10) && !complete);
          return (
            <article key={task.id} className={`flex items-center gap-3 rounded-2xl border p-4 transition duration-200 ${isMostImportant ? "border-[var(--primary-soft)] bg-[var(--primary-tint)]" : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--line-strong)]"}`}>
              <button type="button" onClick={() => toggleTask(task.id)} disabled={isPending} className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2" aria-label={complete ? `Reopen ${task.title}` : `Complete ${task.title}`}>
                <CompletionIndicator complete={complete} />
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><p className={`truncate text-sm font-semibold ${complete ? "text-[var(--muted)] line-through" : ""}`}>{task.title}</p>{isMostImportant ? <Badge tone="primary">🎯 Priority</Badge> : null}</div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]"><TaskState state={complete ? "complete" : task.status === "cancelled" ? "blocked" : "active"} />{task.dueOn ? <span className={`inline-flex items-center gap-1 ${overdue ? "text-[var(--danger)]" : ""}`}><CalendarClock size={13} />{overdue ? "Overdue" : `Due ${task.dueOn}`}</span> : null}<span className="inline-flex items-center gap-1"><Timer size={13} />Focused time untracked</span></div>
              </div>
              <Link href={`/tasks?task=${task.id}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]" aria-label={`View ${task.title}`}><ArrowRight size={17} /></Link>
            </article>
          );
        })}
      </div>
      {error ? <p className="mt-3 flex items-center gap-2 text-xs text-[var(--danger)]" role="alert"><CircleAlert size={15} />{error}</p> : null}
    </div>
  );
}
