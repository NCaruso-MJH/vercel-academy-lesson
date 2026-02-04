"use client";

import { useState, useEffect, useRef } from "react";
import { Sun, Moon, Coffee, Disc } from "lucide-react";

type Theme = "light" | "dark" | "brown" | "retro";

const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light Mode", icon: Sun },
  { value: "dark", label: "Dark Mode", icon: Moon },
  { value: "brown", label: "Brown", icon: Coffee },
  { value: "retro", label: "Retro", icon: Disc },
];

export function ThemeSelector() {
  const [theme, setTheme] = useState<Theme>("light");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved && themes.some((t) => t.value === saved)) {
      setTheme(saved);
      applyTheme(saved);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function applyTheme(newTheme: Theme) {
    const html = document.documentElement;
    html.classList.remove("dark", "brown", "retro");
    if (newTheme !== "light") {
      html.classList.add(newTheme);
    }
  }

  function handleThemeChange(newTheme: Theme) {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
    setIsOpen(false);
  }

  const currentTheme = themes.find((t) => t.value === theme)!;
  const Icon = currentTheme.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
        aria-label="Select theme"
      >
        <Icon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-40 rounded-lg border border-border bg-card shadow-lg z-50">
          {themes.map((t) => {
            const ThemeIcon = t.icon;
            return (
              <button
                key={t.value}
                onClick={() => handleThemeChange(t.value)}
                className={`flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  theme === t.value ? "bg-accent" : ""
                }`}
              >
                <ThemeIcon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
