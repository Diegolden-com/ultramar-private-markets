"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const storageKey = "ultramar-theme";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem(storageKey);
  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>("light");
  const nextTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    const preferredTheme = getPreferredTheme();
    applyTheme(preferredTheme);
    window.requestAnimationFrame(() => setTheme(preferredTheme));
  }, []);

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === "dark"}
      suppressHydrationWarning
      onClick={() => {
        setTheme(nextTheme);
        window.localStorage.setItem(storageKey, nextTheme);
        applyTheme(nextTheme);
      }}
      className={`inline-grid place-items-center border border-border-muted bg-surface-ink text-on-surface transition hover:border-status-signal hover:text-status-signal ${
        compact ? "h-10 w-10" : "h-9 w-9"
      }`}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
