import { PlayCircle, FileText } from "lucide-react";
import type { PostFrontmatter } from "@/lib/db/content";

export function PostCard({ post }: { post: PostFrontmatter }) {
  const Icon = post.type === "video" ? PlayCircle : FileText;
  const date = new Date(post.date).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
  });

  return (
    <article className="flex gap-4 rounded-2xl border border-border bg-bg-elevated p-6 transition-[transform,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-accent/40">
      <Icon size={20} className="mt-1 shrink-0 text-accent" />
      <div>
        <p className="text-xs uppercase tracking-wide text-muted">{date}</p>
        <h3 className="mt-1 font-display text-lg text-fg">{post.title}</h3>
        <p className="mt-2 text-sm text-muted">{post.summary}</p>
      </div>
    </article>
  );
}
