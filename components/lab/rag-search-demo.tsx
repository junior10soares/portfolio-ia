"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type Match = {
  content: string;
  sourceSlug: string;
  similarity: number;
};

export function RagSearchDemo() {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/lab/rag-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setMatches(data.matches ?? []);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-6">
      <h2 className="font-display text-xl text-fg">Busca semântica</h2>
      <p className="mt-2 text-sm text-muted">
        Digite algo e veja quais trechos do conteúdo real deste site (Sobre,
        Projetos, Posts) são semanticamente mais próximos — o mesmo mecanismo
        que o Assistente IA usa por trás dos panos via embeddings e
        pgvector.
      </p>

      <form onSubmit={handleSearch} className="mt-4 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: como o RAG deste site funciona?"
          className="flex-1 rounded-full border border-border bg-bg px-4 py-2 text-sm text-fg outline-none transition-colors duration-200 focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          aria-label="Buscar"
          className="flex items-center justify-center rounded-full bg-accent px-4 text-bg transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:active:scale-100"
        >
          <Search size={16} />
        </button>
      </form>

      <div className="mt-4 flex flex-col gap-2">
        {loading && <p className="text-sm text-muted">Buscando...</p>}

        {!loading && searched && matches.length === 0 && (
          <p className="text-sm text-muted">
            Nenhum trecho suficientemente próximo encontrado.
          </p>
        )}

        {matches.map((m, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-bg p-4 text-sm"
          >
            <p className="text-fg">{m.content}</p>
            <p className="mt-2 text-xs text-muted">
              fonte: {m.sourceSlug} · similaridade: {m.similarity}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
