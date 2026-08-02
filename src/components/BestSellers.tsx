import { getBestSellers, getVisibleProducts, getAllCategories } from "@/lib/products";
import { BestSellersGrid } from "./BestSellersGrid";
import { TranslatedText } from "./TranslatedText";

export async function BestSellers() {
  let allProducts: any[] = [];
  let categories: any[] = [];

  try {
    const products = await getVisibleProducts();
    allProducts = products.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    categories = await getAllCategories();
  } catch (e) {
    console.error("Failed to fetch products for BestSellers:", e);
  }

  return (
    <section className="py-10 sm:py-24 lg:py-28 transition-colors duration-300" id="collections">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Interactive Grid with Search & Filters & 2-Row Pagination */}
        <BestSellersGrid 
          top4={allProducts.slice(0, 4)} 
          otherProducts={allProducts} 
          categories={categories} 
        />
      </div>
    </section>
  );
}
