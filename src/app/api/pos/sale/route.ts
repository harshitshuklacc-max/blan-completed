import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { posSaleSchema } from "@/lib/validations";
import { createPosSale } from "@/services/orders";

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = posSaleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const order = await createPosSale(parsed.data, session.sub);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POS sale error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process sale" },
      { status: 500 }
    );
  }
}
