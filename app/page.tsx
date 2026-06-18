import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowRight, FolderGit2, Layers, CalendarDays, Sparkles } from "lucide-react";
import { Container } from "@/components/container";
import { Timeline } from "@/components/timeline";
import { StackGrid } from "@/components/stack-grid";
import { SocialLinks } from "@/components/social-links";
import { getAbout } from "@/lib/db/content";

export default function Home() {
  const about = getAbout();

  const tagline = about.frontmatter.heroTagline ?? about.frontmatter.summary;
  const highlight = about.frontmatter.heroHighlight;
  const [taglineStart, taglineEnd] =
    highlight && tagline.includes(highlight)
      ? [tagline.slice(0, tagline.lastIndexOf(highlight)), highlight]
      : [tagline, ""];

  const yearsCoding = about.frontmatter.codingSince
    ? new Date().getFullYear() - about.frontmatter.codingSince
    : null;

  const stats = [
    {
      icon: FolderGit2,
      value: about.frontmatter.githubRepos ? `${about.frontmatter.githubRepos}+` : "—",
      label: "Repositórios no GitHub",
    },
    {
      icon: CalendarDays,
      value: yearsCoding ? `${yearsCoding}+` : "—",
      label: "Anos escrevendo código",
    },
    {
      icon: Layers,
      value: about.frontmatter.techCount ? `${about.frontmatter.techCount}+` : "—",
      label: "Tecnologias dominadas",
    },
    {
      icon: Sparkles,
      value: "24/7",
      label: "Assistente IA disponível",
    },
  ];

  return (
    <Container>
      <div className="flex flex-col items-center gap-10 sm:flex-row sm:justify-between">
        <div className="flex-1">
          <p className="text-sm uppercase tracking-widest text-accent">
            Engenharia de IA
          </p>
          <h1 className="mt-4 max-w-xl font-display text-4xl leading-tight text-fg sm:text-5xl">
            {taglineStart}
            {taglineEnd && <span className="text-accent">{taglineEnd}</span>}
          </h1>
          <p className="mt-5 max-w-lg text-muted">{about.frontmatter.summary}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/projetos"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-bg transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-95"
            >
              Ver Projetos
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/assistente-ia"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-fg transition-[border-color,transform] duration-200 hover:border-accent active:scale-95"
            >
              Conversar com IA
            </Link>
          </div>
        </div>

        <div className="slide-in-right relative mx-auto h-56 w-56 shrink-0 sm:mx-0 sm:h-72 sm:w-72 sm:self-center">
          <div className="absolute inset-0 scale-110 rounded-full bg-accent/25 blur-2xl" />
          <Image
            src="/profile.png"
            alt="Junior Soares"
            fill
            sizes="288px"
            unoptimized
            className="relative rounded-full object-cover"
            priority
          />
        </div>
      </div>

      <StackGrid />

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-bg-elevated p-4"
          >
            <stat.icon size={16} className="text-accent" />
            <p className="mt-2 font-display text-2xl text-fg">{stat.value}</p>
            <p className="text-xs text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {about.frontmatter.timeline && about.frontmatter.timeline.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl text-fg">Linha do tempo</h2>
          <div className="mt-6">
            <Timeline entries={about.frontmatter.timeline} />
          </div>
        </section>
      )}

      <div className="prose-content mt-16">
        <MDXRemote source={about.content} />
      </div>

      <div className="mt-10">
        <SocialLinks
          github={about.frontmatter.github}
          linkedin={about.frontmatter.linkedin}
        />
      </div>
    </Container>
  );
}
