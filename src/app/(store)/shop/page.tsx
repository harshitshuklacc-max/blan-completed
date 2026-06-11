import { Metadata } from "next";
import { ProductCard } from "@/components/products/product-card";
import { getProducts } from "@/services/products";
import prisma from "@/lib/db";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our premium collection of luxury footwear at SHOE MAFIA.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    filter?: string;
    category?: string;
    brand?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  let categoryId: string | undefined;
  let brandId: string | undefined;

  if (params.category) {
    const cat = await prisma.category.findUnique({ where: { slug: params.category } });
    categoryId = cat?.id;
  }
  if (params.brand) {
    const brand = await prisma.brand.findUnique({ where: { slug: params.brand } });
    brandId = brand?.id;
  }

  const { products, total, totalPages } = await getProducts({
    page,
    search: params.q,
    filter: params.filter,
    categoryId,
    brandId,
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-white mb-2">Shop</h1>
        <p className="text-white/60">
          {total} products {params.q ? `matching "${params.q}"` : "available"}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/50 text-lg">No products found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                sellingPrice={product.sellingPrice.toNumber()}
                mrp={product.mrp.toNumber()}
                discount={product.discount.toNumber()}
                image={product.images[0]?.url}
                brand={product.brand?.name}
                isNew={product.isNewArrival}
                isTrending={product.isTrending}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/shop?page=${p}${params.q ? `&q=${params.q}` : ""}${params.filter ? `&filter=${params.filter}` : ""}`}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    p === page
                      ? "bg-red-600 text-white"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
