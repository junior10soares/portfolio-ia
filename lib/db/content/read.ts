import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ContentEntry } from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export function readCollection<T>(collection: string): ContentEntry<T>[] {
  const dir = path.join(CONTENT_ROOT, collection);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");
      return { frontmatter: data as T, content, slug };
    });
}

export function readSingle<T>(relativePath: string): ContentEntry<T> {
  const filePath = path.join(CONTENT_ROOT, `${relativePath}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data as T, content, slug: relativePath };
}
