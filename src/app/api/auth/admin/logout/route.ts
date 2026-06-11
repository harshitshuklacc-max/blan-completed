import { NextResponse } from "next/server";
import { clearAuthCookie, getAdminSession } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST() {
  const session = await getAdminSession();

  if (session) {
    await prisma.auditLog.create({
      data: {
        adminId: session.sub,
        action: "LOGOUT",
        entity: "admin",
        entityId: session.sub,
      },
    });
  }

  await clearAuthCookie("admin");
  return NextResponse.json({ success: true });
}
