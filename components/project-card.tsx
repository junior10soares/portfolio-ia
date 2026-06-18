import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, PlayCircle } from "lucide-react";
import type { ProjectFrontmatter } from "@/lib/db/content";
import { getYoutubeThumbnail } from "@/lib/youtube";

export function ProjectCard({
  project,
}: {
  project: ProjectFrontmatter;
}) {
  const videoThumbnail = project.videoUrl ? getYoutubeThumbnail(project.videoUrl) : null;
  const cover = project.image ?? videoThumbnail;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-bg-elevated transition-[transform,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-accent/60">
      {cover ? (
        project.videoUrl ? (
          <Link
            href={project.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block h-32 w-full overflow-hidden"
            aria-label={`Ver vídeo de ${project.title} no YouTube`}
          >
            <Image
              src={cover}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-bg/0 transition-colors duration-200 group-hover:bg-bg/30">
              <PlayCircle
                size={32}
                className="text-white opacity-0 drop-shadow transition-opacity duration-200 group-hover:opacity-90"
              />
            </div>
          </Link>
        ) : (
          <div className="relative h-32 w-full overflow-hidden">
            <Image
              src={cover}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )
      ) : (
        <div className="flex h-24 items-center justify-center bg-gradient-to-br from-accent-soft via-bg-elevated to-bg">
          <Sparkles size={28} className="text-accent/70" />
        </div>
      )}

      <div className="p-6">
        <p className="text-xs uppercase tracking-wide text-accent">
          {project.category}
        </p>
        <h3 className="mt-1 font-display text-xl text-fg">{project.title}</h3>
        <p className="mt-2 text-sm text-muted">{project.summary}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
          <Link
            href={`/projetos/${project.slug}`}
            className="text-accent transition-opacity duration-200 hover:opacity-80"
          >
            Ver detalhes
          </Link>
          {project.videoUrl && (
            <Link
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted transition-colors duration-200 group-hover:text-fg"
            >
              <PlayCircle size={14} />
              Vídeo
            </Link>
          )}
          {project.repoUrl && (
            <Link
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted transition-colors duration-200 group-hover:text-fg"
            >
              Repositório
              <ArrowUpRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
