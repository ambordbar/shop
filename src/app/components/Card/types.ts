import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  image: z.string().url(),
  isNew: z.boolean().default(false),
});

export type Product = z.infer<typeof ProductSchema>;
