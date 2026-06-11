import prisma from "@/lib/db";

const emptyHomepageData = {
  heroBanners: [] as Awaited<ReturnType<typeof prisma.heroBanner.findMany>>,
  featuredProducts: [] as Awaited<ReturnType<typeof prisma.product.findMany>>,
  trendingProducts: [] as Awaited<ReturnType<typeof prisma.product.findMany>>,
  newArrivals: [] as Awaited<ReturnType<typeof prisma.product.findMany>>,
  bestSellers: [] as Awaited<ReturnType<typeof prisma.product.findMany>>,
  categories: [] as Awaited<ReturnType<typeof prisma.category.findMany>>,
  brands: [] as Awaited<ReturnType<typeof prisma.brand.findMany>>,
  reviews: [] as Awaited<ReturnType<typeof prisma.review.findMany>>,
  homepageSettings: [] as Awaited<ReturnType<typeof prisma.homepageSetting.findMany>>,
};

export async function getHomepageData() {
  try {
    const [
      heroBanners,
      featuredProducts,
      trendingProducts,
      newArrivals,
      bestSellers,
      categories,
      brands,
      reviews,
      homepageSettings,
    ] = await Promise.all([
      prisma.heroBanner.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.product.findMany({
        where: { status: "ACTIVE", isFeatured: true },
        include: {
          brand: { select: { name: true } },
          images: { where: { isPrimary: true }, take: 1 },
        },
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { status: "ACTIVE", isTrending: true },
        include: {
          brand: { select: { name: true } },
          images: { where: { isPrimary: true }, take: 1 },
        },
        take: 8,
      }),
      prisma.product.findMany({
        where: { status: "ACTIVE", isNewArrival: true },
        include: {
          brand: { select: { name: true } },
          images: { where: { isPrimary: true }, take: 1 },
        },
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { status: "ACTIVE", isBestSeller: true },
        include: {
          brand: { select: { name: true } },
          images: { where: { isPrimary: true }, take: 1 },
        },
        take: 8,
      }),
      prisma.category.findMany({
        where: { isActive: true, parentId: null },
        orderBy: { sortOrder: "asc" },
        take: 8,
      }),
      prisma.brand.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        take: 12,
      }),
      prisma.review.findMany({
        where: { status: "APPROVED" },
        include: {
          customer: { select: { firstName: true, lastName: true } },
          product: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.homepageSetting.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    return {
      heroBanners,
      featuredProducts,
      trendingProducts,
      newArrivals,
      bestSellers,
      categories,
      brands,
      reviews,
      homepageSettings,
    };
  } catch (error) {
    console.error("Homepage data fetch failed — run: npm run db:setup", error);
    return emptyHomepageData;
  }
}
