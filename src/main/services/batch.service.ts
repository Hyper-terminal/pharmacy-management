import { ipcMain } from 'electron';
import { getBatches } from '../controllers/batch.controller';

ipcMain.handle('get-batches', async (event, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;
  return getBatches(offset, limit);
});
