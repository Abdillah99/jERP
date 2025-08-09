import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().optional(),
  sku: z.string(),
  name: z.string(),
  uom: z.string(),
  price: z.number(),
  active: z.boolean().optional(),
});

export type Product = z.infer<typeof productSchema>;
