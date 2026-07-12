import { prisma, withRetry } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const methods = await withRetry(() => prisma.brewingMethod.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }));
    return Response.json(methods);
  } catch (error) {
    console.error("Failed to fetch brewing methods:", error);
    return Response.json({ error: "Failed to fetch brewing methods" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      name,
      nameAr,
      nameKu,
      tagline,
      taglineAr,
      taglineKu,
      description,
      descriptionAr,
      descriptionKu,
      image,
      time,
      sortOrder,
    } = body;

    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const method = await prisma.brewingMethod.create({
      data: {
        name,
        nameAr: nameAr || null,
        nameKu: nameKu || null,
        tagline: tagline || null,
        taglineAr: taglineAr || null,
        taglineKu: taglineKu || null,
        description: description || null,
        descriptionAr: descriptionAr || null,
        descriptionKu: descriptionKu || null,
        image: image || null,
        time: time || null,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });

    return Response.json(method);
  } catch (error) {
    console.error("Failed to create brewing method:", error);
    return Response.json({ error: "Failed to create brewing method" }, { status: 500 });
  }
}
