import React from 'react';

export function TrustedBrands() {
  const brands = [
    "TIMEMORE",
    "FELLOW",
    "CAFEC",
    "1ZPRESSO",
    "HARIO",
    "AEROPRESS",
    "BIALETTI"
  ];

  return (
    <section className="bg-[#f5f5f5] pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative border-t border-[#e8e4db] flex justify-center pt-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f5f5f5] px-6">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#8a8a8a] whitespace-nowrap">
              Trusted Brands
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-70">
            {brands.map((brand) => (
              <span key={brand} className="font-sans text-xl md:text-2xl font-black tracking-tight uppercase text-[#1a1a1a]/80 hover:text-[#1a1a1a] transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
