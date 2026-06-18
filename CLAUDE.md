# CLAUDE.md

Guia de contexto para trabalhar neste repositório. Leia antes de implementar qualquer fase.

## O que é este projeto

Portfólio pessoal focado em Engenharia de IA. Além de mostrar projetos/conteúdo, o site **demonstra na prática** nove competências dentro do próprio produto: LLM, APIs, PostgreSQL, Tools/Function Calling, Agentes, MCP, RAG, Embeddings e Banco Vetorial.

Plano completo (arquitetura, roadmap faseado, riscos, critérios de verificação): `/home/juniorsoares/.claude/plans/agora-inicialmente-quero-que-parallel-lamport.md`. Esse arquivo é a fonte de verdade do roadmap — consulte-o ao iniciar cada fase.

## Princípio de design (não negociável)

**Superfície simples, profundidade opcional.** Home/Sobre Mim não tem checklist de tecnologias — tom humano. Toda complexidade técnica (raciocínio do agente, custo/latência, estatísticas) é escondida por padrão e expansível sob demanda. O Laboratório IA é rotulado como bônus opcional, nunca pré-requisito. Antes de adicionar algo visível por padrão na UI principal, pergunte: "isso cansa o visitante casual?" — se sim, esconda atrás de um toggle.

**Custo zero e disponibilidade 24h sem depender de máquina própria.** Toda peça da stack roda em serviço cloud com free tier (Vercel, Supabase, Gemini API). Nada em produção pode depender de um processo rodando no computador do usuário. A única exceção é o script de indexação do RAG, que é intencionalmente offline/manual.

## UX/UI

**Estilo mais próximo de produto SaaS de IA — cards, badges de tecnologia, stat cards, gradient blobs, diagrama de arquitetura com boxes coloridos por camada — inspirado em uma referência visual aprovada pelo usuário.

Prioridades:

1. Fidelidade à referência visual aprovada
2. Motion Design (animações em scroll, hover, entrada de elementos — usar onde fizer sentido)
3. Storytelling
4. Responsividade
5. Performance

Manter: paleta dark com acento violeta já estabelecida (ver tokens em `app/globals.css`), sem inventar dados (stats, timeline, certificações) — esses só entram quando o usuário fornecer os números/fatos reais.

## Performance

- Lazy loading sempre que possível.
- Componentes pesados apenas sob demanda.
- Embeddings nunca gerados em páginas públicas.
- Evitar chamadas LLM na Home.
- Priorizar SSG para páginas institucionais.

## Não implementar nesta fase

- Autenticação de usuários
- Área administrativa complexa
- Multi tenant
- Pagamentos
- Marketplace
- CMS externo
- Sistema de cursos
- Sistema de comunidade

O foco é portfolio pessoal.

## Stack e decisões já tomadas (não reabrir sem necessidade)

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS, deploy na Vercel.
- **Backend de IA**: sem serviço separado — tudo em Next.js Route Handlers, `runtime: 'nodejs'` (nunca Edge, por causa do transformers.js).
- **Banco**: Supabase (Postgres único) com dois papéis:
  - Vetorial: tabela `documents` + `pgvector` (RAG).
  - Relacional: `agent_traces`, `message_feedback`, `rate_limit_counters` (telemetria, feedback, rate limit — sem dependências externas tipo Redis).
- **Embeddings**: `transformers.js` (`Xenova/all-MiniLM-L6-v2`, 384 dims), local, sem custo de API. Geração de embeddings sempre em processo Node puro (script de indexação roda offline, nunca em request-time para indexar; query embedding em runtime é aceitável).
- **LLM**: Google Gemini API via `@ai-sdk/google` (modelo `gemini-2.0-flash` ou equivalente do free tier). Escolhido no lugar de Anthropic para manter o projeto 100% gratuito e rodando 24h sem custo. Não adicionar OpenRouter/multi-provider nesta fase (fica para Fase 8 opcional).
- **Orquestração**: Vercel AI SDK (`ai`) para streaming/tool-calling. Agent loop é **implementação própria** (estilo ReAct: Thought/Action/Observation explícito e logado) por cima do SDK — não depender só do auto-loop da lib, o objetivo é demonstrar o mecanismo.
- **MCP**: `@modelcontextprotocol/sdk`, transporte HTTP/Streamable (stdio não funciona em serverless). Cliente MCP descobre tools dinamicamente via `listTools()` — nunca hardcodar a lista de tools do servidor no cliente.
- **Sem MCP Inspector embutido na UI.** Validação de MCP é feita externamente (`npx @modelcontextprotocol/inspector`) e documentada por GIF/print na página de Arquitetura.
- **Projeto irmão `01-smart-model-router-gateway`**: não reaproveitar como base de backend. Citar apenas como card na página Projetos, com nota explicando a decisão.

## Convenções de estrutura

```
/app/(site)/...        páginas estáticas/SSG (MDX): sobre, projetos, conteudo, arquitetura
/app/(app)/...          páginas client-heavy: assistente-ia, laboratorio-ia
/app/api/...            Route Handlers (chat, feedback, lab/embed, lab/rag-search, mcp)
/lib/ai/llm             wrapper Gemini (@ai-sdk/google)
/lib/ai/agent           loop ReAct + persistência em agent_traces
/lib/ai/tools           tool defs (zod)
/lib/ai/mcp             client.ts e server.ts
/lib/ai/rag             retrieve.ts
/lib/ai/embeddings      wrapper transformers.js
/lib/db/supabase        client supabase-js (queries vetoriais e relacionais)
/lib/db/content         leitura de /content (fonte única para render e indexação)
/scripts/index-content.ts  indexação offline (chunking + embeddings + upsert)
/content/*.mdx          fonte de verdade do conteúdo (about/projetos/posts)
```

`/content` é a única fonte de conteúdo: tanto para renderizar páginas quanto para indexar no RAG. Nunca duplicar conteúdo em outro lugar (ex: não recriar texto do "Sobre Mim" hardcoded em componente).

## Variáveis de ambiente esperadas

```
GOOGLE_GENERATIVE_AI_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` só é usada server-side (Route Handlers/scripts), nunca exposta ao client. `GOOGLE_GENERATIVE_AI_API_KEY` é a chave gratuita do Gemini API (Google AI Studio).

## Como trabalhar fase a fase

O roadmap (Fases 0-8) está no plano referenciado acima. Cada fase deve ser entregável e testável isoladamente — ver seção "Verificação ao final de cada fase" do plano antes de considerar uma fase concluída. Não pular fases nem implementar features de fases futuras adiantado sem alinhar antes.
