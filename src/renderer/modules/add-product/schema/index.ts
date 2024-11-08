import { z } from "zod"

export const singleProductSchema = z.object({
  SUPPLIER: z.string(),
  'BILL NO.': z.string(),
  DATE: z.string(),
  COMPANY: z.string(),
  CODE: z.number(),
  BARCODE: z.string(),
  'ITEM NAME': z.string(),
  PACK: z.string(),
  BATCH: z.string(),
  EXPIRY: z.string(),
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
  ALTERCODE: z.string(),
})
