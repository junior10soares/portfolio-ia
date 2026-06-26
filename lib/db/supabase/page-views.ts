import { getSupabaseAdmin } from "./client";

// ponytail: allowlist por IP via env, não por cookie — se seu IP de casa mudar
// (IP dinâmico), atualize EXCLUDED_IPS na Vercel.
export function shouldTrack(ip: string): boolean {
  if (ip === "unknown") return false;
  const excludedIps = (process.env.EXCLUDED_IPS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return !excludedIps.includes(ip);
}

export async function recordPageView(path: string, ip: string) {
  if (!shouldTrack(ip)) return;
  await getSupabaseAdmin().from("page_views").insert({ path });
}
