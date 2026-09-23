import { Check, Flame } from "lucide-react";

type ProgressBarProps = {
  value: number;
  label?: string;
  tone?: "neutral" | "primary" | "success" | "violet";
};

const barTones = {
  neutral: "bg-[var(--line-strong)]",
  primary: "bg-[var(--primary)]",
  success: "bg-[var(--success)]",
  violet: "bg-[var(--violet)]",
};

export function ProgressBar({ value, label, tone = "primary" }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(value, 100));
  return (
    <div>
      {label ? <div className="mb-2 flex justify-between gap-4 text-xs font-medium text-[var(--muted)]"><span>{label}</span><span>{safeValue}%</span></div> : null}
      <div className="h-2 overflow-hidden rounded-full bg-[var(--track)]" role="progressbar" aria-label={label ?? `${safeValue}% complete`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={safeValue}>
        <div className={`h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none ${barTones[tone]}`} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

type ProgressRingProps = {
  value: number;
  size?: number;
  label?: string;
};

export function ProgressRing({ value, size = 112, label = "complete" }: ProgressRingProps) {
  const safeValue = Math.max(0, Math.min(value, 100));
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (safeValue / 100) * circumference;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${safeValue}% ${label}`}>
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--track)" strokeWidth="8" />
        <circle className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none" cx="50" cy="50" r={radius} fill="none" stroke="var(--primary)" strokeLinecap="round" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={dashOffset} />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <strong className="text-2xl font-semibold tracking-[-0.04em]">{safeValue}%</strong>
        <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">{label}</span>
      </span>
    </div>
  );
}

export function StreakIndicator({ days }: { days: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--warning-tint)] text-[var(--warning)]" aria-hidden="true"><Flame size={22} strokeWidth={2.2} /></span>
      <div>
        <p className="text-2xl font-semibold tracking-[-0.04em]">{days} <span className="text-sm font-medium tracking-normal text-[var(--muted)]">days</span></p>
        <p className="text-xs text-[var(--muted)]">Streak continues</p>
      </div>
    </div>
  );
}

export function CompletionIndicator({ complete = false }: { complete?: boolean }) {
  return (
    <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${complete ? "border-[var(--success)] bg-[var(--success)] text-white" : "border-[var(--line-strong)] text-transparent"}`} aria-label={complete ? "Completed" : "Not completed"}>
      <Check size={14} strokeWidth={3} aria-hidden="true" />
    </span>
  );
}
