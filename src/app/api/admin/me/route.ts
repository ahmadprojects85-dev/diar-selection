import { verifyAuth } from "@/lib/auth";

// GET /api/admin/me — Check if admin is authenticated
export async function GET() {
  const isAdmin = await verifyAuth();
  return Response.json({ authenticated: isAdmin });
}
