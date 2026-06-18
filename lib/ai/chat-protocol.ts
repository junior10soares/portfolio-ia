// Marcador usado para anexar metadados (tools usadas, passos do agente, latência) ao
// final do stream de texto puro. Caractere de controle improvável de aparecer no texto.
export const META_MARKER = " __META__:";

// Espelha o shape de AgentStep (lib/ai/agent/run-agent.ts), duplicado aqui de propósito
// para este módulo (importado por componentes client) não depender do módulo server-only do agente.
export type AgentStepPublic = {
  stepNumber: number;
  thought: string;
  actions: { tool: string; input: unknown }[];
  observations: { tool: string; output: unknown }[];
};

export type ChatMeta = {
  toolsUsed: string[];
  steps: AgentStepPublic[];
  latencyMs: number;
};

export function splitMetaFromStream(accumulated: string): {
  displayText: string;
  meta: ChatMeta | null;
} {
  const idx = accumulated.indexOf(META_MARKER);
  if (idx === -1) return { displayText: accumulated, meta: null };

  const displayText = accumulated.slice(0, idx);
  const raw = accumulated.slice(idx + META_MARKER.length);
  try {
    return { displayText, meta: JSON.parse(raw) };
  } catch {
    return { displayText, meta: null };
  }
}
