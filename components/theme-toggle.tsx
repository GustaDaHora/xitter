"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Contrast } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2 p-2 bg-card rounded-lg border border-border shadow-lg">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-md ${theme === "light" ? "bg-accent/20" : ""}`}
        title="Light"
      >
        <Sun className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-md ${theme === "dark" ? "bg-accent/20" : ""}`}
        title="Dark"
      >
        <Moon className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={() => setTheme("light-high-contrast")}
        className={`p-2 rounded-md ${theme === "light-high-contrast" ? "bg-accent/20" : ""}`}
        title="Light High Contrast"
      >
        <Contrast className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={() => setTheme("dark-high-contrast")}
        className={`p-2 rounded-md ${theme === "dark-high-contrast" ? "bg-accent/20" : ""}`}
        title="Dark High Contrast"
      >
        <Contrast className="w-5 h-5 text-foreground fill-foreground" />
      </button>
    </div>
  );
}
