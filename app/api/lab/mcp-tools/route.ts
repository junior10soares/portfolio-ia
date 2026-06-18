import { listMcpToolsRaw } from "@/lib/ai/mcp/client";

export const runtime = "nodejs";

export async function GET() {
  try {
    const tools = await listMcpToolsRaw();
    return Response.json({ tools });
  } catch (error) {
    console.error("Falha ao listar tools MCP:", error);
    return Response.json({ tools: [], error: "Falha ao conectar ao servidor MCP" }, { status: 500 });
  }
}
