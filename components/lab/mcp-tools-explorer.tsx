"use client";

import { useEffect, useState } from "react";
import { Server } from "lucide-react";
import type { McpToolInfo } from "@/lib/ai/mcp/client";

export function McpToolsExplorer() {
  const [tools, setTools] = useState<McpToolInfo[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/lab/mcp-tools")
      .then((res) => res.json())
      .then((data) => setTools(data.tools ?? []))
      .catch(() => setError(true));
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-6">
      <h2 className="font-display text-xl text-fg">Servidor MCP, em tempo real</h2>
      <p className="mt-2 text-sm text-muted">
        Esta lista vem de uma chamada real <code className="text-accent">listTools()</code>{" "}
        ao nosso próprio servidor MCP (<code className="text-accent">/api/mcp</code>) —
        nada aqui está hardcoded.
      </p>

      {error && (
        <p className="mt-4 text-sm text-muted">Não foi possível conectar ao servidor MCP.</p>
      )}

      {!tools && !error && <p className="mt-4 text-sm text-muted">Carregando...</p>}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {tools?.map((tool) => (
          <div key={tool.name} className="rounded-xl border border-border bg-bg p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-fg">
              <Server size={14} className="text-accent" />
              {tool.name}
            </p>
            <p className="mt-1 text-xs text-muted">{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
