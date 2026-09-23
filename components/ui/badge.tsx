import type { ReactNode } from "react";

type BadgeTone = "neutral" | "primary" | "violet" | "success" | "warning" | "danger";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
};

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-[var(--surface-muted)] text-[var(--muted)]",
  primary: "bg-[var(--primary-tint)] text-[var(--primary)]",
  violet: "bg-[var(--violet-tint)] text-[var(--violet)]",
  success: "bg-[var(--success-tint)] text-[var(--success)]",
  warning: "bg-[var(--warning-tint)] text-[var(--warning)]",
  danger: "bg-[var(--danger-tint)] text-[var(--danger)]",
};

export function Badge({ children, tone = "neutral", dot = false }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
