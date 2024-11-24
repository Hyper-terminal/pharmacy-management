import { MedicineDropDownData, TransformedMedicineDropDownData } from '../types';

export const mapCsvToInterfaces = (csvData: any) => {
  return {
    medicineProps: {
      name: csvData['ITEM NAME'],
      hsn_code: csvData['HSNCODE'],
      total_qty: csvData['QTY'],
      batch_id: csvData['BATCH'],
    },
    batchProps: {
      quantity: csvData['QTY'],
      expiry_date: csvData['EXPIRY'],
      batch_code: csvData['BATCH'],
      f_qty: csvData['F.QTY'],
      half_qty: csvData['HALFP'],
      purchase_rate: csvData['FTRATE'],
      sale_rate: csvData['SRATE'],
      local_cent: csvData['LOCALCENT'],
      scm1: csvData['SCM1'],
      scm2: csvData['SCM2'],
      psr_number: csvData['PSRLNO'],
      supplier: csvData['SUPPLIER'],
      mrp: csvData['MRP'],
      manufacturer: csvData['COMPANY'],
      discount: csvData['DIS'],
      excise: csvData['EXCISE'],
      additional_vat: csvData['ADNLVAT'],
      scm_percentage: csvData['SCMPER'],
      amount: csvData['AMOUNT'],
      cgst: csvData['CGST'],
      sgst: csvData['SGST'],
      barcode: csvData['BARCODE'],
      igst: csvData['IGST'],
      received_date: csvData['DATE'],
      bill_number: csvData['BILL NO.'],
      pack: csvData['PACK'],
    },
  };
};

export const transformMedicineDropDownData = (
  data: MedicineDropDownData[],
): TransformedMedicineDropDownData[] => {
  return data.map((item: MedicineDropDownData) => {
    const {
      amounts,
      batch_ids,
      expiry_dates,
      id,
      manufacturers,
      name,
      total_qty,
    } = item;

    const batchIdsArray = batch_ids.split(',');
    const expiryDatesArray = expiry_dates.split(',');
    const manufacturersArray = manufacturers.split(',');
    const amountsArray = amounts.split(',');

    const batchData = expiryDatesArray.map(
      (_, index: number) => {
        return {
          amount: amountsArray[index],
          batch_id: batchIdsArray[index],
          expiry_date: expiryDatesArray[index],
          manufacturer: manufacturersArray[index],
        };
      },
    );

    const nearestExpiryBatch = batchData.sort(
      (a, b) => {
        return Number(new Date(a.expiry_date)) - Number(new Date(b.expiry_date));
      },
    )[0];

    return {
      id,
      name,
      total_qty,
      batchData,
      nearestExpiryBatch,
    };
  });
};

export const getPerPriceMedicine = (
  total_qty: string,
  total_amount: string,
): number => {
  return Number((Number(total_amount) / Number(total_qty)).toFixed(2));
};
