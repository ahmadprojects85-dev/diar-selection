import { prisma, withRetry } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextRequest } from "next/server";

// GET /api/brands — List all brands (public)
export async function GET() {
  try {
    const brands = await withRetry(() => prisma.brand.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }));
    return Response.json(brands);
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return Response.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

// POST /api/brands — Create a brand (admin only)
export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { name, nameAr, nameKu, slug, descriptionAr, descriptionKu, logo, website, sortOrder } = await request.json();

    if (!name || !slug) {
      return Response.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        nameAr: nameAr || null,
        nameKu: nameKu || null,
        slug,
        descriptionAr: descriptionAr || null,
        descriptionKu: descriptionKu || null,
        logo: logo || null,
        website: website || null,
        sortOrder: sortOrder || 0,
      },
    });

    return Response.json(brand, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return Response.json({ error: "Brand already exists" }, { status: 409 });
    }
    console.error("Failed to create brand:", error);
    return Response.json({ error: "Failed to create brand" }, { status: 500 });
  }
}
