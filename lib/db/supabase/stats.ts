import { getSupabaseAdmin } from "./client";

export type AgentStats = {
  totalQuestions: number;
  avgLatencyMs: number;
  topTool: string | null;
  totalToolCalls: number;
};

export async function getAgentStats(): Promise<AgentStats> {
  const supabase = getSupabaseAdmin();

  const { data, count } = await supabase
    .from("agent_traces")
    .select("latency_ms, tools_used", { count: "exact" });

  if (!data || data.length === 0) {
    return { totalQuestions: 0, avgLatencyMs: 0, topTool: null, totalToolCalls: 0 };
  }

  const totalLatency = data.reduce((sum, row) => sum + (row.latency_ms ?? 0), 0);
  const avgLatencyMs = Math.round(totalLatency / data.length);

  const toolCounts = new Map<string, number>();
  let totalToolCalls = 0;
  for (const row of data) {
    for (const tool of (row.tools_used as string[]) ?? []) {
      toolCounts.set(tool, (toolCounts.get(tool) ?? 0) + 1);
      totalToolCalls += 1;
    }
  }

  let topTool: string | null = null;
  let topCount = 0;
  for (const [tool, n] of toolCounts) {
    if (n > topCount) {
      topTool = tool;
      topCount = n;
    }
  }

  return {
    totalQuestions: count ?? data.length,
    avgLatencyMs,
    topTool,
    totalToolCalls,
  };
}
