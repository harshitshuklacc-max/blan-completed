import { NextRequest, NextResponse } from "next/server";
import { authenticateCustomer, setAuthCookie } from "@/lib/auth";
import { customerLoginSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = customerLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const result = await authenticateCustomer(parsed.data.email, parsed.data.password);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    await setAuthCookie(result.token!, "customer");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Customer login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
