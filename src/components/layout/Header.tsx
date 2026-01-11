"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "../ui/ThemeToggle";
import LocaleSwitch from "../ui/LocaleSwitch";
import MobileMenu from "../ui/MobileMenu";
import { normalizePathname } from "@/lib/utils";

export default function Header({
  locale,
  cafe,
  nav,
  siteName = "Coffee Template",
}: {
  locale: string;
  cafe: string;
  nav: any;
  siteName?: string;
}) {
  const pathnameRaw = usePathname();
  const pathname = normalizePathname(pathnameRaw || "/");
  const base = normalizePathname(`/${locale}`);

  const links = [
    { href: base, label: nav.home },
    { href: `${base}/menu`, label: nav.menu },
    { href: `${base}/products`, label: nav.products },
    { href: `${base}/about`, label: nav.about },
    { href: `${base}/contact`, label: nav.contact },
  ];

  function isActive(href: string) {
    const h = normalizePathname(href);
    if (h === base) return pathname === base; // Home solo exact match
    return pathname === h || pathname.startsWith(h + "/"); // subrutas
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href={base} className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary/10 border border-border" />
          <span className="font-semibold">{siteName}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  "px-4 py-2 rounded-full text-sm transition",
                  active ? "bg-primary2/25" : "hover:bg-primary2/20",
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitch currentLocale={locale} />
          <ThemeToggle />
          <MobileMenu
            items={links}
            rightSlot={
              <div className="flex items-center justify-between gap-3">
                <LocaleSwitch currentLocale={locale} />
                <ThemeToggle />
              </div>
            }
          />
        </div>
      </div>
    </header>
  );
}
