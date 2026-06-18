import { ragSearch } from "@/lib/ai/rag/retrieve";
import { checkRateLimit, getClientIp, hashIp } from "@/lib/db/supabase/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_QUERY_LENGTH = 300;

export async function POST(req: Request) {
  const allowed = await checkRateLimit(hashIp(getClientIp(req)));
  if (!allowed) {
    return Response.json(
      { error: "Limite de buscas por minuto atingido. Tente novamente em breve." },
      { status: 429 }
    );
  }

  const { query } = (await req.json()) as { query?: string };

  if (!query || typeof query !== "string" || query.length > MAX_QUERY_LENGTH) {
    return Response.json({ error: "Consulta inválida" }, { status: 400 });
  }

  const matches = await ragSearch(query);
  return Response.json({ matches });
}
