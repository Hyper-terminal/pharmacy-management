import { z } from 'zod';
import { BatchProps } from '@/src/main/types';

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const batchSchema = z.object({
  id: z.number().optional(),
  quantity: z.number(),
  expiry_date: z.string(),
  received_date: z.string(),
  batch_code: z.string(),
  f_qty: z.number().optional(),
  half_qty: z.number().optional(),
  purchase_rate: z.number().optional(),
  sale_rate: z.number().optional(),
  local_cent: z.number().optional(),
  scm1: z.number().optional(),
  scm2: z.number().optional(),
  psr_number: z.string().optional(),
  psr_date: z.string().optional(),
  tcs_percentage: z.number().optional(),
  tcs_amount: z.number().optional(),
  po_number: z.string().optional(),
  po_date: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  supplier: z.string().optional(),
  mrp: z.number().optional(),
  manufacturer: z.string().optional(),
  discount: z.number().optional(),
  excise: z.number().optional(),
  additional_vat: z.number().optional(),
  scm_percentage: z.number().optional(),
  amount: z.number().optional(),
  cgst: z.number().optional(),
  sgst: z.number().optional(),
  barcode: z.string().optional(),
  igst: z.number().optional()
}) satisfies z.ZodType<BatchProps>;

export type Batch = z.infer<typeof batchSchema>;
