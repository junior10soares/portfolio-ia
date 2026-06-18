import { FlaskConical, Eye, BookOpen, Boxes, GraduationCap } from "lucide-react";

const DIFFERENTIALS = [
  {
    icon: Eye,
    title: "Transparência",
    description: "Raciocínio do agente, custo e latência sempre disponíveis.",
  },
  {
    icon: FlaskConical,
    title: "Demonstração prática",
    description: "Todas as tecnologias citadas estão implementadas e funcionando no site.",
  },
  {
    icon: BookOpen,
    title: "Conteúdo de qualidade",
    description: "Artigos sobre como cada peça de IA deste site foi construída.",
  },
  {
    icon: Boxes,
    title: "Arquitetura moderna",
    description: "Stack atual, 100% em serviços com camada gratuita.",
  },
  {
    icon: GraduationCap,
    title: "Foco em aprendizado",
    description: "Laboratório interativo para explorar cada tecnologia isoladamente.",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-xs uppercase tracking-wide text-muted">
          Diferenciais do portfólio
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {DIFFERENTIALS.map((item) => (
            <div key={item.title}>
              <item.icon size={18} className="text-accent" />
              <p className="mt-2 text-sm font-medium text-fg">{item.title}</p>
              <p className="mt-1 text-xs text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-border px-6 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Junior Soares.</p>
        <p>Construído com Next.js, Supabase e Gemini API.</p>
      </div>
    </footer>
  );
}
