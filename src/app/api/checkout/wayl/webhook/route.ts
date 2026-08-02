import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-wayl-signature-256") || "";
    const body = await request.json();

    console.log("[Wayl Webhook] Received webhook notification:", {
      signature,
      body: JSON.stringify(body, null, 2)
    });

    const { referenceId, status } = body;

    if (!referenceId) {
      return Response.json({ error: "Missing referenceId" }, { status: 400 });
    }

    // Map Wayl status to local order status
    // Common statuses: 'Created', 'Pending', 'Processing', 'Complete', 'Cancelled', 'Rejected'
    let orderStatus = "PENDING";
    if (status === "Complete") {
      orderStatus = "PAID";
    } else if (status === "Cancelled" || status === "Rejected" || status === "Returned") {
      orderStatus = "FAILED";
    }

    // Update the local order status in the database
    await prisma.order.update({
      where: { referenceId },
      data: { status: orderStatus }
    });

    console.log(`[Wayl Webhook] Successfully updated order ${referenceId} status to ${orderStatus}`);

    // Return 200 OK
    return Response.json({ received: true });
  } catch (error: any) {
    console.error("[Wayl Webhook] Error processing event:", error);
    return Response.json({ error: "Failed to process webhook event" }, { status: 400 });
  }
}
