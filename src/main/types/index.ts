export interface MedicineProps {
  name: string;
  hsn_code?: string;
  total_qty: number;
  batch_id?: number;
}

export interface BatchProps {
  quantity: number;
  expiry_date: string;
  received_date: string;
  batch_code: string;
  f_qty?: number;
  half_qty?: number;
  purchase_rate?: number;
  sale_rate?: number;
  local_cent?: number;
  scm1?: number;
  scm2?: number;
  psr_number?: string;
  psr_date?: string;
  tcs_percentage?: number;
  tcs_amount?: number;
  po_number?: string;
  po_date?: string;
  created_at?: string;
  updated_at?: string;
  supplier?: string;
  mrp?: number;
  manufacturer?: string;
  discount?: number;
  excise?: number;
  additional_vat?: number;
  scm_percentage?: number;
  amount?: number;
  cgst?: number;
  sgst?: number;
  barcode?: string;
  igst?: number;
  bill_number?: string;
  pack?: string;
}

export interface DistributorProps {
  name: string;
  phone: string;
  address: string;
  email: string;
}

export interface ManualProductProps extends MedicineProps, BatchProps {
  // This interface combines all properties from MedicineProps and BatchProps
}
