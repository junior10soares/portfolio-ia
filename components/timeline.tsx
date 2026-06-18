import type { TimelineEntry } from "@/lib/db/content";

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="relative ml-3 flex flex-col gap-8 border-l border-border pl-6">
      {entries.map((entry) => (
        <div key={entry.year} className="relative">
          <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-accent bg-bg" />
          <p className="text-xs uppercase tracking-wide text-accent">{entry.year}</p>
          <p className="mt-1 font-display text-lg text-fg">{entry.title}</p>
          <p className="mt-1 text-sm text-muted">{entry.description}</p>
        </div>
      ))}
    </div>
  );
}
