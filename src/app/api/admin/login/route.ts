import { verifyPassword, createToken } from "@/lib/auth";
import { NextRequest } from "next/server";

// Rate limiting state for admin login: IP -> { count, resetTime }
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const now = Date.now();

    const attempt = loginAttempts.get(ip);
    if (attempt) {
      if (now > attempt.resetTime) {
        loginAttempts.set(ip, { count: 1, resetTime: now + 60000 });
      } else if (attempt.count >= 5) {
        console.warn(`[SECURITY ALERT] Rate limit exceeded for admin login from IP: ${ip}`);
        return Response.json(
          { error: "Too many failed login attempts. Please wait 1 minute before trying again." },
          { status: 429 }
        );
      } else {
        attempt.count += 1;
      }
    } else {
      loginAttempts.set(ip, { count: 1, resetTime: now + 60000 });
    }

    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return Response.json({ error: "Invalid password parameter" }, { status: 400 });
    }

    const isValid = await verifyPassword(password);
    if (!isValid) {
      console.warn(`[SECURITY ALERT] Failed admin login attempt from IP: ${ip}`);
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Reset attempt counter on success
    loginAttempts.delete(ip);

    const token = await createToken();
    const response = Response.json({ success: true });
    const isProd = process.env.NODE_ENV === "production";

    // Set secure HTTP-only cookie
    response.headers.set(
      "Set-Cookie",
      `admin-token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${24 * 60 * 60}${isProd ? "; Secure" : ""}`
    );

    console.log(`[SECURITY EVENT] Successful admin login from IP: ${ip}`);
    return response;
  } catch (error) {
    console.error("Login endpoint error:", error);
    return Response.json({ error: "An unexpected authentication error occurred." }, { status: 500 });
  }
}
