import { z } from "zod";

// Rating schema
export const RatingSchema = z.object({
  rate: z.number(),
  count: z.number().int().positive(),
});

// Category schema
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
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
});

// Cart item schema
export const CartItemSchema = ProductSchema.extend({
  quantity: z.number().int().positive(),
});

// Customer info schema
export const CustomerInfoSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  address: z
    .string()
    .min(1, "Address cannot be empty")
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      "Address can only contain letters, numbers and spaces"
    ),
  phone: z
    .string()
    .min(1, "Phone number cannot be empty")
    .regex(/^[0-9]+$/, "Phone number can only contain numbers"),
});

// Order schema
export const OrderSchema = z.object({
  uid: z.string(),
  items: z.array(CartItemSchema),
  shipping: CustomerInfoSchema,
  status: z.enum(["pending", "completed", "failed"]),
  total: z.number().positive(),
  stripeSessionId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

// TypeScript types derived from Zod schemas
export type Rating = z.infer<typeof RatingSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Product = z.infer<typeof ProductSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type CustomerInfo = z.infer<typeof CustomerInfoSchema>;
export type Order = z.infer<typeof OrderSchema>;
