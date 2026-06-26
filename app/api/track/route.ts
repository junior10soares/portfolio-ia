import { getClientIp } from "@/lib/db/supabase/rate-limit";
import { recordPageView } from "@/lib/db/supabase/page-views";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { path } = await req.json().catch(() => ({}));
  if (typeof path === "string") {
    await recordPageView(path, getClientIp(req));
  }
  return new Response(null, { status: 204 });
}
