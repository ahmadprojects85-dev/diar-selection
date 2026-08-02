import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "diar-selection-secure-jwt-secret-key-2026"
);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Securely verify admin password (supports bcrypt hash or constant-time compare)
export async function verifyPassword(password: string): Promise<boolean> {
  if (!password) return false;
  if (ADMIN_PASSWORD.startsWith("$2a$") || ADMIN_PASSWORD.startsWith("$2b$")) {
    return await bcrypt.compare(password, ADMIN_PASSWORD);
  }
  // Constant-time string comparison to prevent timing side-channel attacks
  if (password.length !== ADMIN_PASSWORD.length) return false;
  let result = 0;
  for (let i = 0; i < password.length; i++) {
    result |= password.charCodeAt(i) ^ ADMIN_PASSWORD.charCodeAt(i);
  }
  return result === 0;
}

// Create a JWT token for admin session
export async function createToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

// Verify JWT token from cookies
export async function verifyAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    if (!token) return false;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

// Helper to check admin auth and return 401 if not authenticated
export async function requireAdmin(): Promise<Response | null> {
  const isAdmin = await verifyAuth();
  if (!isAdmin) {
    return Response.json({ error: "Unauthorized access denied." }, { status: 401 });
  }
  return null;
}
