import { CheckCircle2, Inbox, LoaderCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type FeedbackTone = "success" | "primary" | "warning";

const feedbackStyles: Record<FeedbackTone, string> = {
  success: "border-[var(--success-soft)] bg-[var(--success-tint)]",
  primary: "border-[var(--primary-soft)] bg-[var(--primary-tint)]",
  warning: "border-[var(--warning-soft)] bg-[var(--warning-tint)]",
};

export function AchievementFeedback({ tone = "success", title, detail }: { tone?: FeedbackTone; title: string; detail: string }) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 ${feedbackStyles[tone]}`} role="status">
      <span className="mt-0.5 text-[var(--success)]" aria-hidden="true"><Sparkles size={18} /></span>
      <div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs text-[var(--muted)]">{detail}</p></div>
    </div>
  );
}

export function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line-strong)] px-6 text-center">
      <Inbox className="text-[var(--muted)]" size={24} aria-hidden="true" />
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-1 max-w-xs text-xs leading-5 text-[var(--muted)]">{detail}</p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]" role="status" aria-live="polite">
      <LoaderCircle className="animate-spin motion-reduce:animate-none" size={18} aria-hidden="true" />
      Loading your system...
    </div>
  );
}

export function TaskState({ state }: { state: "complete" | "active" | "blocked" }) {
  if (state === "complete") return <Badge tone="success" dot><CheckCircle2 size={13} /> Complete</Badge>;
  if (state === "blocked") return <Badge tone="warning" dot>Needs attention</Badge>;
  return <Badge tone="primary" dot>In progress</Badge>;
}
