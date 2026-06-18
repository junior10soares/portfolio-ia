import type { AgentStepPublic } from "@/lib/ai/chat-protocol";

export function ReasoningSteps({ steps }: { steps: AgentStepPublic[] }) {
  if (steps.length === 0) return null;

  return (
    <div className="mt-3 flex flex-col gap-2 rounded-xl border border-border bg-bg p-3 text-xs text-muted">
      {steps.map((step) => (
        <div key={step.stepNumber}>
          <p className="text-fg">Passo {step.stepNumber}</p>
          {step.thought && <p className="mt-1">Pensamento: {step.thought}</p>}
          {step.actions.map((action, i) => (
            <p key={i} className="mt-1">
              Ação: <span className="text-accent">{action.tool}</span>(
              {JSON.stringify(action.input)})
            </p>
          ))}
          {step.observations.map((obs, i) => (
            <p key={i} className="mt-1 truncate">
              Observação ({obs.tool}): {JSON.stringify(obs.output).slice(0, 200)}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
