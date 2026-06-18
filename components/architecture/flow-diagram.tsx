import { ArrowRight, ArrowDown } from "lucide-react";

function Box({
  title,
  detail,
  tone = "neutral",
}: {
  title: string;
  detail: string;
  tone?: "neutral" | "accent" | "signal";
}) {
  const toneClasses =
    tone === "accent"
      ? "border-accent/50 bg-accent-soft"
      : tone === "signal"
        ? "border-signal/40 bg-signal/10"
        : "border-border bg-bg";

  return (
    <div className={`rounded-xl border px-4 py-3 text-center ${toneClasses}`}>
      <p className="text-sm font-medium text-fg">{title}</p>
      <p className="mt-1 text-xs text-muted">{detail}</p>
    </div>
  );
}

export function FlowDiagram() {
  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-6">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-2">
        <Box title="Frontend" detail="Next.js · App Router" />
        <ArrowRight className="hidden text-muted sm:block" size={18} />
        <ArrowDown className="text-muted sm:hidden" size={18} />
        <Box title="API Layer" detail="Next.js · Route Handlers" tone="accent" />
        <ArrowRight className="hidden text-muted sm:block" size={18} />
        <ArrowDown className="text-muted sm:hidden" size={18} />
        <Box title="LLM" detail="Gemini API · Google" tone="signal" />
      </div>

      <p className="my-3 text-center text-xs uppercase tracking-wide text-muted">
        ▲ Vercel
      </p>

      <div className="flex justify-center">
        <ArrowDown className="text-muted" size={18} />
      </div>

      <div className="my-3 flex justify-center">
        <Box title="Orquestração" detail="Agente IA (ReAct) · run-agent.ts" tone="accent" />
      </div>

      <div className="flex justify-center">
        <ArrowDown className="text-muted" size={18} />
      </div>

      <div className="my-3 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
        <Box title="Vector Store" detail="pgvector · Supabase" />
        <Box title="PostgreSQL" detail="Supabase (relacional)" />
        <Box title="MCP Servers" detail="Tools & Data externos" tone="signal" />
      </div>
    </div>
  );
}
