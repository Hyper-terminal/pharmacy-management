import { z } from 'zod';

export const Billingschema = z.object({
  NAME: z.string(),
  'MEDICINE ID': z.number(),
  'BATCH ID': z.number(),
  DATE: z.string(),
  DISCOUNT: z.number(),
  TAX: z.number(),
  QTY: z.number(),
  PRICE: z.number(),
  'FINAL PRICE': z.number(),
  'CUSTOMER NAME': z.string(),
  'CUSTOMER PHONE': z.string(),
  HSN: z.number(),
});
