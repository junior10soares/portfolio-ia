"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/project-card";
import type { ProjectFrontmatter } from "@/lib/db/content";

const CATEGORIES = [
  "Todos",
  "Inteligência Artificial",
  "Agentes & MCP",
  "Web",
  "Automação",
  "MLOps & Data",
] as const;

export function ProjectFilter({
  projects,
}: {
  projects: { slug: string; frontmatter: ProjectFrontmatter }[];
}) {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("Todos");

  const filtered =
    active === "Todos"
      ? projects
      : projects.filter((p) => p.frontmatter.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors duration-200 ${
              active === category
                ? "border-accent bg-accent-soft text-fg"
                : "border-border text-muted hover:text-fg"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project.frontmatter} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted">
            Nenhum projeto nessa categoria ainda.
          </p>
        )}
      </div>
    </div>
  );
}
