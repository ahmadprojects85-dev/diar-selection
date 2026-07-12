import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBestSellers, getVisibleProducts, getAllCategories } from "@/lib/products";
import { BestSellersGrid } from "./BestSellersGrid";
import { TranslatedText } from "./TranslatedText";

export async function BestSellers() {
  // First row: Signature Collection (4 products max)
  const bestSellers = await getBestSellers();
  const top4 = bestSellers.slice(0, 4);
  const bestSellerIds = top4.map(p => p.id);
  
  // Next rows: The rest of the collection (excluding the 4 best sellers)
  const allProducts = await getVisibleProducts();
  const otherProducts = allProducts
    .filter(p => !bestSellerIds.includes(p.id))
    .slice(0, 16)
    .map(p => ({ ...p, isBestSeller: false }));

  // Fetch categories
  const categories = await getAllCategories();

  return (
    <section className="pt-24 sm:pt-8 pb-12 sm:pb-12 transition-colors duration-300" id="collections">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10 text-center md:text-left">
          <p className="text-gold text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-medium mb-2 sm:mb-3">
            <TranslatedText tKey="curatedSelection" />
          </p>
          <h2 className="font-serif text-[28px] sm:text-3xl lg:text-5xl font-bold text-text-primary mb-3 sm:mb-4">
            <TranslatedText tKey="bestSellers" />
          </h2>
          <p className="text-text-muted text-sm sm:text-base md:text-lg max-w-2xl mx-auto md:mx-0">
            <TranslatedText tKey="curatedSelectionDesc" />
          </p>
        </div>

        {/* Interactive Grid with Search & Filters */}
        <BestSellersGrid 
          top4={top4} 
          otherProducts={otherProducts} 
          categories={categories} 
        />

        {/* View All Button */}
        <div className="mt-12 sm:mt-16 flex justify-center">
          <Link
            href="/products"
            className="group relative flex items-center justify-center w-full sm:w-auto gap-4 px-10 py-[16px] sm:px-12 sm:py-[18px] rounded-xl sm:rounded-full bg-text-primary text-bg-primary overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgba(212,162,76,0.2)] sm:hover:-translate-y-1"
          >
            {/* Slide-up Gold Hover Fill */}
            <div className="absolute inset-0 bg-[#D4A24C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-xl sm:rounded-full" />
            
            <span className="relative z-10 font-bold text-[13px] sm:text-sm uppercase tracking-wide">
              <TranslatedText tKey="exploreAll" />
            </span>
            <ArrowRight size={18} className="relative z-10 transition-transform duration-500 group-hover:translate-x-2" />
          </Link>
        </div>

      </div>
    </section>
  );
}
