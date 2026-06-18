import { Database } from "lucide-react";

export function VectorDbCard({ documentCount }: { documentCount: number }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-5">
      <div className="flex items-start justify-between">
        <Database size={22} className="text-accent" />
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">
          dados reais
        </span>
      </div>
      <h3 className="mt-3 font-display text-lg text-fg">Banco Vetorial</h3>
      <p className="mt-1 text-sm text-muted">
        pgvector (Supabase) indexando o conteúdo real deste site.
      </p>
      <p className="mt-4 font-display text-2xl text-fg">
        {documentCount} <span className="text-sm text-muted">chunks indexados</span>
      </p>
    </div>
  );
}
