import { z } from 'zod';

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const distributorSchema = z.object({
  id: z.number(),
  name: z.string().nonempty(),
  phone: z.string().nonempty(),
  address: z.string().nonempty(),
  email: z.string().nonempty(),
});

export type Distributor = z.infer<typeof distributorSchema>;
