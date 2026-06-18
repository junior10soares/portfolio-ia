import { getSupabaseAdmin } from "./client";

// Margem de segurança abaixo do limite real do free tier do Gemini
// (gemini-2.5-flash permite 20 requisições/dia por chave de API).
export const DAILY_QUOTA_LIMIT = 18;

export type QuotaStatus = {
  used: number;
  limit: number;
  remaining: number;
};

export async function getQuotaStatus(): Promise<QuotaStatus> {
  const supabase = getSupabaseAdmin();
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("agent_traces")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startOfDay.toISOString());

  const used = count ?? 0;
  return {
    used,
    limit: DAILY_QUOTA_LIMIT,
    remaining: Math.max(0, DAILY_QUOTA_LIMIT - used),
  };
}

export function isQuotaExceededError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("exceeded your current quota") || message.includes("RESOURCE_EXHAUSTED");
}

export function isModelOverloadedError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("high demand") ||
    message.includes("UNAVAILABLE") ||
    message.includes("overloaded")
  );
}
