import { prisma, withRetry } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const news = await withRetry(() => prisma.newsArticle.findUnique({
      where: { id }
    }));
    if (!news) return Response.json({ error: "News article not found" }, { status: 404 });
    return Response.json(news);
  } catch (error) {
    console.error("Failed to fetch news article:", error);
    return Response.json({ error: "Failed to fetch news article" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;

  try {
    const data = await request.json();

    const news = await withRetry(() => prisma.newsArticle.update({
      where: { id },
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
        isFeatured: data.isFeatured,
        sortOrder: data.sortOrder !== undefined && data.sortOrder !== null ? parseInt(data.sortOrder.toString()) : undefined,
      }
    }));
    return Response.json(news);
  } catch (error) {
    console.error("Failed to update news article:", error);
    return Response.json({ error: "Failed to update news article" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await params;

  try {
    await withRetry(() => prisma.newsArticle.delete({
      where: { id }
    }));
    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete news article:", error);
    return Response.json({ error: "Failed to delete news article" }, { status: 500 });
  }
}
