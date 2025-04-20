import { z } from "zod";

// Rating schema
export const RatingSchema = z.object({
  rate: z.number(),
  count: z.number().int().positive(),
});

// Product schema
export const ProductSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  price: z.number().positive(),
  description: z.string(),
  category: z.string(),
  image: z.string().url(),
  rating: RatingSchema,
  quantity: z.number().int().positive().optional(),
});

// Cart item schema
export const CartItemSchema = ProductSchema.extend({
  quantity: z.number().int().positive(),
});

// TypeScript types derived from Zod schemas
export type Rating = z.infer<typeof RatingSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;

// Customer info type
export interface CustomerInfo {
  name: string;
  address: string;
  phone: string;
}
