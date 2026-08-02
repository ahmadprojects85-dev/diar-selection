import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/orders — Fetch all orders
export async function GET() {
  const isAuth = await verifyAuth();
  if (!isAuth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return Response.json(orders);
  } catch (error: any) {
    console.error("Failed to fetch admin orders:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// PATCH /api/admin/orders — Update order status
export async function PATCH(request: NextRequest) {
  const isAuth = await verifyAuth();
  if (!isAuth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return Response.json({ error: "Missing order id or status" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true }
    });

    return Response.json(updatedOrder);
  } catch (error: any) {
    console.error("Failed to update admin order:", error);
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}

// DELETE /api/admin/orders — Delete an order
export async function DELETE(request: NextRequest) {
  const isAuth = await verifyAuth();
  if (!isAuth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Missing order id" }, { status: 400 });
    }

    await prisma.order.delete({
      where: { id }
    });

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete admin order:", error);
    return Response.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
