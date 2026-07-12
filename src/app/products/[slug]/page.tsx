import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProduct, getVisibleProducts } from "@/lib/products";
import { ProductDetailClient } from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: `${product.name} — Diar Selection`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} — Diar Selection`,
      description: product.description.slice(0, 160),
      url: `https://diarselection.com/products/${product.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — Diar Selection`,
      description: product.description.slice(0, 160),
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  // Get related products (same category, exclude current)
  const visibleProducts = await getVisibleProducts();
  const related = visibleProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      {/* JSON-LD Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            sku: product.sku,
            brand: {
              "@type": "Brand",
              name: product.brand,
            },
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "USD",
              availability: product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: 5,
              reviewCount: 1,
            },
          }),
        }}
      />
      <ProductDetailClient product={product} relatedProducts={related} />
    </>
  );
}
