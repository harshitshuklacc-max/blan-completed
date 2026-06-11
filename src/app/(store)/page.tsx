import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/home/hero-section";
import { AdminLoginDialog } from "@/components/home/admin-login-dialog";
import { ProductCard } from "@/components/products/product-card";
import { getHomepageData } from "@/services/homepage";

export const dynamic = "force-dynamic";

function ProductSection({
  title,
  subtitle,
  products,
  filter,
}: {
  title: string;
  subtitle: string;
  products: Awaited<ReturnType<typeof getHomepageData>>["featuredProducts"];
  filter?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
              {title}
            </h2>
            <p className="text-white/60">{subtitle}</p>
          </div>
          {filter && (
            <Link href={`/shop?filter=${filter}`}>
              <Button variant="ghost" className="gap-1 text-red-400 hover:text-red-300">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
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
      </div>
    </section>
  );
}

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <>
      <HeroSection banners={data.heroBanners} />

      <ProductSection
        title="Featured Collection"
        subtitle="Handpicked premium footwear"
        products={data.featuredProducts}
        filter="featured"
      />

      <ProductSection
        title="New Arrivals"
        subtitle="Latest additions to our collection"
        products={data.newArrivals}
        filter="new"
      />

      <ProductSection
        title="Trending Now"
        subtitle="What everyone is wearing"
        products={data.trendingProducts}
        filter="trending"
      />

      {data.categories.length > 0 && (
        <section className="py-16 bg-white/[0.02]">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="glass-card p-6 text-center luxury-border group"
                >
                  <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-sm text-white/50 mt-2">{cat.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ProductSection
        title="Best Sellers"
        subtitle="Our most loved shoes"
        products={data.bestSellers}
        filter="bestseller"
      />

      {data.brands.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Our Brands
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {data.brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/shop?brand=${brand.slug}`}
                  className="glass-card px-8 py-4 luxury-border hover:border-red-500/50 transition-all"
                >
                  <span className="font-semibold text-white">{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.reviews.length > 0 && (
        <section className="py-16 bg-white/[0.02]">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Customer Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.reviews.map((review) => (
                <div key={review.id} className="glass-card p-6 luxury-border">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`}
                      />
                    ))}
                  </div>
                  {review.title && (
                    <h4 className="font-semibold text-white mb-2">{review.title}</h4>
                  )}
                  {review.comment && (
                    <p className="text-white/60 text-sm mb-4">{review.comment}</p>
                  )}
                  <p className="text-sm text-white/40">
                    — {review.customer.firstName} {review.customer.lastName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            About SHOE MAFIA
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed">
            {data.homepageSettings.find((s) => s.section === "about")?.subtitle ||
              "Your premier destination for luxury footwear in Bilaspur. We bring you the finest collection of shoes from top brands, combining style, comfort, and quality."}
          </p>
          <Link href="/contact">
            <Button variant="luxury" size="lg">
              Get In Touch
            </Button>
          </Link>
        </div>
      </section>

      <div className="fixed bottom-4 right-4 z-40">
        <AdminLoginDialog />
      </div>
    </>
  );
}
