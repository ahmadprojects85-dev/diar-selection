'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import type { StoreProduct } from "@/lib/products";

export function FeaturedCollection({ products }: { products: StoreProduct[] }) {
  const { t } = useLanguage();
  const featured = products.slice(0, 3);

  return (
    <section className="py-20 lg:py-28 bg-bg-elevated/30" id="featured">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-gold text-xs uppercase tracking-[0.25em] font-medium mb-3">
            {t("curatedSelection")}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            {t("exploreProducts")}
          </h2>
          <p className="text-text-secondary text-base max-w-lg mx-auto">
            Explore our curated selection.
          </p>
        </div>

        {/* Product Grid — 3 columns for editorial look */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm tracking-wide"
          >
            Explore the full collection
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
