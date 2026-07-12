"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function FloatingThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 p-2.5 sm:p-3 rounded-full shadow-lg transition-all duration-500 hover:scale-110 active:scale-95 ${
        isDark
          ? "bg-white text-black hover:shadow-white/20"
          : "bg-black text-white hover:shadow-black/20"
      }`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
      ) : (
        <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
      )}
    </button>
  );
}
