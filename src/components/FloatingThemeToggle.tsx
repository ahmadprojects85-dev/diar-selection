"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function FloatingThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || pathname?.startsWith("/admin")) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`fixed bottom-6 left-6 z-50 p-3 rounded-full shadow-lg transition-all duration-500 hover:scale-110 active:scale-95 ${
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
