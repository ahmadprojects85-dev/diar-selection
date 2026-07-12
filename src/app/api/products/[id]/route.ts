import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextRequest } from "next/server";

// GET /api/products/[id] — Single product (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, brand: true },
    });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT /api/products/[id] — Update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.nameAr !== undefined && { nameAr: body.nameAr }),
        ...(body.nameKu !== undefined && { nameKu: body.nameKu }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.descriptionAr !== undefined && { descriptionAr: body.descriptionAr }),
        ...(body.descriptionKu !== undefined && { descriptionKu: body.descriptionKu }),
        ...(body.longDescription !== undefined && { longDescription: body.longDescription }),
        ...(body.longDescriptionAr !== undefined && { longDescriptionAr: body.longDescriptionAr }),
        ...(body.longDescriptionKu !== undefined && { longDescriptionKu: body.longDescriptionKu }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.originalPrice !== undefined && {
          originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
        }),
        ...(body.currency !== undefined && { currency: body.currency }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.images !== undefined && {
          images: body.images ? JSON.stringify(body.images) : null,
        }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
        ...(body.brandId !== undefined && { brandId: body.brandId }),
        ...(body.isBestSeller !== undefined && { isBestSeller: body.isBestSeller }),
        ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
        ...(body.inStock !== undefined && { inStock: body.inStock }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
      include: { category: true, brand: true },
    });

    return Response.json(product);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    console.error("Failed to update product:", error);
    return Response.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/products/[id] — Delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    console.error("Failed to delete product:", error);
    return Response.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
