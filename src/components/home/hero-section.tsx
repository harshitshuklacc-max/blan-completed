"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  link?: string | null;
  ctaText?: string | null;
}

interface HeroSectionProps {
  banners: HeroBanner[];
}

export function HeroSection({ banners }: HeroSectionProps) {
  const banner = banners[0];

  if (!banner) {
    return (
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-red-glow" />
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-7xl font-bold text-gradient mb-6"
          >
            SHOE MAFIA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/70 mb-8 max-w-2xl mx-auto"
          >
            Premium Luxury Footwear — Step Into Style
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/shop">
              <Button variant="luxury" size="lg" className="gap-2">
                Explore Collection <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={banner.image}
          alt={banner.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-4">
            {banner.title}
          </h1>
          {banner.subtitle && (
            <p className="text-xl text-white/70 mb-8">{banner.subtitle}</p>
          )}
          <Link href={banner.link || "/shop"}>
            <Button variant="luxury" size="lg" className="gap-2">
              {banner.ctaText || "Shop Now"} <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
