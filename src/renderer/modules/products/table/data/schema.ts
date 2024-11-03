import { z } from 'zod';

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const productSchema = z.object({
  SUPPLIER: z.string(),
  'BILL NO.': z.string(),
  DATE: z.string(), // Could be z.date() if we want to parse it
  COMPANY: z.string(),
  CODE: z.number(),
  BARCODE: z.string(),
  'ITEM NAME': z.string(),
  PACK: z.string(),
  BATCH: z.string(),
  EXPIRY: z.string(), // Could be z.date() if we want to parse it
  QTY: z.number(),
  'F.QTY': z.number(),
  HALFP: z.number(),
  FTRATE: z.number(),
  SRATE: z.number(),
  MRP: z.number(),
  DIS: z.number(),
  VAT: z.number(),
  ADNLVAT: z.number(),
  AMOUNT: z.number(),
  LOCALCENT: z.string(),
  SCM1: z.number(),
  SCM2: z.number(), 
  SCMPER: z.number(),
  HSNCODE: z.string(),
  CGST: z.number(),
  SGST: z.number(),
  IGST: z.number(),
  PSRLNO: z.number(),
  TCSPER: z.number(),
  TCSAMT: z.number(),
  ALTERCODE: z.string()
});

export type Product = z.infer<typeof productSchema>;
