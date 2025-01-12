import { z } from 'zod';

export const Billingschema = z.object({
  NAME: z.object({
    id: z.number(),
    name: z.string(),
    total_qty: z.array(z.union([z.string(), z.number()])),
    batchData: z.array(
      z.object({
        mrp: z.string(),
        batch_id: z.string(),
        expiry_date: z.string(),
        manufacturer: z.string(),
      }),
    ),
    nearestExpiryBatch: z.object({
      mrp: z.string(),
      batch_id: z.string(),
      expiry_date: z.string(),
      manufacturer: z.string(),
    }),
  }),
  'MEDICINE ID': z.union([z.string(), z.number()]),
  'BATCH ID': z.union([z.string(), z.number()]),
  DATE: z.string(),
  DISCOUNT: z.union([z.string(), z.number()]),
  TAX: z.union([z.string(), z.number()]),
  QTY: z.union([z.string(), z.number()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 1;
  }, 'Quantity must be at least 1'),
  PRICE: z.union([z.string(), z.number()]),
  'FINAL PRICE': z.union([z.string(), z.number()]),
  'CUSTOMER NAME': z.string(),
  'CUSTOMER PHONE': z.string(),
  HSN: z.union([z.string(), z.number()]),
});

export const customerDetailsSchema = z.object({
  customer_name: z
    .string()
    .min(1, 'Customer name is required')
    .max(50, 'Customer name must be 50 characters or less'),
  customer_phone: z
    .string()
    .min(8, 'Customer phone must be at least 8 characters')
    .max(20, 'Customer phone must be 20 characters or less')
    .regex(/^[0-9\s\+\(\)-]+$/, 'Invalid phone number'),
  doctor_name: z
    .string()
    .min(1, 'Doctor name is required')
    .max(50, 'Doctor name must be 50 characters or less'),
  doctor_phone: z
    .string()
    .min(8, 'Doctor phone must be at least 8 characters')
    .max(20, 'Doctor phone must be 20 characters or less')
    .regex(/^[0-9\s\+\(\)-]+$/, 'Invalid phone number'),
  doctor_registration: z
    .string()
    .min(1, 'Doctor registration is required')
    .max(20, 'Doctor registration must be 20 characters or less'),
});
/**
 * Maps billing form fields to their corresponding values from the schema.
 *
 * @param data - The object containing the values from the billing form.
 * @returns An object containing the mapped values.
 */
export const mapBillingFormFields = (data: any) => {
  return {
    Name: data.NAME?.name || '',
    'Medicine ID': data.NAME?.id || 0,
    'Batch ID': data['BATCH ID'] || '',
    Discount: data['DISCOUNT'] || 0,
    Tax: data['TAX'] || 0,
    Qty: data['QTY'] || 0,
    Price: data['PRICE'] || 0,
    'Final Price': data['FINAL PRICE'] || 0,
  };
};
