import {
  SiTypescript,
  SiJavascript,
  SiNextdotjs,
  SiReact,
  SiNodedotjs,
  SiNestjs,
  SiPostgresql,
  SiSupabase,
  SiTailwindcss,
  SiPrisma,
  SiGooglegemini,
  SiModelcontextprotocol,
} from "@icons-pack/react-simple-icons";

export const STACK_ICONS = [
  { name: "TypeScript", Icon: SiTypescript, repoUrl: "https://github.com/microsoft/TypeScript" },
  { name: "JavaScript", Icon: SiJavascript, repoUrl: "https://github.com/tc39/ecma262" },
  { name: "Next.js", Icon: SiNextdotjs, repoUrl: "https://github.com/vercel/next.js" },
  { name: "React", Icon: SiReact, repoUrl: "https://github.com/facebook/react" },
  { name: "Node.js", Icon: SiNodedotjs, repoUrl: "https://github.com/nodejs/node" },
  { name: "Nest.js", Icon: SiNestjs, repoUrl: "https://github.com/nestjs/nest" },
  { name: "PostgreSQL", Icon: SiPostgresql, repoUrl: "https://github.com/postgres/postgres" },
  { name: "Supabase", Icon: SiSupabase, repoUrl: "https://github.com/supabase/supabase" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, repoUrl: "https://github.com/tailwindlabs/tailwindcss" },
  { name: "Prisma", Icon: SiPrisma, repoUrl: "https://github.com/prisma/prisma" },
  { name: "Gemini API", Icon: SiGooglegemini, repoUrl: "https://github.com/google-gemini" },
  { name: "MCP", Icon: SiModelcontextprotocol, repoUrl: "https://github.com/modelcontextprotocol" },
] as const;
