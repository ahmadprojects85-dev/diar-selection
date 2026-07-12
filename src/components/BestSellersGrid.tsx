"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { PremiumCategories } from "./PremiumCategories";
import type { StoreProduct } from "@/lib/products";
import { useLanguage } from "@/context/LanguageContext";

interface BestSellersGridProps {
  top4: StoreProduct[];
  otherProducts: StoreProduct[];
  categories: { id: string; name: string }[];
}

export function BestSellersGrid({ top4, otherProducts, categories }: BestSellersGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { t, language } = useLanguage();
  const isRTL = language === "ar" || language === "ku";

  // Combine products for filtering
  const allInitialProducts = useMemo(() => {
    // Keep top4 with best seller badges
    const all = [...top4];
    // Add others ensuring no duplicates by ID
    otherProducts.forEach(p => {
      if (!all.find(existing => existing.id === p.id)) {
        all.push(p);
      }
    });
    return all;
  }, [top4, otherProducts]);

  const filtered = useMemo(() => {
    return allInitialProducts.filter((p) => {
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          (p.category && p.category.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [allInitialProducts, selectedCategory, searchQuery]);

  return (
    <div>
      {/* Premium Categories Filter Cards */}
      <div className="w-full mb-4 sm:mb-6">
        <PremiumCategories 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
      </div>

      {/* Search and Filter Row */}
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full mb-8 sm:mb-10">
        {/* Category Filter Dropdown */}
        <div className="relative w-full md:w-[250px] h-[48px] sm:h-[56px] group shrink-0">
          <div className="absolute inset-0 bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-xl sm:rounded-2xl border border-border group-hover:border-gold/50 transition-colors duration-300 shadow-sm" />
          <SlidersHorizontal className={`absolute ${isRTL ? 'right-4' : 'left-4'} sm:${isRTL ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-text-muted z-10`} size={18} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full h-full ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'} sm:${isRTL ? 'pr-14 pl-12' : 'pl-14 pr-12'} bg-transparent text-text-primary text-[13px] sm:text-base outline-none relative z-10 appearance-none cursor-pointer`}
          >
            <option value="All">{t("allCategories") || "All Categories"}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {/* Custom Chevron */}
          <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} sm:${isRTL ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 pointer-events-none z-10 text-text-muted text-[10px]`}>
            ▼
          </div>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 h-[48px] sm:h-[56px] group">
          <div className="absolute inset-0 bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-xl sm:rounded-2xl border border-border group-hover:border-gold/50 transition-colors duration-300 shadow-sm" />
          <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} sm:${isRTL ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-text-muted z-10`} size={18} />
          <input
            type="text"
            placeholder={t("searchCollection") || "Search coffee tools, brewers, grinders..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full h-full ${isRTL ? 'pr-12 pl-6' : 'pl-12 pr-6'} sm:${isRTL ? 'pr-14 pl-6' : 'pl-14 pr-6'} bg-transparent text-text-primary text-[13px] sm:text-base outline-none relative z-10 placeholder:text-text-muted/70`}
          />
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-text-muted text-lg mb-2">{t("noProductsFound")}</p>
          <p className="text-text-muted text-sm">
            {t("tryAdjusting")}
          </p>
        </div>
      )}
    </div>
  );
}
