import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, ArrowUpRight, ExternalLink, PlayCircle } from "lucide-react";
import { Container } from "@/components/container";
import { getProject, getProjects } from "@/lib/db/content";
import { getYoutubeThumbnail } from "@/lib/youtube";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const videoThumbnail = project.frontmatter.videoUrl
    ? getYoutubeThumbnail(project.frontmatter.videoUrl)
    : null;
  const cover = project.frontmatter.image ?? videoThumbnail;

  return (
    <Container>
      <Link
        href="/projetos"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors duration-200 hover:text-fg"
      >
        <ArrowLeft size={14} />
        Voltar para Projetos
      </Link>

      <div className="mt-6 flex items-start justify-between gap-4">
        <h1 className="font-display text-3xl text-fg sm:text-4xl">
          {project.frontmatter.title}
        </h1>
        <div className="flex shrink-0 gap-2">
          {project.frontmatter.liveUrl && (
            <Link
              href={project.frontmatter.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-sm text-bg transition-opacity duration-200 hover:opacity-90"
            >
              <ExternalLink size={14} />
              Acessar
            </Link>
          )}
          {project.frontmatter.videoUrl && (
            <Link
              href={project.frontmatter.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              <PlayCircle size={14} />
              Vídeo
            </Link>
          )}
          {project.frontmatter.repoUrl && (
            <Link
              href={project.frontmatter.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              Repositório
              <ArrowUpRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {project.frontmatter.videoFile ? (
        <video
          controls
          poster={project.frontmatter.image}
          className="mt-6 h-56 w-full rounded-2xl border border-border object-cover sm:h-72"
        >
          <source src={project.frontmatter.videoFile} type="video/mp4" />
        </video>
      ) : (
        cover && (
        project.frontmatter.videoUrl ? (
          <Link
            href={project.frontmatter.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-6 block h-56 w-full overflow-hidden rounded-2xl border border-border sm:h-72"
            aria-label={`Ver vídeo de ${project.frontmatter.title} no YouTube`}
          >
            <Image
              src={cover}
              alt={project.frontmatter.title}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-bg/0 transition-colors duration-200 group-hover:bg-bg/30">
              <PlayCircle
                size={48}
                className="text-white opacity-0 drop-shadow transition-opacity duration-200 group-hover:opacity-90"
              />
            </div>
          </Link>
        ) : (
          <div className="relative mt-6 h-56 w-full overflow-hidden rounded-2xl border border-border sm:h-72">
            <Image
              src={cover}
              alt={project.frontmatter.title}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        )
      ))}

      <ul className="mt-4 flex flex-wrap gap-2">
        {project.frontmatter.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="prose-content mt-8">
        <MDXRemote source={project.content} />
      </div>
    </Container>
  );
}
