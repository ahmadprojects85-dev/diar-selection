import { verifyPassword, createToken } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return Response.json({ error: "Password is required" }, { status: 400 });
    }

    const isValid = await verifyPassword(password);
    if (!isValid) {
      return Response.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = await createToken();

    const response = Response.json({ success: true });

    // Set HTTP-only cookie
    response.headers.set(
      "Set-Cookie",
      `admin-token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
    );

    return response;
  } catch (error) {
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
