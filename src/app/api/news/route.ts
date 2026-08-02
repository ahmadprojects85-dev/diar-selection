import { prisma, withRetry } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextRequest } from "next/server";

// GET /api/news — List all news (public)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");

  try {
    const news = await withRetry(() => prisma.newsArticle.findMany({
      where: featured === "true" ? { isFeatured: true } : undefined,
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" }
      ],
    }));
    return Response.json(news);
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return Response.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

// POST /api/news — Create a news article (admin only)
export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const data = await request.json();
    
    if (!data.title || !data.excerpt || !data.image || !data.tag) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const news = await withRetry(() => prisma.newsArticle.create({
      data: {
        title: data.title,
        titleAr: data.titleAr,
        titleKu: data.titleKu,
        excerpt: data.excerpt,
        excerptAr: data.excerptAr,
        excerptKu: data.excerptKu,
        tag: data.tag,
        tagAr: data.tagAr,
        tagKu: data.tagKu,
        image: data.image,
        images: data.images ? (typeof data.images === 'string' ? data.images : JSON.stringify(data.images)) : null,
        isFeatured: data.isFeatured || false,
        sortOrder: data.sortOrder !== undefined && data.sortOrder !== null ? parseInt(data.sortOrder.toString()) : 0,
      }
    }));
    return Response.json(news, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create news article:", error);
    return Response.json({ error: "Failed to create news article" }, { status: 500 });
  }
}
