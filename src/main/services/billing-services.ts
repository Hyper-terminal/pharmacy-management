import { ipcMain } from 'electron';
import dbService from '../database';

ipcMain.handle('search-medicines', async (_event, searchString) => {
  try {
    // Access the low-level better-sqlite3 connection

    const stmt = //   .prepare('SELECT * FROM medicines WHERE name LIKE ?');
      dbService.getConnection()
        .prepare(`SELECT medicines.*, batches.manufacturer,batches.amount
  FROM medicines
  INNER JOIN batches ON medicines.batch_id = batches.id
  WHERE medicines.name LIKE ?
`);

    // Execute the query with the search term, using wildcards for partial matching
    const results = stmt.all(`%${searchString}%`);

    // Return the results
    console.log(results);
    return results;
  } catch (error) {
    console.log('error in getting mediines search ', error);
    return false;
  }
});
