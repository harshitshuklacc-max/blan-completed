import { z } from "zod";

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const customerLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const customerRegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  phone: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  brandId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  gender: z.enum(["MEN", "WOMEN", "UNISEX", "KIDS"]).default("UNISEX"),
  size: z.string().optional(),
  color: z.string().optional(),
  purchasePrice: z.coerce.number().min(0),
  sellingPrice: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).max(100).default(0),
  mrp: z.coerce.number().min(0),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  stock: z.coerce.number().int().min(0).default(0),
  status: z.enum(["ACTIVE", "DISABLED", "DRAFT"]).default("ACTIVE"),
});

export const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const brandSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const addressSchema = z.object({
  label: z.string().default("Home"),
  fullName: z.string().min(1),
  phone: z.string().min(10),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(6),
  country: z.string().default("India"),
  isDefault: z.boolean().default(false),
});

export const couponSchema = z.object({
  code: z.string().min(3),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().min(0),
  minOrderValue: z.coerce.number().optional(),
  maxDiscount: z.coerce.number().optional(),
  usageLimit: z.coerce.number().int().optional(),
  isActive: z.boolean().default(true),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
});

export const posSaleSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.coerce.number().int().min(1),
      discount: z.coerce.number().min(0).default(0),
    })
  ).min(1),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  paymentMethod: z.enum(["CASH", "UPI", "CARD", "POS"]),
  discount: z.coerce.number().min(0).default(0),
});

export const settingSchema = z.object({
  key: z.string(),
  value: z.unknown(),
  group: z.string().default("general"),
});

export const dangerZoneSchema = z.object({
  password: z.string().min(1),
  confirmation: z.literal("DELETE"),
  action: z.enum([
    "delete_products",
    "delete_inventory",
    "delete_orders",
    "factory_reset",
  ]),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type CustomerLoginInput = z.infer<typeof customerLoginSchema>;
export type CustomerRegisterInput = z.infer<typeof customerRegisterSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type PosSaleInput = z.infer<typeof posSaleSchema>;
