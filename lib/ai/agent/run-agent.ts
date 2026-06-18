import { generateText, stepCountIs, type ModelMessage, type ToolSet } from "ai";
import { geminiModel, ASSISTANT_SYSTEM_PROMPT } from "@/lib/ai/llm/gemini";
import { siteTools } from "@/lib/ai/tools/site-tools";
import { getMcpTools } from "@/lib/ai/mcp/client";

export type AgentStep = {
  stepNumber: number;
  thought: string;
  actions: { tool: string; input: unknown }[];
  observations: { tool: string; output: unknown }[];
};

export type AgentResult = {
  finalText: string;
  steps: AgentStep[];
  toolsUsed: string[];
  totalTokens: number;
};

const MAX_STEPS = 4;

/**
 * Loop de agente próprio (estilo ReAct), implementado por cima do AI SDK.
 * Cada iteração faz UMA chamada ao modelo (stopWhen: stepCountIs(1)), para que
 * a decisão de continuar ou finalizar seja nossa — não delegada ao auto-loop da lib.
 */
export async function runAgent(messages: ModelMessage[]): Promise<AgentResult> {
  const steps: AgentStep[] = [];
  const toolsUsed: string[] = [];
  let conversation = [...messages];
  let totalTokens = 0;

  let tools: ToolSet = siteTools;
  try {
    const mcpTools = await getMcpTools();
    tools = { ...mcpTools, ...siteTools };
  } catch (err) {
    console.error("Falha ao descobrir tools via MCP, seguindo só com tools diretas:", err);
  }

  for (let i = 0; i < MAX_STEPS; i++) {
    const result = await generateText({
      model: geminiModel,
      system: ASSISTANT_SYSTEM_PROMPT,
      messages: conversation,
      tools,
      stopWhen: stepCountIs(1),
      maxRetries: 1,
    });

    totalTokens += result.usage.totalTokens ?? 0;
    conversation = [...conversation, ...result.response.messages];

    if (result.toolCalls.length === 0) {
      steps.push({
        stepNumber: i + 1,
        thought: result.text,
        actions: [],
        observations: [],
      });
      return { finalText: result.text, steps, toolsUsed, totalTokens };
    }

    for (const call of result.toolCalls) {
      if (!toolsUsed.includes(call.toolName)) toolsUsed.push(call.toolName);
    }

    steps.push({
      stepNumber: i + 1,
      thought: result.text,
      actions: result.toolCalls.map((c) => ({ tool: c.toolName, input: c.input })),
      observations: result.toolResults.map((r) => ({
        tool: r.toolName,
        output: r.output,
      })),
    });
  }

  const fallback = await generateText({
    model: geminiModel,
    system: ASSISTANT_SYSTEM_PROMPT,
    messages: conversation,
    maxRetries: 1,
  });
  totalTokens += fallback.usage.totalTokens ?? 0;
  steps.push({
    stepNumber: MAX_STEPS + 1,
    thought: fallback.text,
    actions: [],
    observations: [],
  });
  return { finalText: fallback.text, steps, toolsUsed, totalTokens };
}
