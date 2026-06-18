import { MessageSquare, Timer, Wrench, Hash } from "lucide-react";
import type { AgentStats } from "@/lib/db/supabase/stats";

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MessageSquare;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-5">
      <Icon size={18} className="text-accent" />
      <p className="mt-3 font-display text-2xl text-fg">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}

export function StatsPanel({ stats }: { stats: AgentStats }) {
  if (stats.totalQuestions === 0) {
    return (
      <p className="text-sm text-muted">
        Ainda não há dados reais de uso — converse com o{" "}
        <a href="/assistente-ia" className="text-accent underline">
          Assistente IA
        </a>{" "}
        para gerar as primeiras estatísticas.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard
        icon={MessageSquare}
        label="Perguntas respondidas"
        value={String(stats.totalQuestions)}
      />
      <StatCard
        icon={Timer}
        label="Latência média"
        value={`${(stats.avgLatencyMs / 1000).toFixed(1)}s`}
      />
      <StatCard
        icon={Wrench}
        label="Tool mais usada"
        value={stats.topTool ?? "—"}
      />
      <StatCard
        icon={Hash}
        label="Chamadas de tools (total)"
        value={String(stats.totalToolCalls)}
      />
    </div>
  );
}
