"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

type Result = {
  similarity: number;
  dimensions: number;
  previewA: number[];
  previewB: number[];
};

export function EmbeddingsCompareDemo() {
  const [textA, setTextA] = useState("agente de IA que usa ferramentas");
  const [textB, setTextB] = useState("assistente que chama funções externas");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCompare(e: React.FormEvent) {
    e.preventDefault();
    if (!textA.trim() || !textB.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/lab/embeddings-compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textA, textB }),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-6">
      <h2 className="font-display text-xl text-fg">Comparador de embeddings</h2>
      <p className="mt-2 text-sm text-muted">
        Dois textos, dois vetores de 384 dimensões (gerados localmente via
        transformers.js), comparados por similaridade de cosseno — a mesma
        matemática usada pelo RAG deste site. Edite os textos de exemplo
        abaixo com o que quiser e clique em Comparar.
      </p>

      <form onSubmit={handleCompare} className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Texto A
          <input
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            className="rounded-full border border-border bg-bg px-4 py-2 text-sm text-fg outline-none transition-colors duration-200 focus:border-accent"
            placeholder="Digite o primeiro texto"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs text-muted">
          Texto B
          <input
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            className="rounded-full border border-border bg-bg px-4 py-2 text-sm text-fg outline-none transition-colors duration-200 focus:border-accent"
            placeholder="Digite o segundo texto"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 self-start rounded-full bg-accent px-4 py-2 text-sm text-bg transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:active:scale-100"
        >
          <Sparkles size={14} />
          Comparar
        </button>
      </form>

      {result && (
        <div className="mt-4 rounded-xl border border-border bg-bg p-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${Math.max(0, result.similarity) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-fg">
            Similaridade: <strong>{result.similarity}</strong> ({result.dimensions} dims)
          </p>
          <p className="mt-1 font-mono text-xs text-muted">
            A: [{result.previewA.join(", ")}...]
          </p>
          <p className="font-mono text-xs text-muted">
            B: [{result.previewB.join(", ")}...]
          </p>
        </div>
      )}
    </div>
  );
}
