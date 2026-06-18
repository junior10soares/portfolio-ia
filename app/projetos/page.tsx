import { Container } from "@/components/container";
import { ProjectFilter } from "@/components/project-filter";
import { getProjects } from "@/lib/db/content";

export default function ProjetosPage() {
  const projects = getProjects();

  return (
    <Container>
      <h1 className="font-display text-3xl text-fg sm:text-4xl">Projetos</h1>
      <p className="mt-3 max-w-xl text-muted">
        Uma seleção do que venho construindo, incluindo as peças que sustentam
        este próprio site.
      </p>

      <div className="mt-10">
        <ProjectFilter projects={projects} />
      </div>
    </Container>
  );
}
