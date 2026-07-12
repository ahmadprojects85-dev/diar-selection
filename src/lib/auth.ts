import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-me"
);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Verify admin password
export async function verifyPassword(password: string): Promise<boolean> {
  // Simple comparison for now — not hashed in env for simplicity
  return password === ADMIN_PASSWORD;
}

// Create a JWT token for admin session
export async function createToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

// Verify JWT token from cookies
export async function verifyAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token) return false;
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

// Helper to check admin auth and return 401 if not authenticated
export async function requireAdmin(): Promise<Response | null> {
  const isAdmin = await verifyAuth();
  if (!isAdmin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
