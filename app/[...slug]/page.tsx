import { notFound } from "next/navigation";
import { navigationItems, utilityItems } from "@/config/navigation";
import { AppShell } from "@/components/app-shell";

type PlaceholderPageProps = {
  params: Promise<{ slug: string[] }>;
};

const allNavigationItems = [...navigationItems, ...utilityItems];

export default async function PlaceholderPage({ params }: PlaceholderPageProps) {
  const { slug } = await params;
  const href = `/${slug.join("/")}`;
  const item = allNavigationItems.find((navigationItem) => navigationItem.href === href);

  if (!item) {
    notFound();
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Module placeholder</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em]">{item.label}</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)]">
          This module is part of the USMANI OS foundation. Its workflows will be introduced in a later stage.
        </p>
        <div className="mt-10 border border-dashed border-[var(--line-strong)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
          No persistent data or business logic is connected yet.
        </div>
      </div>
    </AppShell>
  );
}
