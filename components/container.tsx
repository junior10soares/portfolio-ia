import type { ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
  return (
    <div className="fade-in-up mx-auto max-w-5xl px-6 py-16">{children}</div>
  );
}
