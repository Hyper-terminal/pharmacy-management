import { ipcMain } from 'electron';
import { Knex } from 'knex';
import {
  insertCsvBatch,
  insertCsvMedicine,
} from '../controllers/csv.controller';
import dbService from '../database';
import { BatchProps, MedicineProps } from '../types';
import { getProducts } from '../controllers/medicine.controller';

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

    // Send a message to the renderer process to refresh the products list
    const products = await getProducts();
    ipcMain.emit('get-products', products);

    return { success: true };
  } catch (error) {
    console.error('Error in CSV import:', error);
    return { success: false, error: error };
  }
});

ipcMain.handle('get-products', async () => {
  const products = await getProducts();
  return products;
});
