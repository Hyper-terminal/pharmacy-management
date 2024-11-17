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
