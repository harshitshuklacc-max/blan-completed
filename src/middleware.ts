import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production"
);

const protectedAdminPaths = ["/admin", "/api/admin", "/api/pos", "/api/import"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = protectedAdminPaths.some(
    (path) => pathname.startsWith(path) && !pathname.includes("/login")
  );

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("shoe-mafia-admin-token")?.value;

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if ((payload as { role?: string }).role !== "admin") {
      throw new Error("Not admin");
    }
    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/pos/:path*", "/api/import/:path*"],
};
