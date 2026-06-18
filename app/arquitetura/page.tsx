import { Container } from "@/components/container";
import { FlowDiagram } from "@/components/architecture/flow-diagram";
import { StatsPanel } from "@/components/architecture/stats-panel";
import { getAgentStats } from "@/lib/db/supabase/stats";

export const revalidate = 60;

const REQUIREMENTS = [
  {
    title: "LLM",
    detail: "Google Gemini API via @ai-sdk/google, com streaming real.",
    path: "lib/ai/llm/gemini.ts",
  },
  {
    title: "APIs",
    detail: "Integração com Gemini, Supabase e o protocolo MCP via HTTP.",
    path: "app/api/*",
  },
  {
    title: "PostgreSQL",
    detail:
      "Um único Postgres (Supabase) com dois papéis: vetorial (documents) e relacional (agent_traces, message_feedback, rate_limit_counters).",
    path: "lib/db/supabase/*",
  },
  {
    title: "Tools / Function Calling",
    detail: "Tools com schema Zod, chamadas pelo modelo durante a geração.",
    path: "lib/ai/tools/site-tools.ts",
  },
  {
    title: "Agentes",
    detail:
      "Loop ReAct implementado à mão (Thought/Action/Observation), não o auto-loop da SDK.",
    path: "lib/ai/agent/run-agent.ts",
  },
  {
    title: "MCP",
    detail:
      "Servidor MCP real (Streamable HTTP) + cliente que descobre tools via listTools(), validado externamente com o MCP Inspector oficial.",
    path: "lib/ai/mcp/server.ts, lib/ai/mcp/client.ts",
  },
  {
    title: "RAG",
    detail: "Busca semântica sobre o conteúdo real do site, com citação de fonte.",
    path: "lib/ai/rag/retrieve.ts",
  },
  {
    title: "Embeddings",
    detail: "Modelo local (transformers.js, all-MiniLM-L6-v2, 384 dims), sem custo de API.",
    path: "lib/ai/embeddings/local-embedder.ts",
  },
  {
    title: "Banco Vetorial",
    detail: "pgvector dentro do mesmo Supabase, índice HNSW.",
    path: "tabela documents",
  },
];

const TRADEOFFS = [
  "transformers.js em serverless: cold start ao carregar o modelo, mitigado com runtime nodejs e indexação sempre offline.",
  "Latência extra do MCP via HTTP comparado a chamar a tool direto em processo — aceita conscientemente para que o protocolo seja real, não decorativo.",
  "Chat público exposto: mitigado com rate limiting em Postgres puro (rate_limit_counters), sem dependência externa tipo Redis.",
  "Índice vetorial é atualizado por um script offline/manual (scripts/index-content.ts) — não há reindexação automática a cada deploy ainda.",
];

export default async function ArquiteturaPage() {
  const stats = await getAgentStats();

  return (
    <Container>
      <h1 className="font-display text-3xl text-fg sm:text-4xl">Arquitetura</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Esta página documenta o que está de fato implementado neste site — não um
        diagrama genérico. Os números abaixo vêm do uso real do Assistente IA.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-xl text-fg">Uso real do assistente</h2>
        <div className="mt-4">
          <StatsPanel stats={stats} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl text-fg">Fluxo de uma pergunta</h2>
        <div className="mt-4">
          <FlowDiagram />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl text-fg">
          Os 9 requisitos, na prática
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {REQUIREMENTS.map((req) => (
            <div
              key={req.title}
              className="rounded-2xl border border-border bg-bg-elevated p-5"
            >
              <p className="font-display text-lg text-fg">{req.title}</p>
              <p className="mt-1 text-sm text-muted">{req.detail}</p>
              <p className="mt-2 font-mono text-xs text-accent">{req.path}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl text-fg">Validação do MCP</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          O servidor MCP deste site foi validado com o cliente oficial de
          terceiros (
          <code className="text-accent">
            npx @modelcontextprotocol/inspector --cli
          </code>
          ), confirmando que <code className="text-accent">tools/list</code> e{" "}
          <code className="text-accent">tools/call</code> funcionam por fora do
          código deste projeto — não é uma simulação.
        </p>
      </section>

      <section className="mt-12 mb-4">
        <h2 className="font-display text-xl text-fg">Trade-offs conscientes</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {TRADEOFFS.map((t) => (
            <li
              key={t}
              className="rounded-xl border border-border bg-bg-elevated p-4 text-sm text-muted"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
