import { MedicineProps } from '../types';
import { BatchProps } from '../types';

interface ICsvData {
  medicineProps: MedicineProps;
  batchProps: BatchProps;
}
function convert2qty(qty: number, pack: string | undefined) {
  // console.log(pack, typeof pack);
  const units = ['ml', 'gm'];

  if (units.some((unit) => pack?.toLowerCase().includes(unit))) {
    return qty;
  }

  // if (pack?.toLowerCase().includes('ml')) return qty;
  const number = pack?.match(/\d+/);
  if (number) return Number(number[0]) * qty;
  return 10 * qty;
}
export async function insertCsvMedicine(
  data: ICsvData[],
  batchIdArray: number[],
  trx: any,
): Promise<void> {
  // console.log('Inside insertCsvMedicine', { data, batchIdArray });
  const medicineData = data.map((item, index) => ({
    name: item.medicineProps.name,
    hsn_code: item.medicineProps.hsn_code,
    total_qty: convert2qty(
      item.batchProps.quantity + (item.batchProps.f_qty || 0),
      item.batchProps.pack,
    ),
    batch_id: batchIdArray[index], // Link to the corresponding batch
  }));

  await trx('medicines').insert(medicineData);
}

export async function insertCsvBatch(
  data: ICsvData[],
  trx: any,
): Promise<{ batchIdArray: number[] }> {
  // Get the last batch code and increment it
  // Format of batch_code is B001, B002, B003, etc.
  const lastBatchCode = await trx('batches')
    .max('batch_code as batch_code')
    .first();

  let newBatchCode = 'B001';
  if (lastBatchCode?.batch_code) {
    const lastNumber = parseInt(lastBatchCode.batch_code.substring(1));
    newBatchCode = `B${String(lastNumber + 1).padStart(3, '0')}`;
  }

  const batchData = data.map((item) => ({
    quantity: convert2qty(
      item.batchProps.quantity + (item.batchProps.f_qty || 0),
      item.batchProps.pack,
    ),
    expiry_date: item.batchProps.expiry_date,
    received_date: item.batchProps.received_date,
    batch_code: newBatchCode,
    received_batch_id: item.batchProps.batch_code,
    f_qty: item.batchProps.f_qty,
    half_qty: item.batchProps.half_qty,
    purchase_rate: item.batchProps.purchase_rate,
    sale_rate: item.batchProps.sale_rate,
    local_cent: item.batchProps.local_cent,
    scm1: item.batchProps.scm1,
    scm2: item.batchProps.scm2,
    psr_number: item.batchProps.psr_number,
    psr_date: item.batchProps.psr_date,
    tcs_percentage: item.batchProps.tcs_percentage,
    tcs_amount: item.batchProps.tcs_amount,
    po_number: item.batchProps.po_number,
    po_date: item.batchProps.po_date,
    supplier: item.batchProps.supplier,
    mrp: item.batchProps.mrp,
    manufacturer: item.batchProps.manufacturer,
    discount: item.batchProps.discount,
    excise: item.batchProps.excise,
    additional_vat: item.batchProps.additional_vat,
    scm_percentage: item.batchProps.scm_percentage,
    amount: item.batchProps.amount,
    cgst: item.batchProps.cgst,
    sgst: item.batchProps.sgst,
    barcode: item.batchProps.barcode,
    igst: item.batchProps.igst,
    bill_number: item.batchProps.bill_number,
    pack: item.batchProps.pack,
  }));

  // Insert batches and get their IDs
  const insertedBatches = await trx('batches')
    .insert(batchData)
    .returning(['id']);

  const batchIdArray = insertedBatches.map((batch: any) => batch.id);

  return { batchIdArray };
}
