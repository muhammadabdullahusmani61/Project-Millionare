import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export function MetricCard({ label, value, detail, icon: Icon, tone = "primary" }: { label: string; value: string; detail: string; icon: LucideIcon; tone?: "primary" | "violet" | "success" | "warning" }) {
  const toneClasses = {
    primary: "bg-[var(--primary-tint)] text-[var(--primary)]",
    violet: "bg-[var(--violet-tint)] text-[var(--violet)]",
    success: "bg-[var(--success-tint)] text-[var(--success)]",
    warning: "bg-[var(--warning-tint)] text-[var(--warning)]",
  };
  return (
    <article className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
      <div className="flex items-start justify-between gap-4">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses[tone]}`}><Icon size={19} aria-hidden="true" /></span>
        <ArrowUpRight className="text-[var(--muted)]" size={17} aria-hidden="true" />
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.13em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">{value}</p>
      <p className="mt-1 text-xs text-[var(--muted)]">{detail}</p>
    </article>
  );
}
