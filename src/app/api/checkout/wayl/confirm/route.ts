import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/checkout/wayl/confirm
// Called by the success page when a customer lands back from Wayl after payment.
// This is a reliable fallback to mark the order as PAID even if the Wayl webhook fails.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referenceId } = body;

    if (!referenceId) {
      return Response.json({ error: "Missing referenceId" }, { status: 400 });
    }

    // Find the order by referenceId
    const order = await prisma.order.findUnique({
      where: { referenceId },
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    // Only update if the order is still PENDING (don't override FAILED or already PAID)
    if (order.status === "PENDING") {
      await prisma.order.update({
        where: { referenceId },
        data: { status: "PAID" },
      });

      console.log(`[Confirm] Order ${referenceId} marked as PAID via success page redirect`);
    }

    return Response.json({ success: true, status: order.status === "PENDING" ? "PAID" : order.status });
  } catch (error: any) {
    console.error("[Confirm] Error confirming order:", error);
    return Response.json({ error: "Failed to confirm order" }, { status: 500 });
  }
}
