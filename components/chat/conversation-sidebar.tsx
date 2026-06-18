import { Plus, MessageSquare } from "lucide-react";
import type { Conversation } from "@/lib/chat-history";

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
}: {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col rounded-2xl border border-border bg-bg-elevated p-4 lg:flex">
      <button
        type="button"
        onClick={onNew}
        className="flex items-center justify-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
      >
        <Plus size={14} />
        Nova conversa
      </button>

      <p className="mt-5 px-1 text-xs uppercase tracking-wide text-muted">
        Conversas
      </p>

      <div className="mt-2 flex flex-col gap-1 overflow-y-auto">
        {conversations.length === 0 && (
          <p className="px-1 py-2 text-xs text-muted">
            Suas conversas aparecem aqui.
          </p>
        )}
        {conversations.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            className={`flex items-start gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors duration-200 ${
              c.id === activeId
                ? "bg-accent-soft text-fg"
                : "text-muted hover:bg-bg hover:text-fg"
            }`}
          >
            <MessageSquare size={14} className="mt-0.5 shrink-0" />
            <span className="truncate">{c.title}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
