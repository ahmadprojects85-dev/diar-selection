import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { image, mobileImage, textEn, textAr, textKu, textKm, buttonLink, sortOrder, isActive } = body;

    const slide = await withRetry(() =>
      prisma.heroSlide.update({
        where: { id },
        data: {
          ...(image !== undefined && { image }),
          ...(mobileImage !== undefined && { mobileImage: mobileImage || null }),
          ...(textEn !== undefined && { textEn }),
          ...(textAr !== undefined && { textAr }),
          ...(textKu !== undefined && { textKu }),
          ...(textKm !== undefined && { textKm }),
          ...(buttonLink !== undefined && { buttonLink }),
          ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        },
      })
    );

    return NextResponse.json(slide);
  } catch (error) {
    console.error("Failed to update hero slide:", error);
    return NextResponse.json({ error: "Failed to update hero slide" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await withRetry(() =>
      prisma.heroSlide.delete({
        where: { id },
      })
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete hero slide:", error);
    return NextResponse.json({ error: "Failed to delete hero slide" }, { status: 500 });
  }
}
