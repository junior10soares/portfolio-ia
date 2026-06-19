export type TimelineEntry = {
  year: string;
  title: string;
  description: string;
};

export type AboutFrontmatter = {
  title: string;
  summary: string;
  heroTagline?: string;
  heroHighlight?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  githubRepos?: number;
  codingSince?: number;
  techCount?: number;
  quote?: string;
  timeline?: TimelineEntry[];
};

export type ProjectFrontmatter = {
  title: string;
  slug: string;
  summary: string;
  stack: string[];
  category:
    | "Inteligência Artificial"
    | "Agentes & MCP"
    | "Web"
    | "Automação"
    | "MLOps & Data";
  repoUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  videoFile?: string;
  image?: string;
  status: "ativo" | "arquivado" | "experimental";
  featured?: boolean;
  order?: number;
};

export type PostFrontmatter = {
  title: string;
  slug: string;
  summary: string;
  date: string;
  type: "post" | "video";
  videoUrl?: string;
  tags?: string[];
};

export type ContentEntry<T> = {
  frontmatter: T;
  content: string;
  slug: string;
};
