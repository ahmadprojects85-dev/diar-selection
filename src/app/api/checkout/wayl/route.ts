import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerDetails } = body;

    if (!items || !items.length || !customerDetails) {
      return Response.json(
        { error: "Missing required checkout details: items, customerDetails" },
        { status: 400 }
      );
    }

    const rawToken = process.env.WAYL_API_TOKEN;
    const token = rawToken ? rawToken.trim().replace(/^["']|["']$/g, '') : undefined;
    if (!token) {
      return Response.json(
        { error: "Wayl API Token (WAYL_API_TOKEN) is not configured on the server." },
        { status: 500 }
      );
    }

    // Build lineItem array as required by Wayl API
    const lineItem = items.map((item: any) => {
      const colorText = item.selectedColor ? ` (${item.selectedColor.name})` : '';
      return {
        label: `${item.name}${colorText} (x${item.quantity})`.substring(0, 100),
        amount: Math.round(Number(item.price) * Number(item.quantity)),
        type: "increase"
      };
    });

    // Calculate total order cost as sum of lineItem amounts
    const totalIqd = lineItem.reduce((acc: number, item: any) => acc + item.amount, 0);

    // Wayl API requires total amount to be at least 1,000 IQD
    if (totalIqd < 1000) {
      return Response.json(
        { error: "Total checkout amount must be at least 1,000 IQD for online payments. Please add more items or choose Cash on Delivery (WhatsApp)." },
        { status: 400 }
      );
    }

    // Create a unique reference ID for the payment transaction
    const referenceId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Save the order to our local database with 'PENDING' status
    await prisma.order.create({
      data: {
        referenceId,
        customerName: customerDetails.fullName,
        phone: customerDetails.phone,
        city: customerDetails.city,
        address: customerDetails.address,
        totalAmount: totalIqd,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            productName: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
            color: item.selectedColor ? item.selectedColor.name : null,
          })),
        },
      },
    });

    // Build redirection URL back to storefront success page
    const redirectionUrl = `${request.nextUrl.origin}/checkout/success?ref=${referenceId}`;

    // Webhook settings (required fields)
    const webhookSecret = process.env.WAYL_WEBHOOK_SECRET || "diar-selection-webhook-secret-2026";
    let webhookUrl = `${request.nextUrl.origin}/api/checkout/wayl/webhook`;
    if (webhookUrl.startsWith("http://localhost")) {
      webhookUrl = "https://example.com/api/checkout/wayl/webhook"; // fallback dummy URL for local development to bypass HTTP/localhost restrictions
    }

    const payload = {
      referenceId,
      total: totalIqd,
      currency: "IQD",
      redirectionUrl,
      webhookUrl,
      webhookSecret,
      lineItem
    };

    console.log("Sending checkout payload to Wayl:", JSON.stringify(payload, null, 2));

    // Call Wayl API to generate secure checkout link
    const response = await fetch("https://api.thewayl.com/api/v1/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WAYL-AUTHENTICATION": token,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Wayl API error response:", errorText);
      
      // If link creation fails, update the local order to 'FAILED'
      await prisma.order.update({
        where: { referenceId },
        data: { status: "FAILED" }
      });

      let parsedError: any = {};
      try {
        parsedError = JSON.parse(errorText);
      } catch (e) {}

      const errorMsg = parsedError.message || `Wayl API returned error status: ${response.status}`;
      return Response.json(
        { error: errorMsg, details: parsedError.errors },
        { status: response.status }
      );
    }

    const resData = await response.json();
    const checkoutUrl = resData?.data?.url;

    if (!checkoutUrl) {
      console.error("Wayl API missing checkout URL in response:", resData);
      return Response.json(
        { error: "No checkout URL returned from payment provider." },
        { status: 500 }
      );
    }

    return Response.json({ url: checkoutUrl });
  } catch (error: any) {
    console.error("Checkout process error:", error);
    return Response.json(
      { error: error.message || "An unexpected error occurred during checkout processing" },
      { status: 500 }
    );
  }
}
