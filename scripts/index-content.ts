import "dotenv/config";
import WebSocket from "ws";

// Node 20 não tem WebSocket global nativo (chegou só no Node 22).
// @supabase/realtime-js exige um construtor de WebSocket ao inicializar o client,
// mesmo quando não usamos nenhum recurso de realtime — este script roda fora do
// runtime do Next (que já provê esse polyfill), então precisamos suprir manualmente.
if (!globalThis.WebSocket) {
  // @ts-expect-error - polyfill mínimo só para satisfazer a inicialização do client
  globalThis.WebSocket = WebSocket;
}

import { getAbout, getProjects, getPosts } from "../lib/db/content";
import { chunkByParagraph } from "../lib/ai/rag/chunk";
import { embedText } from "../lib/ai/embeddings/local-embedder";
import { getSupabaseAdmin } from "../lib/db/supabase/client";

type DocChunk = {
  sourceSlug: string;
  content: string;
  metadata: Record<string, unknown>;
};

function buildChunks(): DocChunk[] {
  const chunks: DocChunk[] = [];

  const about = getAbout();
  chunks.push({
    sourceSlug: "sobre",
    content: about.frontmatter.summary,
    metadata: { title: "Sobre Mim", collection: "sobre" },
  });
  for (const paragraph of chunkByParagraph(about.content)) {
    chunks.push({
      sourceSlug: "sobre",
      content: paragraph,
      metadata: { title: "Sobre Mim", collection: "sobre" },
    });
  }

  for (const project of getProjects()) {
    const slug = `projetos/${project.slug}`;
    chunks.push({
      sourceSlug: slug,
      content: `${project.frontmatter.title}: ${project.frontmatter.summary}`,
      metadata: { title: project.frontmatter.title, collection: "projetos" },
    });
    for (const paragraph of chunkByParagraph(project.content)) {
      chunks.push({
        sourceSlug: slug,
        content: paragraph,
        metadata: { title: project.frontmatter.title, collection: "projetos" },
      });
    }
  }

  for (const post of getPosts()) {
    const slug = `posts/${post.slug}`;
    chunks.push({
      sourceSlug: slug,
      content: `${post.frontmatter.title}: ${post.frontmatter.summary}`,
      metadata: { title: post.frontmatter.title, collection: "posts" },
    });
    for (const paragraph of chunkByParagraph(post.content)) {
      chunks.push({
        sourceSlug: slug,
        content: paragraph,
        metadata: { title: post.frontmatter.title, collection: "posts" },
      });
    }
  }

  return chunks;
}

async function main() {
  const chunks = buildChunks();
  console.log(`Gerando embeddings para ${chunks.length} chunks...`);

  const supabase = getSupabaseAdmin();
  const sourceSlugs = [...new Set(chunks.map((c) => c.sourceSlug))];

  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .in("source_slug", sourceSlugs);

  if (deleteError) {
    throw new Error(`Falha ao limpar documents antigos: ${deleteError.message}`);
  }

  for (const chunk of chunks) {
    const embedding = await embedText(chunk.content);
    const { error } = await supabase.from("documents").insert({
      content: chunk.content,
      metadata: chunk.metadata,
      embedding,
      source_slug: chunk.sourceSlug,
    });
    if (error) {
      console.error(`Falha ao inserir chunk (${chunk.sourceSlug}):`, error.message);
    } else {
      console.log(`OK: ${chunk.sourceSlug} — "${chunk.content.slice(0, 50)}..."`);
    }
  }

  console.log("Indexação concluída.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
