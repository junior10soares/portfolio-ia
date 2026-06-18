import { readCollection, readSingle } from "./read";
import type { AboutFrontmatter, ProjectFrontmatter, PostFrontmatter } from "./types";

export type {
  AboutFrontmatter,
  ProjectFrontmatter,
  PostFrontmatter,
  ContentEntry,
  TimelineEntry,
} from "./types";

export function getAbout() {
  return readSingle<AboutFrontmatter>("sobre");
}

export function getProjects() {
  return readCollection<ProjectFrontmatter>("projetos").sort(
    (a, b) => (a.frontmatter.order ?? 99) - (b.frontmatter.order ?? 99)
  );
}

export function getProject(slug: string) {
  return getProjects().find((p) => p.slug === slug);
}

export function getPosts() {
  return readCollection<PostFrontmatter>("posts").sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}
