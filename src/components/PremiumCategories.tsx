"use client";

import Link from "next/link";
import Image from "next/image";
import { LayoutGrid } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

interface PremiumCategoriesProps {
  categories: any[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
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
            ${selectedCategory === "All" ? "border-[#D4A24C] shadow-md bg-white dark:bg-[#1A1A1A] -translate-y-0.5 sm:-translate-y-1" : "border-border/50 bg-white/40 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:-translate-y-1 hover:shadow-lg hover:border-gold/30"}
          `}
          style={{ backdropFilter: "blur(12px)" }}
        >
          <div className={`relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 shrink-0 rounded-full flex items-center justify-center overflow-hidden transition-colors duration-300 ${selectedCategory === "All" ? "bg-[#D4A24C]/10 text-[#D4A24C]" : "bg-black/5 dark:bg-white/10 text-[#1A1A1A] dark:text-white group-hover:bg-[#D4A24C]/5 group-hover:text-[#D4A24C]"}`}>
            <LayoutGrid size={16} className="sm:w-5 sm:h-5" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-start justify-center text-left">
            <h3 className={`text-[10px] sm:text-[11px] lg:text-[12px] font-bold tracking-[0.5px] sm:tracking-[1px] uppercase transition-colors duration-300 whitespace-nowrap ${selectedCategory === "All" ? "text-[#D4A24C]" : (isDark ? "text-white" : "text-[#1A1A1A]")}`}>
              {language === 'ar' ? "الكل" : language === 'ku' ? "هەموو" : "All"}
            </h3>
          </div>
        </button>

        {categories.map((category) => {
          const displayName = language === 'ar' && category.nameAr ? category.nameAr :
                              language === 'ku' && category.nameKu ? category.nameKu :
                              category.name;
          const imageSrc = category.image || `/categories/${category.slug}.png`;
          const isSelected = selectedCategory === category.name;

          return (
          <button 
            key={category.id || category.slug}
            onClick={() => onSelectCategory(isSelected ? "All" : category.name)}
            className={`group flex items-center gap-2 sm:gap-3 pe-3 sm:pe-6 ps-1 sm:ps-2 h-[44px] sm:h-[56px] lg:h-[64px] rounded-full transition-all duration-400 border shrink-0
              ${isSelected ? "border-[#D4A24C] shadow-md bg-white dark:bg-[#1A1A1A] -translate-y-0.5 sm:-translate-y-1" : "border-border/50 bg-white/40 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:-translate-y-1 hover:shadow-lg hover:border-gold/30"}
            `}
            style={{ backdropFilter: "blur(12px)" }}
          >
            <div className={`relative w-10 h-10 lg:w-12 lg:h-12 shrink-0 rounded-full flex items-center justify-center overflow-hidden transition-colors duration-300 ${isSelected ? "bg-[#D4A24C]/10" : "bg-black/5 dark:bg-white/10 group-hover:bg-[#D4A24C]/5"}`}>
              <Image
                src={imageSrc}
                alt={displayName}
                fill
                className="object-contain sm:p-1.5 transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col items-start justify-center text-start">
              <h3 className={`text-[10px] sm:text-[11px] lg:text-[12px] font-bold tracking-[0.5px] sm:tracking-[1px] uppercase transition-colors duration-300 whitespace-nowrap ${isSelected ? "text-[#D4A24C]" : (isDark ? "text-white" : "text-[#1A1A1A]")}`}>
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
