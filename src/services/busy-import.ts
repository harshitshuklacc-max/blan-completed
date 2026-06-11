import prisma from "@/lib/db";
import { parseBusyPDF, validateBusyProductRow } from "@/lib/busy-parser";
import { slugify } from "@/lib/utils";
import { updateStock } from "@/lib/inventory";

export async function processBusyImport(
  buffer: ArrayBuffer,
  fileName: string,
  adminId: string
) {
  const { rows, errors: parseErrors, skipped, totalLinesScanned } = await parseBusyPDF(buffer);

  let addedCount = 0;
  let updatedCount = 0;
  let failedCount = 0;
  let skippedCount = skipped.length;
  const errors: string[] = [...parseErrors, ...skipped];

  if (rows.length === 0) {
    const log = await prisma.busyImportLog.create({
      data: {
        adminId,
        fileName,
        addedCount: 0,
        updatedCount: 0,
        failedCount: 0,
        errors: errors.length > 0 ? errors : ["No valid products extracted from PDF"],
      },
    });

    return {
      addedCount: 0,
      updatedCount: 0,
      failedCount: 0,
      skippedCount,
      parsedCount: 0,
      totalLinesScanned,
      errors,
      logId: log.id,
    };
  }

  for (const rawRow of rows) {
    const validation = validateBusyProductRow(rawRow);
    if (!validation.valid) {
      skippedCount++;
      errors.push(`Skipped: ${validation.reason}`);
      continue;
    }

    const row = validation.row;

    try {
      const existingBarcode = await prisma.barcode.findUnique({
        where: { code: row.barcode },
        include: { product: { include: { inventory: true } } },
      });

      if (existingBarcode?.product) {
        if (row.quantity > 0) {
          await updateStock({
            productId: existingBarcode.product.id,
            quantityChange: row.quantity,
            changeType: "BUSY_IMPORT",
            adminId,
            reference: fileName,
            notes: `BUSY import: ${row.name}`,
          });
        }

        await prisma.product.update({
          where: { id: existingBarcode.product.id },
          data: {
            name: row.name,
            mrp: row.mrp,
            sellingPrice: row.sellingPrice,
            sku: row.sku,
          },
        });

        updatedCount++;
      } else {
        const baseSlug = slugify(row.name);
        let slug = `${baseSlug}-${row.barcode}`;
        let slugAttempt = 0;

        while (await prisma.product.findUnique({ where: { slug } })) {
          slugAttempt++;
          slug = `${baseSlug}-${row.barcode}-${slugAttempt}`;
        }

        const existingSku = await prisma.product.findUnique({ where: { sku: row.sku } });
        const sku = existingSku ? `${row.sku}-${row.barcode}` : row.sku;

        await prisma.product.create({
          data: {
            name: row.name,
            slug,
            sku,
            mrp: row.mrp,
            sellingPrice: row.sellingPrice,
            purchasePrice: row.sellingPrice * 0.7,
            status: "ACTIVE",
            inventory: {
              create: { quantity: row.stock || row.quantity },
            },
            barcodes: {
              create: { code: row.barcode, type: "CODE128", isPrimary: true },
            },
          },
        });

        addedCount++;
      }
    } catch (err) {
      failedCount++;
      errors.push(
        `Failed to import "${row.name}" (${row.barcode}): ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  }

  const log = await prisma.busyImportLog.create({
    data: {
      adminId,
      fileName,
      addedCount,
      updatedCount,
      failedCount,
      errors: errors.length > 0 ? errors : undefined,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId,
      action: "IMPORT",
      entity: "busy_import",
      entityId: log.id,
      details: { fileName, addedCount, updatedCount, failedCount, skippedCount, parsedCount: rows.length },
    },
  });

  return {
    addedCount,
    updatedCount,
    failedCount,
    skippedCount,
    parsedCount: rows.length,
    totalLinesScanned,
    errors,
    logId: log.id,
  };
}
