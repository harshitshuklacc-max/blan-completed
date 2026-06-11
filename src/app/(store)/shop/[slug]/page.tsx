import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { getProductBySlug } from "@/services/products";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description || `Buy ${product.name} at SHOE MAFIA`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.status !== "ACTIVE") notFound();

  const finalPrice =
    product.sellingPrice.toNumber() -
    (product.sellingPrice.toNumber() * product.discount.toNumber()) / 100;

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square relative glass-card overflow-hidden luxury-border">
          {product.images[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/20">
              No image
            </div>
          )}
        </div>

        <div>
          {product.brand && (
            <p className="text-sm text-white/50 uppercase tracking-wider mb-2">
              {product.brand.name}
            </p>
          )}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {product.name}
          </h1>

          {avgRating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`}
                  />
                ))}
              </div>
              <span className="text-white/50 text-sm">({product.reviews.length} reviews)</span>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-white">{formatCurrency(finalPrice)}</span>
            {product.discount.toNumber() > 0 && (
              <>
                <span className="text-lg text-white/40 line-through">
                  {formatCurrency(product.mrp.toNumber())}
                </span>
                <Badge>{product.discount.toNumber()}% OFF</Badge>
              </>
            )}
          </div>

          {product.description && (
            <p className="text-white/60 leading-relaxed mb-6">{product.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-8">
            {product.size && (
              <div className="glass-card p-4">
                <p className="text-xs text-white/50">Size</p>
                <p className="text-white font-medium">{product.size}</p>
              </div>
            )}
            {product.color && (
              <div className="glass-card p-4">
                <p className="text-xs text-white/50">Color</p>
                <p className="text-white font-medium">{product.color}</p>
              </div>
            )}
            <div className="glass-card p-4">
              <p className="text-xs text-white/50">SKU</p>
              <p className="text-white font-medium">{product.sku}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs text-white/50">Stock</p>
              <p className={`font-medium ${(product.inventory?.quantity || 0) > 0 ? "text-green-400" : "text-red-400"}`}>
                {(product.inventory?.quantity || 0) > 0 ? "In Stock" : "Out of Stock"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {product.reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-white mb-6">Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="glass-card p-6 luxury-border">
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`}
                    />
                  ))}
                </div>
                {review.title && <h4 className="text-white font-medium">{review.title}</h4>}
                {review.comment && <p className="text-white/60 text-sm mt-1">{review.comment}</p>}
                <p className="text-white/40 text-xs mt-2">
                  {review.customer.firstName} {review.customer.lastName}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
