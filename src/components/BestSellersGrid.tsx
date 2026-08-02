"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { PremiumCategories } from "./PremiumCategories";
import { GridControls, getGridClass, GridColumns } from "./GridControls";
import type { StoreProduct } from "@/lib/products";
import { useLanguage } from "@/context/LanguageContext";
import { getCategoryDisplayName } from "@/lib/categories";

interface BestSellersGridProps {
  top4: StoreProduct[];
  otherProducts: StoreProduct[];
  categories: { id: string; name: string }[];
}

export function BestSellersGrid({ top4, otherProducts, categories }: BestSellersGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [columns, setColumns] = useState<GridColumns>(4);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { t, language } = useLanguage();
  const isRTL = language === "ar" || language === "ku";

  // Combine products for filtering (all products available)
  const allInitialProducts = useMemo(() => {
    const all = [...top4];
    otherProducts.forEach(p => {
      if (!all.find(existing => existing.id === p.id)) {
        all.push(p);
      }
    });

    // Sort strictly by sortOrder ascending, then createdAt descending
    all.sort((a, b) => {
      const diff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      if (diff !== 0) return diff;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
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

  // Exactly 2 rows based on grid column setting
  const pageSize = columns * 2;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // Ensure current page is valid when filters change
  const validPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (validPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, validPage, pageSize]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const gridEl = document.getElementById("collections-grid-top");
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="collections-grid-top" className="pt-4 sm:pt-6">
      {/* Premium Categories Filter Cards */}
      <div className="w-full mb-6 sm:mb-8">
        <PremiumCategories 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleCategoryChange} 
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
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={`w-full h-full ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'} sm:${isRTL ? 'pr-14 pl-12' : 'pl-14 pr-12'} bg-transparent text-text-primary text-[13px] sm:text-base outline-none relative z-10 appearance-none cursor-pointer`}
          >
            <option value="All">{t("allCategories") || "All Categories"}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name} className="bg-bg-primary text-text-primary">
                {getCategoryDisplayName(cat, language)}
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
            onChange={(e) => handleSearchChange(e.target.value)}
            className={`w-full h-full ${isRTL ? 'pr-12 pl-6' : 'pl-12 pr-6'} sm:${isRTL ? 'pr-14 pl-6' : 'pl-14 pr-6'} bg-transparent text-text-primary text-[13px] sm:text-base outline-none relative z-10 placeholder:text-text-muted/70`}
          />
        </div>
      </div>

      {/* Grid Controls Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <span className="text-text-muted text-xs font-medium">
          {filtered.length} {filtered.length !== 1 ? t("items") : t("item")}
        </span>
        <GridControls columns={columns} onChange={setColumns} />
      </div>

      {/* Product Grid (2 Rows) */}
      {paginatedProducts.length > 0 ? (
        <div className={`grid ${getGridClass(columns)} gap-3 sm:gap-6 lg:gap-8 transition-all duration-300`}>
          {paginatedProducts.map((product) => (
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

      {/* Page Numbers Pagination (1 2 3 ...) */}
      {totalPages > 1 && (
        <div className="mt-12 sm:mt-16 flex items-center justify-center gap-2">
          {/* Previous Page Button */}
          <button
            onClick={() => handlePageChange(validPage - 1)}
            disabled={validPage === 1}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
              validPage === 1
                ? "border-border/40 text-text-muted/40 cursor-not-allowed"
                : "border-border hover:border-gold hover:text-gold text-text-primary bg-bg-card shadow-sm cursor-pointer"
            }`}
            aria-label="Previous Page"
          >
            {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-sm sm:text-base transition-all duration-300 cursor-pointer ${
                  validPage === pageNum
                    ? "bg-gold text-bg-primary shadow-md scale-105"
                    : "bg-bg-card border border-border text-text-primary hover:border-gold/50 hover:text-gold"
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          {/* Next Page Button */}
          <button
            onClick={() => handlePageChange(validPage + 1)}
            disabled={validPage === totalPages}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
              validPage === totalPages
                ? "border-border/40 text-text-muted/40 cursor-not-allowed"
                : "border-border hover:border-gold hover:text-gold text-text-primary bg-bg-card shadow-sm cursor-pointer"
            }`}
            aria-label="Next Page"
          >
            {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      )}
    </div>
  );
}
