"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";
import { NAV_LINKS, LAB_LINK } from "@/lib/nav";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-display text-sm font-semibold text-bg transition-transform duration-200 hover:scale-105"
        >
          JS
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border bg-bg-elevated/60 p-1 text-sm text-muted lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-1.5 transition-colors duration-200 ${
                  active
                    ? "bg-accent-soft text-fg"
                    : "hover:text-fg"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href={LAB_LINK.href}
          className="hidden items-center gap-1.5 rounded-full border border-accent/40 bg-accent-soft px-4 py-1.5 text-sm text-accent transition-[transform,border-color] duration-200 hover:scale-105 hover:border-accent sm:flex"
        >
          <Sparkles size={14} />
          {LAB_LINK.label}
        </Link>

        <button
          type="button"
          aria-label="Abrir menu"
          className="text-fg lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="fade-in flex flex-col gap-1 border-t border-border px-6 py-4 text-sm text-muted lg:hidden">
          {[...NAV_LINKS, LAB_LINK].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className="rounded-md px-2 py-2 transition-colors duration-200 hover:bg-bg-elevated hover:text-fg"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
