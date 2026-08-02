"use client";

import Link from "next/link";
import { LayoutGrid, Coffee } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { getCategoryDisplayName } from "@/lib/categories";

interface PremiumCategoriesProps {
  categories: any[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

function CategoryIcon({ slug, image, className }: { slug: string; image?: string | null; className?: string }) {
  if (image) {
    const imgUrl = image.startsWith('http') || image.startsWith('/') ? image : `/${image}`;
    return (
      <img
        src={imgUrl}
        alt={slug}
        className={`${className} object-contain`}
      />
    );
  }

  switch (slug) {
    case "grinders":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          {/* Ground drawer base */}
          <rect x="5" y="11" width="14" height="10" rx="1" />
          {/* Drawer knob */}
          <circle cx="12" cy="16" r="1.2" fill="currentColor" />
          {/* Hopper cup on top */}
          <path d="M7 11V8c0-1.5 2-2 5-2s5 .5 5 2v3" />
          {/* Top handle spindle */}
          <line x1="12" y1="6" x2="12" y2="3" />
          {/* Handle bar */}
          <path d="M12 3h5a1 1 0 0 0 1-1" />
          {/* Handle knob */}
          <circle cx="18" cy="2" r="1.2" fill="currentColor" />
        </svg>
      );
    case "scales":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          {/* Main scale body */}
          <rect x="4" y="6" width="16" height="14" rx="2" />
          {/* Weighing platform plate */}
          <rect x="6" y="8" width="12" height="4" rx="1" />
          {/* LCD Screen */}
          <rect x="7" y="14" width="6" height="4" rx="0.5" />
          {/* Numbers in screen */}
          <path d="M9 16h2" />
          <path d="M12 16h2" />
          {/* Power button */}
          <circle cx="16.5" cy="16" r="1.2" fill="currentColor" />
        </svg>
      );
    case "kettles":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          {/* Kettle body */}
          <path d="M6 10h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z" />
          {/* Lid */}
          <path d="M7 10c0-1.5 2-2 4.5-2s4.5.5 4.5 2" />
          {/* Lid knob */}
          <circle cx="11.5" cy="6.5" r="1.5" fill="currentColor" />
          {/* Handle */}
          <path d="M5 12H3c-1 0-1.5.5-1.5 1.5v3c0 1 .5 1.5 1.5 1.5h2" />
          {/* Gooseneck spout */}
          <path d="M16 13c2.5 0 3.5-2.5 2.5-5s-2.5-3-4.5-3" />
        </svg>
      );
    case "brewers":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          {/* Universally recognized Coffee Cup */}
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="2" x2="6" y2="4" />
          <line x1="10" y1="2" x2="10" y2="4" />
          <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
      );
    case "filters":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          {/* Folded paper filter cone */}
          <path d="M4 5l7.5 15.5c.2.4.8.4 1 0L20 5" />
          {/* Top opening curve */}
          <path d="M4 5c4-1.5 12-1.5 16 0" />
          {/* Ribbed lines */}
          <line x1="6.5" y1="7" x2="11.5" y2="17" />
          <line x1="9" y1="6.5" x2="12" y2="12.5" />
          <line x1="12" y1="5" x2="12.5" y2="7.5" />
          <line x1="15" y1="6.5" x2="13.5" y2="9.5" />
          <line x1="17.5" y1="7" x2="13.5" y2="15.2" />
        </svg>
      );
    case "accessories":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          {/* Tamper top handle */}
          <path d="M12 2a4 4 0 0 1 4 4c0 2.5-2 4-4 4.5S8 8.5 8 6a4 4 0 0 1 4-4z" />
          {/* Stem */}
          <path d="M10 11.5h4V16h-4z" />
          {/* Base plate */}
          <path d="M4 16h16v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2z" />
          <line x1="3" y1="19.5" x2="21" y2="19.5" />
        </svg>
      );
    default:
      return <Coffee className={className} strokeWidth={1.5} />;
  }
}

export function PremiumCategories({ categories, selectedCategory, onSelectCategory }: PremiumCategoriesProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isDark = theme === "dark";

  return (
    /* Mobile: horizontal scroll | Desktop: wrap */
    <div className="relative">
      {/* Scroll fade masks — mobile only */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-6 z-10 bg-gradient-to-r from-bg-primary to-transparent sm:hidden" />
      <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-6 z-10 bg-gradient-to-l from-bg-primary to-transparent sm:hidden" />

      <div className="flex flex-row flex-nowrap sm:flex-wrap sm:justify-center gap-2 sm:gap-3 lg:gap-4 pb-2 sm:pb-4 w-full overflow-x-auto sm:overflow-x-visible scrollbar-hide px-1 sm:px-0"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* All Categories Pill */}
        <button 
          onClick={() => onSelectCategory("All")}
          className={`group flex items-center gap-2 sm:gap-3 pr-3 sm:pr-6 pl-1 sm:pl-2 h-[44px] sm:h-[56px] lg:h-[64px] rounded-full transition-all duration-400 border shrink-0
            ${selectedCategory === "All" ? "border-gold shadow-md bg-white dark:bg-bg-elevated -translate-y-0.5 sm:-translate-y-1" : "border-border/50 bg-white/40 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:-translate-y-1 hover:shadow-lg hover:border-gold/30"}
          `}
          style={{ backdropFilter: "blur(12px)" }}
        >
          <div className={`relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 shrink-0 rounded-full flex items-center justify-center overflow-hidden transition-colors duration-300 ${selectedCategory === "All" ? "bg-gold/10 text-gold" : "bg-black/5 dark:bg-white/10 text-text-primary group-hover:bg-gold/5 group-hover:text-gold"}`}>
            <LayoutGrid size={16} className="sm:w-5 sm:h-5" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-start justify-center text-left">
            <h3 className={`text-[10px] sm:text-[11px] lg:text-[12px] font-bold tracking-[0.5px] sm:tracking-[1px] uppercase transition-colors duration-300 whitespace-nowrap ${selectedCategory === "All" ? "text-gold" : "text-text-primary"}`}>
              {language === 'ar' ? "الكل" : language === 'ku' ? "هەموو" : "All"}
            </h3>
          </div>
        </button>

        {categories.map((category) => {
          const displayName = getCategoryDisplayName(category, language);
          const isSelected = selectedCategory === category.name;

          return (
            <button 
              key={category.id || category.slug}
              onClick={() => onSelectCategory(isSelected ? "All" : category.name)}
              className={`group flex items-center gap-2 sm:gap-3 pe-3 sm:pe-6 ps-1 sm:ps-2 h-[44px] sm:h-[56px] lg:h-[64px] rounded-full transition-all duration-400 border shrink-0
                ${isSelected ? "border-gold shadow-md bg-white dark:bg-bg-elevated -translate-y-0.5 sm:-translate-y-1" : "border-border/50 bg-white/40 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:-translate-y-1 hover:shadow-lg hover:border-gold/30"}
              `}
              style={{ backdropFilter: "blur(12px)" }}
            >
              <div className={`relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 shrink-0 rounded-full flex items-center justify-center overflow-hidden transition-colors duration-300 ${isSelected ? "bg-gold/10 text-gold" : "bg-black/5 dark:bg-white/10 text-text-primary group-hover:bg-gold/5 group-hover:text-gold"}`}>
                <CategoryIcon 
                  slug={category.slug} 
                  image={category.image}
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-500 group-hover:scale-110 text-current"
                />
              </div>
              <div className="flex flex-col items-start justify-center text-start">
                <h3 className={`text-[10px] sm:text-[11px] lg:text-[12px] font-bold tracking-[0.5px] sm:tracking-[1px] uppercase transition-colors duration-300 whitespace-nowrap ${isSelected ? "text-gold" : "text-text-primary"}`}>
                  {displayName}
                </h3>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
