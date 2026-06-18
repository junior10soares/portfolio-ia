import { insertFeedback } from "@/lib/db/supabase/traces";

export const runtime = "nodejs";

type FeedbackRequestBody = {
  clientMessageId: string;
  rating: 1 | -1;
};

export async function POST(req: Request) {
  const { clientMessageId, rating } = (await req.json()) as FeedbackRequestBody;

  if (!clientMessageId || (rating !== 1 && rating !== -1)) {
    return new Response("Requisição inválida", { status: 400 });
  }

  try {
    await insertFeedback(clientMessageId, rating);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Falha ao gravar feedback:", error);
    return new Response("Erro ao gravar feedback", { status: 500 });
  }
}
