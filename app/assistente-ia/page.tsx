import { Container } from "@/components/container";
import { AssistantChat } from "@/components/chat/assistant-chat";

export default function AssistenteIaPage() {
  return (
    <Container>
      <h1 className="font-display text-3xl text-fg sm:text-4xl">
        Assistente IA
      </h1>
      <p className="mt-3 max-w-xl text-muted">
        Converse com o assistente deste site: ele usa ferramentas reais, busca
        semântica no conteúdo e um protocolo MCP de verdade para responder com
        precisão sobre mim e meus projetos.
      </p>

      <div className="mt-8">
        <AssistantChat />
      </div>
    </Container>
  );
}
