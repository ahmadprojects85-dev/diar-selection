"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal, Search } from "lucide-react";
import type { StoreProduct } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { PremiumCategories } from "@/components/PremiumCategories";
import { GridControls, getGridClass, GridColumns } from "@/components/GridControls";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  products: StoreProduct[];
  categories: { id: string; name: string }[];
}

export function ProductsClient({ products, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [columns, setColumns] = useState<GridColumns>(4);
  const { t, language } = useLanguage();

  const filtered = useMemo(() => {
    const result = products.filter((p) => {
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

    // Sort products strictly by sortOrder ascending, then createdAt descending
    return result.sort((a, b) => {
      const diff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      if (diff !== 0) return diff;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="pt-24 lg:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-8">
          <Link href="/" className="hover:text-gold transition-colors">
            {t("home")}
          </Link>
          <ChevronRight size={12} />
          <span className="text-text-secondary">{t("allProducts")}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-3">
            {t("allProducts")}
          </h1>
          <p className="text-text-secondary text-base">
            {t("allProductsDesc")}
          </p>
        </div>

        {/* Filters */}
        <div className="w-full mb-6">
          <PremiumCategories 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
        </div>

        {/* Search and Filter Row */}
        <div className="flex flex-col md:flex-row gap-4 w-full mb-10">
          {/* Category Filter Dropdown */}
          <div className="relative w-full md:w-[250px] h-[56px] group shrink-0">
            <div className="absolute inset-0 bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-border group-hover:border-[#D4A24C]/50 transition-colors duration-300 shadow-sm" />
            <SlidersHorizontal className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted z-10" size={18} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-full pl-14 pr-12 bg-transparent text-text-primary text-base outline-none relative z-10 appearance-none cursor-pointer"
            >
              <option value="All">{t("allCategories") || "All Categories"}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            {/* Custom Chevron */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-text-muted text-[10px]">
              ▼
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 h-[56px] group">
            <div className="absolute inset-0 bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-border group-hover:border-[#D4A24C]/50 transition-colors duration-300 shadow-sm" />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted z-10" size={20} />
            <input
              type="text"
              placeholder={t("searchCollection") || "Search coffee tools, brewers, grinders..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full pl-14 pr-6 bg-transparent text-text-primary text-base outline-none relative z-10 placeholder:text-text-muted/70"
            />
          </div>
        </div>

        {/* Grid Controls & Item Count Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <span className="text-text-muted text-xs font-medium">
            {filtered.length} {filtered.length !== 1 ? t("items") : t("item")}
          </span>
          <GridControls columns={columns} onChange={setColumns} />
        </div>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className={`grid ${getGridClass(columns)} gap-4 lg:gap-5 transition-all duration-300`}>
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
    </div>
  );
}
