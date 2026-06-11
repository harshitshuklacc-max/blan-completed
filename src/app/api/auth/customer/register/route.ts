import { NextRequest, NextResponse } from "next/server";
import { registerCustomer, setAuthCookie } from "@/lib/auth";
import { customerRegisterSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = customerRegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const result = await registerCustomer(parsed.data);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    await setAuthCookie(result.token!, "customer");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Customer register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
