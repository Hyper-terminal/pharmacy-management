import { z } from 'zod';
// Add the pack enum
export const PackType = {
  TABLET: 'TAB', // Display value: Tablet
  CAPSULE: 'CAP', // Display value: Capsule
  SYRUP: 'ML', // Display value: Syrup
  // INJECTION: 'Injection',
  // CREAM: 'Cream',
  // OINTMENT: 'Ointment',
  // DROPS: 'Drops',
  // POWDER: 'Powder',
} as const;

export const PackTypeDisplay = {
  TAB: 'Tablet',
  CAP: 'Capsule',
  ML: 'Syrup',
} as const;

export const singleProductSchema = z.object({
  supplier: z.string().min(1, 'Supplier is required'),
  bill_number: z.string().min(1, 'Bill number is required'),
  received_date: z
    .string()
    .regex(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
      message: 'Received date must be in DD/MM/YYYY format',
    }),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  medicine_name: z.string().min(1, 'Medicine name is required'),
  barcode: z.string().optional(),
  pack: z.enum(Object.values(PackType) as [string, ...string[]]),
  batch_code: z.string().optional(),
  expiry_date: z
    .string()
    .regex(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
      message: 'Expiry date must be in DD/MM/YYYY format',
    }),
  quantity: z.number().min(0, 'Quantity must be positive'),
  f_qty: z.number().min(0),
  half_qty: z.number().min(0),
  purchase_rate: z.number().min(0),
  sale_rate: z.number().min(0),
  mrp: z.number().min(0),
  discount: z.number().min(0),
  cgst: z.number().min(0),
  sgst: z.number().min(0),
  igst: z.number().min(0),
  additional_vat: z.number().min(0),
  amount: z.number().min(0),
  local_cent: z.number().min(0),
  scm1: z.number().min(0),
  scm2: z.number().min(0),
  scm_percentage: z.number().min(0),
  tcs_percentage: z.number().min(0),
  tcs_amount: z.number().min(0),
  po_number: z.string().optional(),
  po_date: z
    .string()
    .regex(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
      message: 'PO date must be in DD/MM/YYYY format',
    })
    .optional(),
  hsn_code: z.string().min(1, 'HSN code is required'),
  quantity_per_pack: z.number().min(1, 'Quantity per pack must be positive'),
});
