"use client";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full border border-border bg-surface px-3 py-2 text-sm shadow-soft hover:translate-y-px transition"
      aria-label="Toggle theme"
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
