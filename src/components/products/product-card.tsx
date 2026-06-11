"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  sellingPrice: number;
  mrp: number;
  discount: number;
  image?: string | null;
  brand?: string | null;
  isNew?: boolean;
  isTrending?: boolean;
}

export function ProductCard({
  name,
  slug,
  sellingPrice,
  mrp,
  discount,
  image,
  brand,
  isNew,
  isTrending,
}: ProductCardProps) {
  const finalPrice = sellingPrice - (sellingPrice * discount) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group glass-card luxury-border overflow-hidden"
    >
      <Link href={`/shop/${slug}`}>
        <div className="relative aspect-square overflow-hidden bg-white/5">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/20">
              <ShoppingBag className="h-16 w-16" />
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {discount > 0 && (
              <Badge variant="default">{discount}% OFF</Badge>
            )}
            {isNew && <Badge variant="success">NEW</Badge>}
            {isTrending && <Badge variant="warning">TRENDING</Badge>}
          </div>

          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          {brand && (
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">{brand}</p>
          )}
          <h3 className="font-medium text-white group-hover:text-red-400 transition-colors line-clamp-2">
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-white">{formatCurrency(finalPrice)}</span>
            {discount > 0 && (
              <span className="text-sm text-white/40 line-through">{formatCurrency(mrp)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
