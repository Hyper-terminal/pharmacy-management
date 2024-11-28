export interface MedicineDropDownData {
  mrps: string;
  batch_ids: string;
  expiry_dates: string;
  id: number;
  manufacturers: string;
  name: string;
  total_qty: string;
}


export interface TransformedMedicineDropDownData {
  id: number;
  name: string;
  total_qty: string;
  batchData: {
    mrp: string;
    batch_id: string;
    expiry_date: string;
    manufacturer: string;
  }[];
  nearestExpiryBatch: {
    mrp: string;
    batch_id: string;
    expiry_date: string;
    manufacturer: string;
  };
}
