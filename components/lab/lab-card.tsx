"use client";

import type { LucideIcon } from "lucide-react";

export function LabCard({
  icon: Icon,
  title,
  description,
  badge,
  open,
  onToggle,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/50">
      <div className="flex items-start justify-between">
        <Icon size={22} className="text-accent" />
        {badge && (
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">
            {badge}
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-lg text-fg">{title}</h3>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <button
        type="button"
        onClick={onToggle}
        className="mt-4 rounded-full border border-border px-4 py-1.5 text-sm text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
      >
        {open ? "Fechar" : "Abrir"}
      </button>
    </div>
  );
}
