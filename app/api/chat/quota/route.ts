import { getQuotaStatus } from "@/lib/db/supabase/quota";

export const runtime = "nodejs";

export async function GET() {
  const status = await getQuotaStatus();
  return Response.json(status);
}
