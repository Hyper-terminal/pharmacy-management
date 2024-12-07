import dbService from '../database';
import { BatchProps } from '../types';

const knex = dbService.getKnexConnection();

export const getBatches = async (
  offset: number,
  limit: number,
): Promise<BatchProps[]> => {
  const batches = await knex
    .select('*')
    .from('batches')
    .join('medicines', 'batches.id', 'medicines.batch_id')
    .orderBy('batches.expiring_on')
    // .orderByRaw("STR_TO_DATE(expiring_on, '%d/%m/%y') ASC")
    // .orderByRaw("TO_DATE(expiring_on, 'DD/MM/YY') ASC")
    .offset(offset)
    .limit(limit);
  // console.log('this is limit batches ', batches);

  return batches;
};

export const getAllBatches = async (): Promise<BatchProps[]> => {
  const batches = await knex('batches')
    .select('*')
    .join('medicines', 'batches.id', 'medicines.batch_id');
  console.log('this is batches ', batches);
  return batches;
};

export const addBatch = async (batch_data) => {
  try {
    const insert = dbService.getConnection().prepare(`INSERT INTO
        batches (quantity,expiry_date,received_date,batch_code,f_qty,half_qty,purchase_rate,sale_rate
        ,local_cent,scm1,scm2,psr_number,psr_date,tcs_percentage,tcs_amount,po_number,po_date,
        supplier,bill_number,mrp,manufacturer,discount,
        excise,additional_vat,scm_percentage,amount,cgst,sgst,barcode,igst,received_batch_id,pack)
        VALUES (?, ?, ?,?, ?, ?,?, ?,?, ?, ?,?, ?, ?,?, ?,?, ?, ?,?, ?, ?,
        ?, ?,?, ?, ?,?, ?, ?,?, ?)`);

    const updateMedicines = dbService.getConnection()
      .prepare(`insert into medicines 
        batches (name,hsn_code,total_qty,batch_id)
        VALUES (?, ?, ?,?)`);

    const {
      name,
      hsn_code,
      quantity,
      expiry_date,
      received_date,
      batch_code,
      f_qty,
      half_qty,
      purchase_rate,
      sale_rate,
      local_cent,
      scm1,
      scm2,
      psr_number,
      psr_date,
      tcs_percentage,
      tcs_amount,
      po_number,
      po_date,
      supplier,
      bill_number,
      mrp,
      manufacturer,
      discount,
      excise,
      additional_vat,
      scm_percentage,
      amount,
      cgst,
      sgst,
      barcode,
      igst,
      received_batch_id,
      pack,
    } = batch_data;

    insert.run(
      quantity,
      expiry_date,
      received_date,
      batch_code,
      f_qty,
      half_qty,
      purchase_rate,
      sale_rate,
      local_cent,
      scm1,
      scm2,
      psr_number,
      psr_date,
      tcs_percentage,
      tcs_amount,
      po_number,
      po_date,
      supplier,
      bill_number,
      mrp,
      manufacturer,
      discount,
      excise,
      additional_vat,
      scm_percentage,
      amount,
      cgst,
      sgst,
      barcode,
      igst,
      received_batch_id,
      pack,
    );
    updateMedicines.run(name, hsn_code, quantity, batch_id);

    // _event.reply('user-added', { id: result.lastInsertRowid });

    // console.log(results);
    return { success: true };
  } catch (error) {
    console.log('error in adding bill to the billing table  ', error);
    return false;
  }
};
