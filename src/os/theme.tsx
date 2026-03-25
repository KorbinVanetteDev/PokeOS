import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { emitQuestEvent } from "./questEvents";

export type ThemeMode = "dark" | "light";

export type WallpaperId = "kanto-night" | "kanto-day" | "aurora";

export type Theme = {
  mode: ThemeMode;
  accent: string;
  wallpaper: WallpaperId;
};

const KEY = "pokeos.theme.v1";

const defaultTheme: Theme = {
  mode: "dark",
  accent: "#2A75BB",
  wallpaper: "kanto-night",
};

function loadTheme(): Theme {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultTheme, ...JSON.parse(raw) } : defaultTheme;
  } catch {
    return defaultTheme;
  }
}

function saveTheme(t: Theme) {
  localStorage.setItem(KEY, JSON.stringify(t));
}

type ThemeCtx = {
  theme: Theme;
  setTheme: (next: Theme) => void;
  patchTheme: (patch: Partial<Theme>) => void;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => loadTheme());

  const patchTheme = (patch: Partial<Theme>) => {
    setTheme((t) => ({ ...t, ...patch }));
  };

  useEffect(() => {
    saveTheme(theme);

    const root = document.documentElement;
    root.style.setProperty("--poke-accent", theme.accent);

    if (theme.mode === "dark") {
      root.style.setProperty("--poke-bg", "#0b1220");
      root.style.setProperty("--poke-fg", "#F7F0D8");
      root.style.setProperty("--poke-panel", "rgba(11,18,32,0.88)");
    } else {
      root.style.setProperty("--poke-bg", "#f6f7fb");
      root.style.setProperty("--poke-fg", "#0b1220");
      root.style.setProperty("--poke-panel", "rgba(255,255,255,0.72)");
    }

    // Quest auto-completion: theme change counts as real action
    emitQuestEvent({
      type: "theme_changed",
      mode: theme.mode,
      wallpaper: theme.wallpaper,
    });
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme, patchTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

export function getWallpaperCss(wallpaper: WallpaperId) {
  switch (wallpaper) {
    case "kanto-day":
      return (
        "radial-gradient(1200px 600px at 20% 10%, rgba(255,255,255,0.65), transparent 60%)," +
        "radial-gradient(900px 500px at 80% 30%, rgba(42,117,187,0.18), transparent 60%)," +
        "linear-gradient(180deg, #dbeafe 0%, #f8fafc 100%)"
      );
    case "aurora":
      return (
        "radial-gradient(1000px 700px at 20% 20%, rgba(34,211,238,0.22), transparent 60%)," +
        "radial-gradient(900px 600px at 80% 40%, rgba(167,139,250,0.22), transparent 60%)," +
        "linear-gradient(180deg, #0b1220 0%, #070a12 100%)"
      );
    case "kanto-night":
    default:
      return (
        "radial-gradient(1200px 600px at 20% 10%, rgba(255,255,255,0.10), transparent 60%)," +
        "radial-gradient(1200px 600px at 80% 30%, rgba(42,117,187,0.22), transparent 60%)," +
        "linear-gradient(180deg, #101827 0%, #080c14 100%)"
      );
  }
}