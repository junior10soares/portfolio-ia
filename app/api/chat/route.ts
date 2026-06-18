import type { ModelMessage } from "ai";
import { runAgent } from "@/lib/ai/agent/run-agent";
import { insertAgentTrace } from "@/lib/db/supabase/traces";
import { META_MARKER } from "@/lib/ai/chat-protocol";
import { checkRateLimit, getClientIp, hashIp } from "@/lib/db/supabase/rate-limit";
import { getQuotaStatus, isQuotaExceededError } from "@/lib/db/supabase/quota";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_MESSAGE_LENGTH = 2000;
const QUOTA_MESSAGE =
  "A cota gratuita diária do Gemini para este site foi atingida. Volte amanhã ou explore o Laboratório IA e a página de Arquitetura enquanto isso.";

type ChatRequestBody = {
  sessionId: string;
  clientMessageId: string;
  messages: ModelMessage[];
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
  const allowed = await checkRateLimit(hashIp(getClientIp(req)));
  if (!allowed) {
    return new Response(
      "Você atingiu o limite de mensagens por minuto. Tente novamente em breve.",
      { status: 429 }
    );
  }

  const quota = await getQuotaStatus();
  if (quota.remaining <= 0) {
    return new Response(QUOTA_MESSAGE, { status: 503 });
  }

  const body = (await req.json()) as ChatRequestBody;
  const { sessionId, clientMessageId, messages } = body;

  const lastUserMessage = messages.at(-1);
  const question =
    typeof lastUserMessage?.content === "string" ? lastUserMessage.content : "";

  if (!sessionId || !clientMessageId || !question) {
    return new Response("Requisição inválida", { status: 400 });
  }

  if (question.length > MAX_MESSAGE_LENGTH) {
    return new Response("Mensagem muito longa", { status: 413 });
  }

  const startedAt = Date.now();
  let agentResult;
  try {
    agentResult = await runAgent(messages);
  } catch (error) {
    if (isQuotaExceededError(error)) {
      return new Response(QUOTA_MESSAGE, { status: 503 });
    }
    console.error("Falha no agente:", error);
    return new Response(
      "Não consegui responder agora. Tente novamente em instantes.",
      { status: 500 }
    );
  }
  const latencyMs = Date.now() - startedAt;

  await insertAgentTrace({
    sessionId,
    clientMessageId,
    question,
    steps: agentResult.steps,
    toolsUsed: agentResult.toolsUsed,
    latencyMs,
    costUsd: 0,
  });

  const meta = {
    toolsUsed: agentResult.toolsUsed,
    steps: agentResult.steps,
    latencyMs,
  };

  // O agente roda em passos completos (não-streaming) para podermos decidir nós
  // mesmos quando parar; aqui simulamos a digitação token a token só na resposta
  // final, mantendo a UX de streaming sem depender do auto-loop da SDK.
  const encoder = new TextEncoder();
  const words = agentResult.finalText.split(/(\s+)/);

  const stream = new ReadableStream({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(encoder.encode(word));
        if (word.trim()) await sleep(12);
      }
      controller.enqueue(encoder.encode(`${META_MARKER}${JSON.stringify(meta)}`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
