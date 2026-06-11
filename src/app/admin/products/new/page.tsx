import { ProductForm } from "@/components/admin/product-form";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-8">Add Product</h1>
      <ProductForm brands={brands} categories={categories} />
    </div>
  );
}
