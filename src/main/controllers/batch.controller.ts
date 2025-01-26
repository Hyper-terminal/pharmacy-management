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

export const addBatch = async (batch_data: any) => {
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
    updateMedicines.run(name, hsn_code, quantity, received_batch_id);

    // _event.reply('user-added', { id: result.lastInsertRowid });

    // console.log(results);
    return { success: true };
  } catch (error) {
    console.log('error in adding bill to the billing table  ', error);
    return false;
  }
};

export const addSingleProduct = async (product_data: any) => {
  try {
    const knex = dbService.getKnexConnection();

    // Map the form data to match database structure
    const {
      medicine_name: name,
      hsn_code,
      quantity,
      expiry_date,
      received_date,
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
      mrp,
      manufacturer,
      discount,
      excise,
      additional_vat,
      scm_percentage,
      cgst,
      sgst,
      barcode,
      igst,
      pack,
      quantity_per_pack,
    } = product_data;

    // Get the last batch code and increment it
    // Format of batch_code is B001, B002, B003, etc.
    const lastBatchCode = await knex('batches')
      .max('batch_code as batch_code')
      .first();

    let newBatchCode = 'B001';
    if (lastBatchCode?.batch_code) {
      const lastNumber = parseInt(lastBatchCode.batch_code.substring(1));
      newBatchCode = `B${String(lastNumber + 1).padStart(3, '0')}`;
    }

    // Generate a unique batch ID if not provided
    const received_batch_id = Math.floor(Math.random() * 1000000).toString();

    const newAmount = Number(mrp) * Number(quantity);

    // First insert the batch
    const [batchId] = await knex('batches').insert({
      quantity,
      expiry_date,
      expiring_on: addProperdate(expiry_date),
      received_date,
      received_batch_id,
      f_qty: f_qty || 0,
      half_qty: half_qty || 0,
      purchase_rate,
      sale_rate,
      local_cent: local_cent || 0,
      scm1: scm1 || 0,
      scm2: scm2 || 0,
      psr_number: psr_number || '',
      psr_date: psr_date || '',
      tcs_percentage: tcs_percentage || 0,
      tcs_amount: tcs_amount || 0,
      po_number: po_number || '',
      po_date: po_date || '',
      supplier,
      mrp,
      manufacturer,
      discount: discount || 0,
      excise: excise || 0,
      additional_vat: additional_vat || 0,
      scm_percentage: scm_percentage || 0,
      amount: newAmount,
      cgst: cgst || 0,
      sgst: sgst || 0,
      barcode: barcode || '',
      igst: igst || 0,
      pack: `${quantity_per_pack}${pack}`,
      batch_code: newBatchCode,
    });

    // Calculate total quantity based on pack type and quantity per pack
    const total_qty = convert2qty(quantity, `${quantity_per_pack}${pack}`);

    // Then insert the medicine with the batch ID
    await knex('medicines').insert({
      name,
      hsn_code,
      total_qty,
      batch_id: batchId,
    });

    return { success: true, batchId };
  } catch (error: any) {
    console.error('Error adding single product:', error);
    return { success: false, error: error.message };
  }
};

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

function addProperdate(incoming_date: string) {
  incoming_date = '01/' + incoming_date;
  const date_list = incoming_date.split('/');
  date_list[2] = '20' + date_list[2];
  return date_list.reverse().join('-');
}
