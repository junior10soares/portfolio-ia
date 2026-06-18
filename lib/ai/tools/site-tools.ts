import { z } from "zod";
import type { ToolSet } from "ai";
import { getPosts } from "@/lib/db/content";
import { ragSearch } from "@/lib/ai/rag/retrieve";

/**
 * Tools "diretas" (não passam pelo protocolo MCP), por design:
 * - list_content: listagem simples, sem busca.
 * - rag_search: busca semântica (embeddings + pgvector) — propositalmente fora do
 *   MCP para contrastar com search_content (busca textual simples, exposta via MCP).
 *
 * get_projects, get_resume_summary, get_project_detail, search_content e
 * get_contact_info vivem em lib/ai/mcp/server.ts e chegam ao agente via
 * lib/ai/mcp/client.ts (descoberta dinâmica por listTools()).
 */
export const siteTools: ToolSet = {
  list_content: {
    description:
      "Lista posts/vídeos publicados no site, com título e resumo. Use quando perguntarem sobre conteúdo, artigos ou vídeos publicados.",
    inputSchema: z.object({}),
    execute: async () => {
      const posts = getPosts();
      return posts.map((p) => ({
        title: p.frontmatter.title,
        summary: p.frontmatter.summary,
        date: p.frontmatter.date,
        type: p.frontmatter.type,
      }));
    },
  },

  rag_search: {
    description:
      "Busca semântica no conteúdo real do site (sobre, projetos, posts) usando embeddings e banco vetorial. Use para perguntas específicas sobre detalhes que as outras ferramentas não cobrem diretamente — prefira esta ferramenta quando a pergunta exigir citar uma fonte do site.",
    inputSchema: z.object({
      query: z.string().describe("A pergunta ou termo de busca em linguagem natural"),
    }),
    execute: async ({ query }) => {
      const matches = await ragSearch(query);
      return matches.map((m) => ({
        content: m.content,
        source: m.sourceSlug,
        similarity: Number(m.similarity.toFixed(3)),
      }));
    },
  },
};
