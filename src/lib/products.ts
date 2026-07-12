import { prisma, withRetry } from "./prisma";

export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  nameKu: string | null;
  brand: string;
  category: string;
  price: number;
  originalPrice: number | null;
  sku: string;
  image: string;
  images: string[];
  description: string;
  descriptionAr: string;
  descriptionKu: string;
  longDescription: string;
  longDescriptionAr: string;
  longDescriptionKu: string;
  specifications: Record<string, string>;
  features: string[];
  isBestSeller: boolean;
  isFeatured: boolean;
  inStock: boolean;
  officialProduct: boolean;
};

// Formats a Prisma product (which includes brand and category relations)
// into a standardized object for the frontend components.
export function formatProduct(product: any): StoreProduct {
  let imagesArr: string[] = [];
  try {
    if (product.images) {
      imagesArr = JSON.parse(product.images);
    }
  } catch (e) {}

  if (imagesArr.length === 0 && product.image) {
    imagesArr = [product.image];
  } else if (imagesArr.length === 0) {
    imagesArr = ["/placeholder.jpg"]; // fallback
  }

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    nameAr: product.nameAr,
    nameKu: product.nameKu,
    brand: product.brand?.name || "Unknown Brand",
    category: product.category?.name || "Unknown Category",
    price: product.price,
    originalPrice: product.originalPrice,
    sku: product.id, // Fallback SKU
    image: product.image || (imagesArr.length > 0 ? imagesArr[0] : "/placeholder.jpg"),
    images: imagesArr,
    description: product.description || "",
    descriptionAr: product.descriptionAr || "",
    descriptionKu: product.descriptionKu || "",
    longDescription: product.longDescription || "",
    longDescriptionAr: product.longDescriptionAr || "",
    longDescriptionKu: product.longDescriptionKu || "",
    specifications: {}, // Not in DB yet
    features: [], // Not in DB yet
    isBestSeller: product.isBestSeller,
    isFeatured: product.isFeatured,
    inStock: product.inStock,
    officialProduct: true,
  };
}


export async function getBestSellers() {
  const products = await withRetry(() => prisma.product.findMany({
    where: { isBestSeller: true },
    include: { brand: true, category: true },
    orderBy: { sortOrder: "asc" },
  }));
  return products.map(formatProduct);
}

export async function getFeatured() {
  const products = await withRetry(() => prisma.product.findMany({
    where: { isFeatured: true },
    include: { brand: true, category: true },
    orderBy: { sortOrder: "asc" },
  }));
  return products.map(formatProduct);
}

export async function getVisibleProducts() {
  const products = await withRetry(() => prisma.product.findMany({
    include: { brand: true, category: true },
    orderBy: { sortOrder: "asc" },
  }));
  return products.map(formatProduct);
}

export async function getProduct(slug: string) {
  const product = await withRetry(() => prisma.product.findUnique({
    where: { slug },
    include: { brand: true, category: true },
  }));
  return product ? formatProduct(product) : undefined;
}

export async function getProductsByCategory(slug: string) {
  if (slug === "all") return getVisibleProducts();
  const products = await withRetry(() => prisma.product.findMany({
    where: { category: { slug } },
    include: { brand: true, category: true },
    orderBy: { sortOrder: "asc" },
  }));
  return products.map(formatProduct);
}

export async function getProductsByBrand(slug: string) {
  const products = await withRetry(() => prisma.product.findMany({
    where: { brand: { slug } },
    include: { brand: true, category: true },
    orderBy: { sortOrder: "asc" },
  }));
  return products.map(formatProduct);
}

export async function getAllCategories() {
  return withRetry(() => prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  }));
}

export async function getAllBrands() {
  return withRetry(() => prisma.brand.findMany({
    orderBy: { sortOrder: "asc" },
  }));
}
