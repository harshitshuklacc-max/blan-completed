import prisma from "@/lib/db";

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  const setting = await prisma.setting.findUnique({ where: { key } });
  if (!setting) return defaultValue;
  return setting.value as T;
}

export async function setSetting(key: string, value: unknown, group = "general") {
  return prisma.setting.upsert({
    where: { key },
    update: { value: value as object, group },
    create: { key, value: value as object, group },
  });
}

export async function getStoreSettings() {
  const settings = await prisma.setting.findMany({
    where: { group: { in: ["store", "invoice", "tax", "payment", "barcode"] } },
  });

  const map: Record<string, unknown> = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }

  return {
    storeName: (map.store_name as string) || "SHOE MAFIA",
    storeAddress:
      (map.store_address as string) ||
      "Bus Stand, Old Telephone Exchange Road, Telipara, Bilaspur, Chhattisgarh 495001",
    storePhone: (map.store_phone as string) || "07587555558",
    taxRate: (map.tax_rate as number) || 0,
    invoicePrefix: (map.invoice_prefix as string) || "INV",
    invoiceRetentionDays: (map.invoice_retention_days as number) || 365,
    defaultBarcodeType: (map.default_barcode_type as string) || "CODE128",
    razorpayEnabled: (map.razorpay_enabled as boolean) ?? true,
    codEnabled: (map.cod_enabled as boolean) ?? true,
  };
}
