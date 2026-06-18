import { getSupabaseAdmin } from "./client";

type InsertTraceInput = {
  sessionId: string;
  question: string;
  clientMessageId: string;
  steps: unknown;
  toolsUsed?: string[];
  latencyMs: number;
  costUsd?: number;
};

export async function insertAgentTrace(input: InsertTraceInput) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("agent_traces").insert({
    session_id: input.sessionId,
    question: input.question,
    client_message_id: input.clientMessageId,
    steps: input.steps,
    tools_used: input.toolsUsed ?? [],
    latency_ms: input.latencyMs,
    cost_usd: input.costUsd ?? 0,
  });

  if (error) {
    console.error("Falha ao gravar agent_trace:", error.message);
  }
}

export async function insertFeedback(clientMessageId: string, rating: 1 | -1) {
  const supabase = getSupabaseAdmin();

  const { data: trace, error: findError } = await supabase
    .from("agent_traces")
    .select("id")
    .eq("client_message_id", clientMessageId)
    .single();

  if (findError || !trace) {
    throw new Error("Trace não encontrado para esse client_message_id");
  }

  const { error: insertError } = await supabase.from("message_feedback").insert({
    trace_id: trace.id,
    rating,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }
}
