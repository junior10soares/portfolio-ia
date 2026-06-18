import { createHash } from "node:crypto";
import { getSupabaseAdmin } from "./client";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

export async function checkRateLimit(ipHash: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const now = new Date();

  const { data: existing } = await supabase
    .from("rate_limit_counters")
    .select("window_start, count")
    .eq("ip_hash", ipHash)
    .maybeSingle();

  const windowExpired =
    !existing || now.getTime() - new Date(existing.window_start).getTime() > WINDOW_MS;

  if (windowExpired) {
    await supabase
      .from("rate_limit_counters")
      .upsert({ ip_hash: ipHash, window_start: now.toISOString(), count: 1 });
    return true;
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  await supabase
    .from("rate_limit_counters")
    .update({ count: existing.count + 1 })
    .eq("ip_hash", ipHash);

  return true;
}
