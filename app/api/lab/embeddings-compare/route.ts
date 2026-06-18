import { cosineSimilarity } from "ai";
import { embedText } from "@/lib/ai/embeddings/local-embedder";
import { checkRateLimit, getClientIp, hashIp } from "@/lib/db/supabase/rate-limit";

export const runtime = "nodejs";

const MAX_LENGTH = 300;

export async function POST(req: Request) {
  const allowed = await checkRateLimit(hashIp(getClientIp(req)));
  if (!allowed) {
    return Response.json({ error: "Limite por minuto atingido" }, { status: 429 });
  }

  const { textA, textB } = (await req.json()) as { textA?: string; textB?: string };

  if (
    !textA ||
    !textB ||
    typeof textA !== "string" ||
    typeof textB !== "string" ||
    textA.length > MAX_LENGTH ||
    textB.length > MAX_LENGTH
  ) {
    return Response.json({ error: "Textos inválidos" }, { status: 400 });
  }

  const [embeddingA, embeddingB] = await Promise.all([
    embedText(textA),
    embedText(textB),
  ]);

  const similarity = cosineSimilarity(embeddingA, embeddingB);

  return Response.json({
    similarity: Number(similarity.toFixed(4)),
    dimensions: embeddingA.length,
    previewA: embeddingA.slice(0, 8).map((n) => Number(n.toFixed(3))),
    previewB: embeddingB.slice(0, 8).map((n) => Number(n.toFixed(3))),
  });
}
