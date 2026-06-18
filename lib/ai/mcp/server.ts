import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getAbout, getProjects, getProject } from "@/lib/db/content";
import { searchContentText } from "@/lib/db/content/search";

/**
 * Cria uma instância nova do servidor MCP por requisição (stateless), já que o
 * runtime serverless da Vercel não garante continuidade de processo entre chamadas.
 * Todas as tools são read-only — nenhuma tem efeito colateral.
 */
export function createMcpServer() {
  const server = new McpServer({
    name: "portfolio-junior-soares",
    version: "1.0.0",
  });

  server.registerTool(
    "get_projects",
    {
      description:
        "Lista os projetos do portfólio, com stack técnica e status.",
      inputSchema: {},
    },
    async () => {
      const projects = getProjects().map((p) => ({
        slug: p.slug,
        title: p.frontmatter.title,
        summary: p.frontmatter.summary,
        stack: p.frontmatter.stack,
        status: p.frontmatter.status,
      }));
      return { content: [{ type: "text", text: JSON.stringify(projects) }] };
    }
  );

  server.registerTool(
    "get_project_detail",
    {
      description: "Retorna os detalhes completos de um projeto pelo slug.",
      inputSchema: { slug: z.string().describe("Slug do projeto") },
    },
    async ({ slug }) => {
      const project = getProject(slug);
      if (!project) {
        return {
          content: [{ type: "text", text: `Projeto "${slug}" não encontrado.` }],
          isError: true,
        };
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              title: project.frontmatter.title,
              summary: project.frontmatter.summary,
              stack: project.frontmatter.stack,
              status: project.frontmatter.status,
              repoUrl: project.frontmatter.repoUrl ?? null,
              content: project.content,
            }),
          },
        ],
      };
    }
  );

  server.registerTool(
    "get_resume_summary",
    {
      description: "Retorna um resumo sobre o autor do portfólio.",
      inputSchema: {},
    },
    async () => {
      const about = getAbout();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              summary: about.frontmatter.summary,
              bio: about.content.trim(),
            }),
          },
        ],
      };
    }
  );

  server.registerTool(
    "search_content",
    {
      description:
        "Busca textual simples (substring) em projetos e posts publicados. Diferente de uma busca semântica.",
      inputSchema: { query: z.string().describe("Termo de busca") },
    },
    async ({ query }) => {
      const results = searchContentText(query);
      return { content: [{ type: "text", text: JSON.stringify(results) }] };
    }
  );

  server.registerTool(
    "get_contact_info",
    {
      description: "Retorna informações de contato do autor do portfólio.",
      inputSchema: {},
    },
    async () => {
      const about = getAbout();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              email: about.frontmatter.email,
              github: about.frontmatter.github,
              linkedin: about.frontmatter.linkedin,
            }),
          },
        ],
      };
    }
  );

  return server;
}
