import { Activity } from "lucide-react";
import type { AgentStats } from "@/lib/db/supabase/stats";

export function MetricsCard({ stats }: { stats: AgentStats }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-5">
      <div className="flex items-start justify-between">
        <Activity size={22} className="text-accent" />
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">
          dados reais
        </span>
      </div>
      <h3 className="mt-3 font-display text-lg text-fg">Metrics & Traces</h3>
      <p className="mt-1 text-sm text-muted">
        Telemetria real do Assistente IA, lida direto de `agent_traces`.
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted">Perguntas</dt>
          <dd className="font-display text-lg text-fg">{stats.totalQuestions}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Latência média</dt>
          <dd className="font-display text-lg text-fg">
            {(stats.avgLatencyMs / 1000).toFixed(1)}s
          </dd>
        </div>
      </dl>
    </div>
  );
}
