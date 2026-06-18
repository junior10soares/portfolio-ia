import Link from "next/link";
import { STACK_ICONS } from "@/lib/stack";

export function StackGrid() {
  return (
    <div className="mt-10">
      <p className="text-xs uppercase tracking-wide text-muted">
        Tecnologias principais
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {STACK_ICONS.map(({ name, Icon, repoUrl }) => (
          <Link
            key={name}
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} no GitHub`}
            title={name}
            className="flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-3 py-1.5 text-xs text-muted transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:text-fg"
          >
            <Icon size={16} />
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}
