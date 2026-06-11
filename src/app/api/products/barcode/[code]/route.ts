import { NextRequest, NextResponse } from "next/server";
import { getProductByBarcode } from "@/services/products";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const product = await getProductByBarcode(code);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Barcode lookup error:", error);
    return NextResponse.json({ error: "Failed to lookup barcode" }, { status: 500 });
  }
}
