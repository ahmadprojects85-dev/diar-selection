import { prisma, withRetry } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextRequest } from "next/server";

// GET /api/products — List all products (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const bestSellers = searchParams.get("bestSellers");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");

    const where: Record<string, unknown> = {};

    if (category) where.category = { slug: category };
    if (brand) where.brand = { slug: brand };
    if (bestSellers === "true") where.isBestSeller = true;
    if (featured === "true") where.isFeatured = true;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const products = await withRetry(() => prisma.product.findMany({
      where,
      include: { category: true, brand: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      ...(limit ? { take: parseInt(limit) } : {}),
    }));

    return Response.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products — Create a product (admin only)
export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      name,
      nameAr,
      nameKu,
      slug,
      description,
      descriptionAr,
      descriptionKu,
      longDescription,
      longDescriptionAr,
      longDescriptionKu,
      price,
      originalPrice,
      currency,
      image,
      images,
      categoryId,
      brandId,
      isBestSeller,
      isFeatured,
      inStock,
      sortOrder,
    } = body;

    if (!name || !slug || !price || !image || !categoryId) {
      return Response.json(
        { error: "Missing required fields: name, slug, price, image, categoryId" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        nameAr: nameAr || null,
        nameKu: nameKu || null,
        slug,
        description: description || null,
        descriptionAr: descriptionAr || null,
        descriptionKu: descriptionKu || null,
        longDescription: longDescription || null,
        longDescriptionAr: longDescriptionAr || null,
        longDescriptionKu: longDescriptionKu || null,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        currency: currency || "IQD",
        image,
        images: images ? JSON.stringify(images) : null,
        categoryId,
        brandId: brandId || null,
        isBestSeller: isBestSeller || false,
        isFeatured: isFeatured || false,
        inStock: inStock !== false,
        sortOrder: sortOrder || 0,
      },
      include: { category: true, brand: true },
    });

    return Response.json(product, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return Response.json({ error: "Product with this slug already exists" }, { status: 409 });
    }
    console.error("Failed to create product:", error);
    return Response.json({ error: "Failed to create product" }, { status: 500 });
  }
}
