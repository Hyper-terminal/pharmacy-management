import { z } from 'zod';

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const productSchema = z.object({
  id: z.number(),
  name: z.string().nonempty(),
  hsn_code: z.string().optional(),
  total_qty: z.number().multipleOf(0.01),
  batch_id: z.number().optional(),
});

export type Product = z.infer<typeof productSchema>;
