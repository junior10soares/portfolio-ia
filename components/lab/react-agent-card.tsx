import Link from "next/link";
import { Workflow } from "lucide-react";

export function ReactAgentCard() {
  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-5">
      <Workflow size={22} className="text-accent" />
      <h3 className="mt-3 font-display text-lg text-fg">Agente ReAct</h3>
      <p className="mt-1 text-sm text-muted">
        Loop próprio Thought → Action → Observation, implementado à mão (não é
        o auto-loop da SDK).
      </p>
      <Link
        href="/assistente-ia"
        className="mt-4 inline-block rounded-full border border-border px-4 py-1.5 text-sm text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
      >
        Ver no Assistente IA
      </Link>
    </div>
  );
}
