import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env_DATABASE_URL: process.env.DATABASE_URL ? "SET (" + process.env.DATABASE_URL.substring(0, 30) + "...)" : "NOT SET",
    env_NODE_ENV: process.env.NODE_ENV,
  };

  // Test 1: Raw @tidbcloud/serverless connection
  try {
    const { connect } = await import("@tidbcloud/serverless");
    let url = (process.env.DATABASE_URL || "mysql://YR4RFaxG4nkiGLt.root:3RC5KIq71eW1jUga@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict").trim().replace(/^["']|["']$/g, '');
    results.cleaned_url = url;
    const conn = connect({ url });
    const res = await conn.execute("SELECT COUNT(*) as cnt FROM products");
    results.raw_connection = { success: true, product_count: res };
  } catch (e: any) {
    results.raw_connection = { success: false, error: e?.message || String(e), stack: e?.stack?.substring(0, 500) };
  }

  // Test 2: Prisma client
  try {
    const { prisma } = await import("@/lib/prisma");
    const count = await prisma.product.count();
    results.prisma = { success: true, product_count: count };
  } catch (e: any) {
    results.prisma = { success: false, error: e?.message || String(e), stack: e?.stack?.substring(0, 500) };
  }

  return Response.json(results, { 
    headers: { "Cache-Control": "no-store" } 
  });
}
