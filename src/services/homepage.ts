import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    brand: { select: { name: true } };
    images: { where: { isPrimary: true }; take: 1 };
  };
}>;

type ReviewWithRelations = Prisma.ReviewGetPayload<{
  include: {
    customer: { select: { firstName: true; lastName: true } };
    product: { select: { name: true; slug: true } };
  };
}>;

const emptyHomepageData = {
  heroBanners: [] as any[],
  featuredProducts: [] as ProductWithRelations[],
  trendingProducts: [] as ProductWithRelations[],
  newArrivals: [] as ProductWithRelations[],
  bestSellers: [] as ProductWithRelations[],
  categories: [] as any[],
  brands: [] as any[],
  reviews: [] as ReviewWithRelations[],
  homepageSettings: [] as any[],
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
          customer: { select: { firstName: true; lastName: true } },
          product: { select: { name: true; slug: true } },
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
