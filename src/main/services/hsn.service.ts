import { ipcMain } from 'electron';
import { getGstData } from '../controllers/hsn.controller';

ipcMain.handle('get-gst-data', async (event, stringToSearch) => {
  return await getGstData(stringToSearch);
});
