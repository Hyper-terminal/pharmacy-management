import { ipcMain } from 'electron';
import dbService from '../database';
import { BatchProps, MedicineProps } from '../types';
import { Knex } from 'knex';

interface ICsvData {
  medicineProps: MedicineProps;
  batchProps: BatchProps;
}

// Handle importing CSV file
ipcMain.handle('import-csv', async (_event, file: ICsvData[]) => {
  const knex = dbService.getKnexConnection();

  try {
    // Start a transaction to ensure data consistency
    await knex.transaction(async (trx: Knex.Transaction) => {
      // First insert all batches and get their IDs
      const { batchIdArray } = await insertCsvBatch(file, trx);

      // Then insert medicines with corresponding batch IDs
      await insertCsvMedicine(file, batchIdArray, trx);
    });

    return { success: true };
  } catch (error) {
    console.error('Error in CSV import:', error);
    return { success: false, error: error };
  }
});

async function insertCsvMedicine(
  data: ICsvData[],
  batchIdArray: number[],
  trx: any,
): Promise<void> {
  const medicineData = data.map((item, index) => ({
    name: item.medicineProps.name,
    hsn_code: item.medicineProps.hsn_code,
    total_qty: item.medicineProps.total_qty,
    batch_id: batchIdArray[index], // Link to the corresponding batch
  }));

  trx('medicines').insert(medicineData);
}

async function insertCsvBatch(
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
    quantity: item.batchProps.quantity,
    expiry_date: item.batchProps.expiry_date,
    received_date: item.batchProps.received_date,
    batch_code: newBatchCode,
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
  }));

  // Insert batches and get their IDs
  const insertedBatches = await trx('batches')
    .insert(batchData)
    .returning(['id']);

  const batchIdArray = insertedBatches.map((batch: any) => batch.id);

  return { batchIdArray };
}
