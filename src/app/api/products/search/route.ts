import { prisma } from "@/lib/prisma";
import { formatProduct } from "@/lib/products";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return Response.json([]);
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { nameAr: { contains: q } },
          { nameKu: { contains: q } },
          { brand: { name: { contains: q } } },
          { category: { name: { contains: q } } },
        ],
      },
      include: {
        brand: true,
        category: true,
      },
      take: 10,
    });

    return Response.json(products.map(formatProduct));
  } catch (error) {
    console.error("Search error:", error);
    return Response.json({ error: "Failed to search" }, { status: 500 });
  }
}
