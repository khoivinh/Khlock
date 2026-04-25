import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "happy" | "system";
type ResolvedTheme = "dark" | "light" | "happy";

type ThemeProviderContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
};

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined);

/** Write the resolved theme color into <meta name="theme-color"> so the iOS
 *  Safari status-bar / Android Chrome address-bar tint follows the in-app
 *  theme (System / Light / Dark / Happy), not just the OS color-scheme.
 *  index.html ships a single `<meta name="theme-color">` (no media= attr)
 *  whose `content` is overwritten here on every resolved-theme change. */
function applyThemeColor(resolved: ResolvedTheme) {
  const color =
    resolved === "dark"  ? "#171717" :
    resolved === "happy" ? "#FFD900" :
                           "#FFFFFF";
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", color);
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "world-happyhour-theme",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "happy");

    let resolved: ResolvedTheme;
    if (theme === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      resolved = theme;
    }

    root.classList.add(resolved);
    applyThemeColor(resolved);
    setResolvedTheme(resolved);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark", "happy");
        const resolved = mediaQuery.matches ? "dark" : "light";
        root.classList.add(resolved);
        applyThemeColor(resolved);
        setResolvedTheme(resolved);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  const value = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
