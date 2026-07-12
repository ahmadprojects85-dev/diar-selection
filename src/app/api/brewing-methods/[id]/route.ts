import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const method = await prisma.brewingMethod.findUnique({
      where: { id },
    });

    if (!method) {
      return Response.json({ error: "Brewing method not found" }, { status: 404 });
    }

    return Response.json(method);
  } catch (error) {
    console.error("Failed to fetch brewing method:", error);
    return Response.json({ error: "Failed to fetch brewing method" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();

    const method = await prisma.brewingMethod.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.nameAr !== undefined && { nameAr: body.nameAr }),
        ...(body.nameKu !== undefined && { nameKu: body.nameKu }),
        ...(body.tagline !== undefined && { tagline: body.tagline }),
        ...(body.taglineAr !== undefined && { taglineAr: body.taglineAr }),
        ...(body.taglineKu !== undefined && { taglineKu: body.taglineKu }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.descriptionAr !== undefined && { descriptionAr: body.descriptionAr }),
        ...(body.descriptionKu !== undefined && { descriptionKu: body.descriptionKu }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.time !== undefined && { time: body.time }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder ? parseInt(body.sortOrder) : 0 }),
      },
    });

    return Response.json(method);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return Response.json({ error: "Brewing method not found" }, { status: 404 });
    }
    console.error("Failed to update brewing method:", error);
    return Response.json({ error: "Failed to update brewing method" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    await prisma.brewingMethod.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return Response.json({ error: "Brewing method not found" }, { status: 404 });
    }
    console.error("Failed to delete brewing method:", error);
    return Response.json({ error: "Failed to delete brewing method" }, { status: 500 });
  }
}
