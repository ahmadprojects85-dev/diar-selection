import { prisma, withRetry } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextRequest } from "next/server";

// GET /api/categories — List all categories (public)
export async function GET() {
  try {
    const categories = await withRetry(() => prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }));
    return Response.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST /api/categories — Create a category (admin only)
export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { name, nameAr, nameKu, slug, description, descriptionAr, descriptionKu, image, sortOrder } = await request.json();

    if (!name || !slug) {
      return Response.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        nameAr: nameAr || null,
        nameKu: nameKu || null,
        slug,
        description: description || null,
        descriptionAr: descriptionAr || null,
        descriptionKu: descriptionKu || null,
        image: image || null,
        sortOrder: sortOrder || 0,
      },
    });

    return Response.json(category, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return Response.json({ error: "Category already exists" }, { status: 409 });
    }
    console.error("Failed to create category:", error);
    return Response.json({ error: "Failed to create category" }, { status: 500 });
  }
}
