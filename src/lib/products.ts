import { cache } from "react";
import { prisma, withRetry } from "./prisma";

export type StoreProductColor = {
  id: string;
  name: string;
  colorCode: string;
  image: string;
};

export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  nameKu: string | null;
  nameKm?: string | null;
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
  descriptionKm?: string;
  longDescription: string;
  longDescriptionAr: string;
  longDescriptionKu: string;
  longDescriptionKm?: string;
  specifications: Record<string, string>;
  features: string[];
  isBestSeller: boolean;
  isFeatured: boolean;
  isNew: boolean;
  inStock: boolean;
  officialProduct: boolean;
  colors: StoreProductColor[];
  createdAt?: string | Date;
  sortOrder?: number;
};

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
    imagesArr = ["/placeholder.jpg"];
  }

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    nameAr: product.nameAr,
    nameKu: product.nameKu,
    nameKm: product.nameKm,
    brand: product.brand?.name || "Unknown Brand",
    category: product.category?.name || "Unknown Category",
    price: product.price,
    originalPrice: product.originalPrice,
    sku: product.id,
    image: product.image || (imagesArr.length > 0 ? imagesArr[0] : "/placeholder.jpg"),
    images: imagesArr,
    description: product.description || "",
    descriptionAr: product.descriptionAr || "",
    descriptionKu: product.descriptionKu || "",
    descriptionKm: product.descriptionKm || "",
    longDescription: product.longDescription || "",
    longDescriptionAr: product.longDescriptionAr || "",
    longDescriptionKu: product.longDescriptionKu || "",
    longDescriptionKm: product.longDescriptionKm || "",
    specifications: {},
    features: [],
    isBestSeller: Boolean(product.isBestSeller),
    isFeatured: Boolean(product.isFeatured),
    isNew: Boolean(product.isNew),
    inStock: Boolean(product.inStock),
    officialProduct: true,
    colors: product.colors || [],
    createdAt: product.createdAt,
    sortOrder: product.sortOrder ?? 0,
  };
}

export const getBestSellers = cache(async (): Promise<StoreProduct[]> => {
  const products: any = await withRetry(() => prisma.product.findMany({
    where: { isBestSeller: true },
    include: { brand: true, category: true, colors: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  }));
  return (products as any[]).map(formatProduct);
});

export const getFeatured = cache(async (): Promise<StoreProduct[]> => {
  const products: any = await withRetry(() => prisma.product.findMany({
    where: { isFeatured: true },
    include: { brand: true, category: true, colors: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  }));
  return (products as any[]).map(formatProduct);
});

export const getVisibleProducts = cache(async (): Promise<StoreProduct[]> => {
  const products: any = await withRetry(() => prisma.product.findMany({
    include: { brand: true, category: true, colors: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  }));
  return (products as any[]).map(formatProduct);
});

export const getProduct = cache(async (slug: string): Promise<StoreProduct | undefined> => {
  const product: any = await withRetry(() => prisma.product.findUnique({
    where: { slug },
    include: { brand: true, category: true, colors: true },
  }));
  return product ? formatProduct(product) : undefined;
});

export const getProductsByCategory = cache(async (slug: string): Promise<StoreProduct[]> => {
  if (slug === "all") return getVisibleProducts();
  const products: any = await withRetry(() => prisma.product.findMany({
    where: { category: { slug } },
    include: { brand: true, category: true, colors: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  }));
  return (products as any[]).map(formatProduct);
});

export const getProductsByBrand = cache(async (slug: string): Promise<StoreProduct[]> => {
  const products: any = await withRetry(() => prisma.product.findMany({
    where: { brand: { slug } },
    include: { brand: true, category: true, colors: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  }));
  return (products as any[]).map(formatProduct);
});

export const getAllCategories = cache(async (): Promise<any[]> => {
  const res: any = await withRetry(() => prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  }));
  return res || [];
});

export const getAllBrands = cache(async (): Promise<any[]> => {
  const res: any = await withRetry(() => prisma.brand.findMany({
    orderBy: { sortOrder: "asc" },
  }));
  return res || [];
});
