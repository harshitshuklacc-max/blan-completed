import { NextResponse } from "next/server";
import { getDashboardStats, getRevenueChart } from "@/lib/analytics";

export async function GET() {
  try {
    const [stats, revenueChart] = await Promise.all([
      getDashboardStats(),
      getRevenueChart(30),
    ]);

    return NextResponse.json({ stats, revenueChart });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
