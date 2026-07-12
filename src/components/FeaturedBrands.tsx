import Link from "next/link";
import { getAllBrands } from "@/lib/products";

export async function FeaturedBrands() {
  const displayBrands = await getAllBrands();

  return (
    <section className="py-12 lg:py-16 bg-bg-elevated/50 border-y border-border" id="featured-brands">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium mb-4">
            Official Partners
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-primary">
            Trusted Brands
          </h2>
        </div>

        {/* Brands Grid */}
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10 sm:gap-x-16 sm:gap-y-12 opacity-80">
          {displayBrands.slice(0, 10).map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brand=${brand.slug}`}
              className="group"
            >
              <span className="font-serif text-2xl sm:text-3xl font-bold text-text-muted group-hover:text-gold transition-colors duration-300">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
