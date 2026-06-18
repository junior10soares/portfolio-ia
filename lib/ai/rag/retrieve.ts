import { embedText } from "@/lib/ai/embeddings/local-embedder";
import { getSupabaseAdmin } from "@/lib/db/supabase/client";

export type RagMatch = {
  content: string;
  metadata: Record<string, unknown>;
  sourceSlug: string;
  similarity: number;
};

export async function ragSearch(
  query: string,
  matchCount = 4,
  matchThreshold = 0.3
): Promise<RagMatch[]> {
  const queryEmbedding = await embedText(query);
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
  });

  if (error) {
    console.error("Falha na busca vetorial:", error.message);
    return [];
  }

  return (data ?? []).map((row: {
    content: string;
    metadata: Record<string, unknown>;
    source_slug: string;
    similarity: number;
  }) => ({
    content: row.content,
    metadata: row.metadata,
    sourceSlug: row.source_slug,
    similarity: row.similarity,
  }));
}
