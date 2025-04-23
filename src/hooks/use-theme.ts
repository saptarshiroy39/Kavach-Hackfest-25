import { useState, useEffect } from "react";
import { useTheme as useThemeContext } from "@/context/ThemeProvider";

type Theme = "dark" | "light" | "system";

export function useTheme() {
  const { theme, setTheme } = useThemeContext();
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light");
  const [mounted, setMounted] = useState(false);

  // Effect to determine the resolved theme
  useEffect(() => {
    setMounted(true);
    
    // Determine actual theme (light/dark) from theme setting (light/dark/system)
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      setResolvedTheme(systemTheme);
    } else {
      setResolvedTheme(theme as "light" | "dark");
    }
  }, [theme]);

  // Listen for system preference changes when using system theme
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      const newTheme = mediaQuery.matches ? "dark" : "light";
      setResolvedTheme(newTheme);
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return {
    theme,
    setTheme,
    resolvedTheme,
    mounted
  };
}
