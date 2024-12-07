import { ipcMain } from 'electron';
import { addBatch, getAllBatches } from '../controllers/batch.controller';

ipcMain.handle('get-batches', async (event, { page = 1, limit = 10 }) => {
  // const offset = (page - 1) * limit;
  // return getBatches(offset, limit);
  return getAllBatches();
});

ipcMain.handle('add-product-inBatch', async (_event, batch_data) => {
  return addBatch(batch_data);
});
