import { Container } from "@/components/container";
import { LabGrid } from "@/components/lab/lab-grid";
import { getDocumentCount } from "@/lib/db/supabase/vector-count";
import { getAgentStats } from "@/lib/db/supabase/stats";

export const revalidate = 60;

export default async function LaboratorioIaPage() {
  const [documentCount, stats] = await Promise.all([
    getDocumentCount(),
    getAgentStats(),
  ]);

  return (
    <Container>
      <h1 className="font-display text-3xl text-fg sm:text-4xl">
        Laboratório IA
      </h1>
      <p className="mt-3 max-w-xl text-muted">
        Bônus opcional para os curiosos: demos isoladas de cada peça técnica,
        sem precisar entender tudo para aproveitar o resto do site.
      </p>

      <div className="mt-8">
        <LabGrid documentCount={documentCount} stats={stats} />
      </div>
    </Container>
  );
}
