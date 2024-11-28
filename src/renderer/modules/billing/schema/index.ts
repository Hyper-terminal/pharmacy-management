import { z } from 'zod';

export const Billingschema = z.object({
  NAME: z.object({
    id: z.number(),
    name: z.string(),
    total_qty: z.union([z.string(), z.number()]),
    batchData: z.array(z.object({
      mrp: z.string(),
      batch_id: z.string(),
      expiry_date: z.string(),
      manufacturer: z.string()
    })),
    nearestExpiryBatch: z.object({
      mrp: z.string(),
      batch_id: z.string(),
      expiry_date: z.string(),
      manufacturer: z.string()
    })
  }),
  'MEDICINE ID': z.union([z.string(), z.number()]),
  'BATCH ID': z.union([z.string(), z.number()]),
  DATE: z.string(),
  DISCOUNT: z.union([z.string(), z.number()]),
  TAX: z.union([z.string(), z.number()]),
  QTY: z.union([z.string(), z.number()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 1;
  }, "Quantity must be at least 1"),
  PRICE: z.union([z.string(), z.number()]),
  'FINAL PRICE': z.union([z.string(), z.number()]),
  'CUSTOMER NAME': z.string(),
  'CUSTOMER PHONE': z.string(),
  HSN: z.union([z.string(), z.number()]),
});

export const customerDetailsSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  customer_phone: z.string().min(1, "Customer phone is required"),
  doctor_name: z.string().min(1, "Doctor name is required"),
  doctor_phone: z.string().min(1, "Doctor phone is required")
});

export const mapBillingFormFields = (data: any) => {
  return {
    Name: data.NAME?.name || '',
    'Medicine ID': data.NAME?.id || 0,
    'Batch ID': data.NAME?.batch_id || '',
    Discount: data['DISCOUNT'] || 0,
    Tax: data['TAX'] || 0,
    Qty: data['QTY'] || 0,
    Price: data['PRICE'] || 0,
    'Final Price': data['FINAL PRICE'] || 0
  };
};
