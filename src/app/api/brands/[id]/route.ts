import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const paramsResolved = await params;
    const { id } = paramsResolved;
    const body = await request.json();

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.nameAr !== undefined && { nameAr: body.nameAr }),
        ...(body.nameKu !== undefined && { nameKu: body.nameKu }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.logo !== undefined && { logo: body.logo }),
      },
    });

    return Response.json({ brand });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const paramsResolved = await params;
    const { id } = paramsResolved;
    await prisma.brand.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
