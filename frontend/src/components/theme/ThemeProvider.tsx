"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  /** Indica si el componente ya se montó en el cliente (evita mismatch SSR). */
  mounted: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "theme";

function applyDomTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* almacenamiento no disponible: ignoramos */
  }
}

/** Lee el tema vivo desde la clase del <html> (aplicada por el script inline). */
function getThemeSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Suscribe a cambios de clase en <html> para mantener el estado sincronizado. */
function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const noopSubscribe = () => () => {};

/**
 * Provee el tema actual y permite alternarlo. El tema real ya se aplica en
 * <html> mediante un script inline antes del primer paint (sin parpadeo);
 * aquí solo leemos ese estado externo con useSyncExternalStore (sin setState
 * en efectos) para sincronizar el botón de tema.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    () => "light" as Theme,
  );
  // `mounted` hidratación-seguro: false en SSR/primer render, true tras hidratar.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const setTheme = useCallback((next: Theme) => {
    applyDomTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    applyDomTheme(getThemeSnapshot() === "dark" ? "light" : "dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, mounted, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  }
  return ctx;
}
