import { NextRequest, NextResponse } from "next/server";
import { setSetting } from "@/lib/settings";
import { settingSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = settingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    await setSetting(parsed.data.key, parsed.data.value, parsed.data.group);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings error:", error);
    return NextResponse.json({ error: "Failed to save setting" }, { status: 500 });
  }
}
