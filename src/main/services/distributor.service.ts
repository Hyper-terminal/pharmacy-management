import { ipcMain } from 'electron';
import {
  addDistributor,
  getDistributors,
  searchDistributors,
} from '../controllers/distributor.controller';

ipcMain.handle('get-distributors', async () => {
  const distributors = await getDistributors();
  return distributors || [];
});

ipcMain.handle('add-distributor', async (event, distributor) => {
  const result = await addDistributor(distributor);
  return result;
});

ipcMain.handle('search-distributors', async (event, searchString) => {
  const distributors = await searchDistributors(searchString);
  return distributors || [];
});
