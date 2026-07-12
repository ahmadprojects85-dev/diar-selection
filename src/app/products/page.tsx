import { getVisibleProducts, getAllCategories } from "@/lib/products";
import { ProductsClient } from "./ProductsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products | Diar Selection",
  description: "Explore our complete collection of premium coffee tools and equipment.",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getVisibleProducts(),
    getAllCategories(),
  ]);

  return (
    <ProductsClient
      products={products}
      categories={categories}
    />
  );
}
