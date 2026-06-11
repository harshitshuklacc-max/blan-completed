import prisma from "@/lib/db";
import { slugify, generateSKU } from "@/lib/utils";
import { generateBarcodeValue } from "@/lib/barcode";
import type { ProductInput } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

export async function getProducts(params: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  filter?: string;
  status?: string;
}) {
  const page = params.page || 1;
  const limit = params.limit || 12;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {};

  if (params.status === "ALL") {
    // Admin: no status filter
  } else if (params.status) {
    where.status = params.status as Prisma.EnumProductStatusFilter;
  } else {
    where.status = "ACTIVE";
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { sku: { contains: params.search, mode: "insensitive" } },
      { barcodes: { some: { code: { contains: params.search } } } },
    ];
  }

  if (params.categoryId) where.categoryId = params.categoryId;
  if (params.brandId) where.brandId = params.brandId;

  if (params.filter === "new") where.isNewArrival = true;
  if (params.filter === "trending") where.isTrending = true;
  if (params.filter === "bestseller") where.isBestSeller = true;
  if (params.filter === "featured") where.isFeatured = true;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        brand: { select: { name: true } },
        category: { select: { name: true } },
        images: { where: { isPrimary: true }, take: 1 },
        inventory: { select: { quantity: true } },
        barcodes: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      inventory: true,
      barcodes: true,
      reviews: {
        where: { status: "APPROVED" },
        include: { customer: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

export async function getProductByBarcode(barcode: string) {
  const barcodeRecord = await prisma.barcode.findUnique({
    where: { code: barcode },
    include: {
      product: {
        include: {
          inventory: true,
          images: { where: { isPrimary: true }, take: 1 },
          barcodes: { where: { isPrimary: true }, take: 1 },
        },
      },
    },
  });

  return barcodeRecord?.product || null;
}

export async function createProduct(data: ProductInput, adminId?: string) {
  const sku = data.sku || generateSKU(data.name);
  const slug = slugify(data.name) + "-" + sku.toLowerCase();
  const barcodeCode = data.barcode || generateBarcodeValue(sku);

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        brandId: data.brandId || undefined,
        categoryId: data.categoryId || undefined,
        gender: data.gender,
        size: data.size,
        color: data.color,
        purchasePrice: data.purchasePrice,
        sellingPrice: data.sellingPrice,
        discount: data.discount,
        mrp: data.mrp,
        sku,
        status: data.status,
        inventory: {
          create: { quantity: data.stock },
        },
        barcodes: {
          create: { code: barcodeCode, type: "CODE128", isPrimary: true },
        },
      },
      include: { inventory: true, barcodes: true },
    });

    if (adminId) {
      await tx.auditLog.create({
        data: {
          adminId,
          action: "CREATE",
          entity: "product",
          entityId: product.id,
          details: { name: product.name, sku: product.sku },
        },
      });
    }

    return product;
  });
}

export async function updateProduct(id: string, data: Partial<ProductInput>, adminId?: string) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        brandId: data.brandId,
        categoryId: data.categoryId,
        gender: data.gender,
        size: data.size,
        color: data.color,
        purchasePrice: data.purchasePrice,
        sellingPrice: data.sellingPrice,
        discount: data.discount,
        mrp: data.mrp,
        status: data.status,
      },
    });

    if (data.stock !== undefined) {
      await tx.inventory.upsert({
        where: { productId: id },
        update: { quantity: data.stock },
        create: { productId: id, quantity: data.stock },
      });
    }

    if (adminId) {
      await tx.auditLog.create({
        data: {
          adminId,
          action: "UPDATE",
          entity: "product",
          entityId: id,
        },
      });
    }

    return product;
  });
}

export async function deleteProduct(id: string, adminId?: string) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.delete({ where: { id } });

    if (adminId) {
      await tx.auditLog.create({
        data: {
          adminId,
          action: "DELETE",
          entity: "product",
          entityId: id,
          details: { name: product.name },
        },
      });
    }

    return product;
  });
}

export async function duplicateProduct(id: string, adminId?: string) {
  const original = await prisma.product.findUnique({
    where: { id },
    include: { images: true, inventory: true, barcodes: true },
  });

  if (!original) throw new Error("Product not found");

  const newSku = generateSKU(original.name);

  return createProduct(
    {
      name: `${original.name} (Copy)`,
      description: original.description || undefined,
      brandId: original.brandId,
      categoryId: original.categoryId,
      gender: original.gender,
      size: original.size || undefined,
      color: original.color || undefined,
      purchasePrice: original.purchasePrice.toNumber(),
      sellingPrice: original.sellingPrice.toNumber(),
      discount: original.discount.toNumber(),
      mrp: original.mrp.toNumber(),
      sku: newSku,
      stock: original.inventory?.quantity || 0,
      status: "DRAFT",
    },
    adminId
  );
}
