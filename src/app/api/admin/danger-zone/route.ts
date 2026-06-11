import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, verifyAdminPassword } from "@/lib/auth";
import { dangerZoneSchema } from "@/lib/validations";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = dangerZoneSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const validPassword = await verifyAdminPassword(parsed.data.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid admin password" }, { status: 403 });
    }

    const { action } = parsed.data;

    await prisma.$transaction(async (tx) => {
      switch (action) {
        case "delete_products":
          await tx.productImage.deleteMany();
          await tx.barcode.deleteMany();
          await tx.inventoryLog.deleteMany();
          await tx.inventory.deleteMany();
          await tx.product.deleteMany();
          break;
        case "delete_inventory":
          await tx.inventoryLog.deleteMany();
          await tx.inventory.deleteMany();
          break;
        case "delete_orders":
          await tx.paymentLog.deleteMany();
          await tx.payment.deleteMany();
          await tx.invoiceItem.deleteMany();
          await tx.invoice.deleteMany();
          await tx.orderItem.deleteMany();
          await tx.order.deleteMany();
          break;
        case "factory_reset":
          await tx.$executeRawUnsafe(`
            TRUNCATE TABLE
              payment_logs, payments, invoice_items, invoices,
              order_items, orders, cart_items, carts,
              wishlists, reviews, returns, refunds,
              inventory_logs, inventory, barcodes, product_images,
              products, notifications, analytics, busy_import_logs,
              addresses, coupons, hero_banners, homepage_settings
            RESTART IDENTITY CASCADE
          `);
          break;
      }

      await tx.auditLog.create({
        data: {
          adminId: session.sub,
          action: "FACTORY_RESET",
          entity: "danger_zone",
          details: { action },
        },
      });
    });

    return NextResponse.json({ success: true, action });
  } catch (error) {
    console.error("Danger zone error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Operation failed" },
      { status: 500 }
    );
  }
}
