"use client";

import { useState } from "react";
import { Search, Sparkles, Server } from "lucide-react";
import { LabCard } from "@/components/lab/lab-card";
import { VectorDbCard } from "@/components/lab/vector-db-card";
import { ReactAgentCard } from "@/components/lab/react-agent-card";
import { MetricsCard } from "@/components/lab/metrics-card";
import { RagSearchDemo } from "@/components/lab/rag-search-demo";
import { McpToolsExplorer } from "@/components/lab/mcp-tools-explorer";
import { EmbeddingsCompareDemo } from "@/components/lab/embeddings-compare-demo";
import type { AgentStats } from "@/lib/db/supabase/stats";

type DemoKey = "rag" | "embeddings" | "mcp";

export function LabGrid({
  documentCount,
  stats,
}: {
  documentCount: number;
  stats: AgentStats;
}) {
  const [open, setOpen] = useState<DemoKey | null>(null);

  function toggle(key: DemoKey) {
    setOpen((prev) => (prev === key ? null : key));
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LabCard
          icon={Search}
          title="RAG Explorer"
          description="Faça perguntas e veja como o RAG busca informações relevantes."
          open={open === "rag"}
          onToggle={() => toggle("rag")}
        />
        <LabCard
          icon={Sparkles}
          title="Embeddings Visualizer"
          description="Compare dois textos e veja a similaridade entre seus embeddings."
          open={open === "embeddings"}
          onToggle={() => toggle("embeddings")}
        />
        <VectorDbCard documentCount={documentCount} />
        <ReactAgentCard />
        <LabCard
          icon={Server}
          title="MCP Playground"
          description="Liste as tools do servidor MCP real deste site em tempo real."
          open={open === "mcp"}
          onToggle={() => toggle("mcp")}
        />
        <MetricsCard stats={stats} />
      </div>

      {open && (
        <div className="fade-in mt-6">
          {open === "rag" && <RagSearchDemo />}
          {open === "embeddings" && <EmbeddingsCompareDemo />}
          {open === "mcp" && <McpToolsExplorer />}
        </div>
      )}
    </div>
  );
}
