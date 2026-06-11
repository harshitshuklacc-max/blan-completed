import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminUsername = process.env.ADMIN_USERNAME || "ShOeMafia";
  const adminPassword = process.env.ADMIN_PASSWORD || "ShoeMAFia@#1";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { username: adminUsername },
    update: {},
    create: { username: adminUsername, passwordHash, name: "Admin" },
  });

  const storeSettings = [
    { key: "store_name", value: "SHOE MAFIA", group: "store" },
    {
      key: "store_address",
      value:
        "Bus Stand, Old Telephone Exchange Road, Telipara, Bilaspur, Chhattisgarh 495001",
      group: "store",
    },
    { key: "store_phone", value: "07587555558", group: "store" },
    { key: "tax_rate", value: 0, group: "tax" },
    { key: "invoice_prefix", value: "INV", group: "invoice" },
    { key: "invoice_retention_days", value: 365, group: "invoice" },
    { key: "default_barcode_type", value: "CODE128", group: "barcode" },
    { key: "razorpay_enabled", value: true, group: "payment" },
    { key: "cod_enabled", value: true, group: "payment" },
  ];

  for (const setting of storeSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  await prisma.homepageSetting.upsert({
    where: { section: "about" },
    update: {},
    create: {
      section: "about",
      title: "About SHOE MAFIA",
      subtitle:
        "Your premier destination for luxury footwear in Bilaspur. We bring you the finest collection of shoes from top brands.",
      isActive: true,
      sortOrder: 1,
    },
  });

  console.log("Seed completed: admin user and store settings initialized in Neon PostgreSQL");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
