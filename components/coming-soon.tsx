import { Construction } from "lucide-react";
import { Container } from "@/components/container";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Container>
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-bg-elevated p-10">
        <Construction size={28} className="text-signal" />
        <h1 className="font-display text-3xl text-fg">{title}</h1>
        <p className="max-w-xl text-muted">{description}</p>
        <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wide text-muted">
          Em construção
        </span>
      </div>
    </Container>
  );
}
