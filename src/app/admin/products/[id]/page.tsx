import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, brands, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { inventory: true },
    }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-8">Edit Product</h1>
      <ProductForm
        product={{
          ...product,
          purchasePrice: product.purchasePrice.toNumber(),
          sellingPrice: product.sellingPrice.toNumber(),
          discount: product.discount.toNumber(),
          mrp: product.mrp.toNumber(),
        }}
        brands={brands}
        categories={categories}
      />
    </div>
  );
}
