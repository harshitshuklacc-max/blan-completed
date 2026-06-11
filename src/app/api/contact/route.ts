import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "contact_form",
        details: {
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          message: parsed.data.message,
        },
      },
    });

    return NextResponse.json({ success: true, message: "Message received. We will get back to you soon." });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
  }
}
