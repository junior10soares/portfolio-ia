import { getSupabaseAdmin } from "./client";

export async function getDocumentCount(): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { count } = await supabase
    .from("documents")
    .select("id", { count: "exact", head: true });
  return count ?? 0;
}
