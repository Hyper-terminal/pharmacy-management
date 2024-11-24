export interface MedicineDropDownData {
  amounts: string;
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
    amount: string;
    batch_id: string;
    expiry_date: string;
    manufacturer: string;
  }[];
  nearestExpiryBatch: {
    amount: string;
    batch_id: string;
    expiry_date: string;
    manufacturer: string;
  };
}
