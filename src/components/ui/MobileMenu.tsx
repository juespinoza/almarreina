"use client";

import { NavItem } from "@/lib/types";
import { normalizePathname } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { normalize } from "path/win32";
import { useEffect, useMemo, useState } from "react";

export default function MobileMenu({
  items,
  rightSlot,
  title = "Menú",
}: {
  items: NavItem[];
  rightSlot?: React.ReactNode;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathnameRaw = usePathname();
  const pathname = normalizePathname(pathnameRaw || "/");

  // Base: asumimos que el primer link suele ser "Inicio" y su href es la base del café
  const base = useMemo(
    () => normalizePathname(items?.[0]?.href || "/"),
    [items]
  );

  function isActive(href: string) {
    const h = normalizePathname(href);
    if (h === base) return pathname === base; // Home exact match
    return pathname === h || pathname.startsWith(h + "/");
  }

  // Cerrar al navegar (cuando cambia el pathname)
  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathnameRaw]);

  // ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // lock scroll
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="md:hidden inline-flex items-center justify-center rounded-lg border border-border bg-surface px-3 py-2 shadow-soft hover:bg-primary2/15 transition"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-lg leading-none">{open ? "✕" : "☰"}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* overlay */}
          <button
            className="absolute inset-0 bg-black/40"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />

          {/* panel */}
          <div className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-surface border-l border-border shadow-soft p-5">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{title}</div>
              <button
                className="rounded-lg border border-border bg-bg px-3 py-2 text-sm hover:bg-primary2/15 transition"
                onClick={() => setOpen(false)}
              >
                Cerrar
              </button>
            </div>

            {rightSlot && <div className="mt-4">{rightSlot}</div>}

            <nav className="mt-6" aria-label="Menú móvil">
              <ul className="space-y-2">
                {items.map((it) => {
                  const active = isActive(it.href);

                  return (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        prefetch={false}
                        onClick={() => setOpen(false)}
                        className={[
                          "block rounded-lg border px-4 py-3 text-sm font-semibold transition",
                          active
                            ? "border-primary bg-primary2/20"
                            : "border-border bg-bg hover:bg-primary2/15",
                        ].join(" ")}
                        aria-current={active ? "page" : undefined}
                      >
                        {it.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* opcional: footer del drawer */}
            <div className="mt-8 text-xs text-muted">
              Tip: presioná <span className="font-semibold">ESC</span> para
              cerrar.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
