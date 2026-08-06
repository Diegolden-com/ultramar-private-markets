"use client";

import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

const storageKey = "ultramar-real-estate-theme";
const themeChangeEvent = "ultramar-real-estate-theme-change";

function getDocumentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  const themeColor = theme === "light" ? "#eef2ea" : "#101512";
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute("content", themeColor));

  try {
    window.localStorage.setItem(storageKey, theme);
  } catch {
    // The preference still applies for this visit when storage is unavailable.
  }

  window.dispatchEvent(new Event(themeChangeEvent));
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener(themeChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener(themeChangeEvent, onStoreChange);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getDocumentTheme, () => "dark");
  const isLight = theme === "light";

  function toggleTheme() {
    const nextTheme = isLight ? "dark" : "light";
    applyTheme(nextTheme);
  }

  const actionLabel = isLight ? "Activar modo oscuro" : "Activar modo claro";

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={actionLabel}
      aria-pressed={isLight}
      title={actionLabel}
      onClick={toggleTheme}
    >
      <span className="theme-toggle__glyph" aria-hidden="true">
        {isLight ? (
          <svg viewBox="0 0 20 20" focusable="false">
            <path d="M15.7 12.4A6.6 6.6 0 0 1 7.6 4.3 6.6 6.6 0 1 0 15.7 12.4Z" fill="none" stroke="currentColor" strokeWidth="1.45" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" focusable="false">
            <circle cx="10" cy="10" r="3.15" fill="none" stroke="currentColor" strokeWidth="1.45" />
            <path d="M10 1.85v2.2M10 15.95v2.2M18.15 10h-2.2M4.05 10h-2.2M15.76 4.24 14.2 5.8M5.8 14.2l-1.56 1.56M15.76 15.76 14.2 14.2M5.8 5.8 4.24 4.24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="square" />
          </svg>
        )}
      </span>
      <span className="theme-toggle__label" aria-hidden="true">
        {isLight ? "Oscuro" : "Claro"}
      </span>
    </button>
  );
}
