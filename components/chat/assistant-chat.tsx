"use client";

import { useEffect, useState } from "react";
import { Send, ThumbsUp, ThumbsDown, Timer, BrainCircuit, Gauge } from "lucide-react";
import { splitMetaFromStream, type ChatMeta } from "@/lib/ai/chat-protocol";
import { ReasoningSteps } from "@/components/chat/reasoning-steps";
import { ConversationSidebar } from "@/components/chat/conversation-sidebar";
import {
  loadConversations,
  loadThread,
  saveThread,
  type Conversation,
} from "@/lib/chat-history";

type Role = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  done?: boolean;
  feedback?: 1 | -1;
  meta?: ChatMeta;
};

const SUGGESTED_QUESTIONS = [
  "Como funciona o RAG que você utiliza?",
  "Quais projetos você tem?",
  "Diferença entre LLMs e agentes?",
];

export function AssistantChat() {
  const [conversationId, setConversationId] = useState(() => crypto.randomUUID());
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const [quota, setQuota] = useState<{ remaining: number; limit: number } | null>(null);

  function refreshQuota() {
    fetch("/api/chat/quota")
      .then((res) => res.json())
      .then((data) => setQuota({ remaining: data.remaining, limit: data.limit }))
      .catch(() => {});
  }

  useEffect(() => {
    // Histórico só existe no localStorage do browser — não há como evitar o
    // efeito aqui, é exatamente o caso de sincronizar com um sistema externo.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConversations(loadConversations());
    refreshQuota();
  }, []);

  function startNewConversation() {
    setConversationId(crypto.randomUUID());
    setMessages([]);
  }

  function selectConversation(id: string) {
    setConversationId(id);
    setMessages(loadThread(id) as ChatMessage[]);
  }

  async function sendMessage(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || isStreaming || quota?.remaining === 0) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      done: true,
    };
    const assistantId = crypto.randomUUID();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    const history = [...messages, userMessage];
    setMessages([...history, assistantMessage]);
    setInput("");
    setIsStreaming(true);

    const persist = (finalMessages: ChatMessage[]) => {
      saveThread(conversationId, finalMessages, text);
      setConversations(loadConversations());
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: conversationId,
          clientMessageId: assistantId,
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (response.status === 429) {
        throw new Error(
          "Você atingiu o limite de mensagens por minuto. Tente novamente em breve."
        );
      }

      if (response.status === 503) {
        const text = await response.text();
        throw new Error(text || "Cota gratuita diária atingida. Volte amanhã.");
      }

      if (!response.ok || !response.body) {
        throw new Error("Falha na resposta do assistente");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const { displayText } = splitMetaFromStream(accumulated);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: displayText } : m
          )
        );
      }

      const { displayText, meta } = splitMetaFromStream(accumulated);
      setMessages((prev) => {
        const next = prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: displayText, meta: meta ?? undefined, done: true }
            : m
        );
        persist(next);
        return next;
      });
      refreshQuota();
    } catch (err) {
      const isKnownMessage =
        err instanceof Error &&
        (err.message.includes("limite") ||
          err.message.includes("cota") ||
          err.message.includes("Cota"));
      const fallbackMessage = isKnownMessage
        ? (err as Error).message
        : "Não consegui responder agora. Tente novamente em instantes.";
      setMessages((prev) => {
        const next = prev.map((m) =>
          m.id === assistantId ? { ...m, content: fallbackMessage, done: true } : m
        );
        persist(next);
        return next;
      });
      refreshQuota();
    } finally {
      setIsStreaming(false);
    }
  }

  async function sendFeedback(messageId: string, rating: 1 | -1) {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedback: rating } : m))
    );
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientMessageId: messageId, rating }),
      });
    } catch {
      // feedback é melhor-esforço; falha silenciosa não deve afetar a conversa
    }
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <ConversationSidebar
        conversations={conversations}
        activeId={conversationId}
        onSelect={selectConversation}
        onNew={startNewConversation}
      />

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {quota && (
            <p
              className={`flex items-center gap-1.5 text-xs ${
                quota.remaining === 0 ? "text-signal" : "text-muted"
              }`}
            >
              <Gauge size={12} />
              {quota.remaining === 0
                ? "Cota gratuita do dia esgotada — volte amanhã"
                : `${quota.remaining}/${quota.limit} mensagens gratuitas restantes hoje`}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 self-end text-xs text-muted">
          <BrainCircuit size={14} />
          Mostrar raciocínio do agente
          <input
            type="checkbox"
            checked={showReasoning}
            onChange={(e) => setShowReasoning(e.target.checked)}
            className="accent-accent"
          />
        </label>

        <div className="flex min-h-[420px] flex-col gap-4 rounded-2xl border border-border bg-bg-elevated p-6">
          {messages.length === 0 && (
            <div>
              <p className="text-sm text-muted">
                Pergunte algo sobre mim, meus projetos ou como este site foi
                construído.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    disabled={quota?.remaining === 0}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors duration-200 hover:border-accent hover:text-accent disabled:opacity-40"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "fade-in-up self-end rounded-2xl bg-accent px-4 py-2 text-sm text-bg"
                  : "fade-in-up self-start max-w-[85%] rounded-2xl bg-bg px-4 py-3 text-sm text-fg"
              }
            >
              <p className="whitespace-pre-wrap">
                {message.content || (message.role === "assistant" ? "…" : "")}
              </p>

              {message.role === "assistant" && message.done && message.meta && (
                <p className="mt-2 flex items-center gap-1 text-xs text-muted">
                  <Timer size={12} />
                  {(message.meta.latencyMs / 1000).toFixed(1)}s
                  {message.meta.toolsUsed.length > 0 &&
                    ` · ${message.meta.toolsUsed.join(", ")}`}
                </p>
              )}

              {showReasoning && message.meta && (
                <ReasoningSteps steps={message.meta.steps} />
              )}

              {message.role === "assistant" && message.done && message.content && (
                <div className="mt-2 flex gap-2 text-muted">
                  <button
                    type="button"
                    aria-label="Resposta útil"
                    onClick={() => sendFeedback(message.id, 1)}
                    disabled={message.feedback !== undefined}
                    className={
                      message.feedback === 1
                        ? "text-signal"
                        : "transition-[color,transform] duration-200 hover:text-fg active:scale-90 disabled:opacity-40"
                    }
                  >
                    <ThumbsUp size={14} />
                  </button>
                  <button
                    type="button"
                    aria-label="Resposta não útil"
                    onClick={() => sendFeedback(message.id, -1)}
                    disabled={message.feedback !== undefined}
                    className={
                      message.feedback === -1
                        ? "text-signal"
                        : "transition-[color,transform] duration-200 hover:text-fg active:scale-90 disabled:opacity-40"
                    }
                  >
                    <ThumbsDown size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              quota?.remaining === 0
                ? "Cota gratuita do dia esgotada..."
                : "Escreva sua pergunta..."
            }
            disabled={isStreaming || quota?.remaining === 0}
            className="flex-1 rounded-full border border-border bg-bg px-4 py-3 text-sm text-fg outline-none transition-colors duration-200 focus:border-accent disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim() || quota?.remaining === 0}
            aria-label="Enviar mensagem"
            className="flex items-center justify-center rounded-full bg-accent px-4 text-bg transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:active:scale-100"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
