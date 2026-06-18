import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { dynamicTool, jsonSchema, type ToolSet } from "ai";

function getBaseUrl(): string {
  if (process.env.MCP_BASE_URL) return process.env.MCP_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function createMcpClient() {
  const client = new Client({ name: "portfolio-agent", version: "1.0.0" });
  const transport = new StreamableHTTPClientTransport(
    new URL(`${getBaseUrl()}/api/mcp`)
  );
  await client.connect(transport);
  return client;
}

function extractToolOutput(result: {
  content: Array<{ type: string; text?: string }>;
}): unknown {
  const textPart = result.content.find((part) => part.type === "text");
  if (!textPart?.text) return null;
  try {
    return JSON.parse(textPart.text);
  } catch {
    return textPart.text;
  }
}

/**
 * Descobre dinamicamente as tools do nosso próprio servidor MCP (via listTools())
 * e as adapta para o formato de tool do AI SDK. O agente nunca conhece os nomes
 * das tools de antemão — eles vêm sempre do protocolo MCP em tempo de execução.
 */
export async function getMcpTools(): Promise<ToolSet> {
  const client = await createMcpClient();
  const { tools } = await client.listTools();

  const toolSet: ToolSet = {};
  for (const mcpTool of tools) {
    toolSet[mcpTool.name] = dynamicTool({
      description: mcpTool.description ?? "",
      inputSchema: jsonSchema(
        (mcpTool.inputSchema ?? { type: "object", properties: {} }) as Parameters<
          typeof jsonSchema
        >[0]
      ),
      execute: async (input) => {
        const result = await client.callTool({
          name: mcpTool.name,
          arguments: (input ?? {}) as Record<string, unknown>,
        });
        return extractToolOutput(
          result as { content: Array<{ type: string; text?: string }> }
        );
      },
    });
  }
  return toolSet;
}

export type McpToolInfo = {
  name: string;
  description: string;
  inputSchema: unknown;
};

/**
 * Lista as tools do servidor MCP em formato "crú" (sem adaptar para o AI SDK) —
 * usado pela demo do Laboratório IA para mostrar o que listTools() retorna de verdade.
 */
export async function listMcpToolsRaw(): Promise<McpToolInfo[]> {
  const client = await createMcpClient();
  const { tools } = await client.listTools();
  return tools.map((t) => ({
    name: t.name,
    description: t.description ?? "",
    inputSchema: t.inputSchema,
  }));
}
