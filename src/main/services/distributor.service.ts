import { ipcMain } from 'electron';
import { getDistributors } from '../controllers/distributor.controller';

ipcMain.handle('get-distributors', async () => {
  const distributors = await getDistributors();
  return distributors || [];
});
