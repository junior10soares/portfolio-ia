import { getProjects, getPosts } from "./index";

export type TextSearchResult = {
  collection: "projetos" | "posts";
  slug: string;
  title: string;
  snippet: string;
};

/**
 * Busca textual simples (substring, case-insensitive) — propositalmente diferente
 * do RAG semântico (lib/ai/rag/retrieve.ts), para demonstrar as duas abordagens.
 */
export function searchContentText(query: string, limit = 5): TextSearchResult[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  const results: TextSearchResult[] = [];

  for (const project of getProjects()) {
    const haystack = `${project.frontmatter.title} ${project.frontmatter.summary} ${project.content}`.toLowerCase();
    if (haystack.includes(needle)) {
      results.push({
        collection: "projetos",
        slug: project.slug,
        title: project.frontmatter.title,
        snippet: project.frontmatter.summary,
      });
    }
  }

  for (const post of getPosts()) {
    const haystack = `${post.frontmatter.title} ${post.frontmatter.summary} ${post.content}`.toLowerCase();
    if (haystack.includes(needle)) {
      results.push({
        collection: "posts",
        slug: post.slug,
        title: post.frontmatter.title,
        snippet: post.frontmatter.summary,
      });
    }
  }

  return results.slice(0, limit);
}
