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

    return results;
  } catch (error) {
    console.log('error in getting mediines search ', error);
    return false;
  }
});

ipcMain.handle('add-bill', async (_event, billData) => {
  try {
    // Access the low-level better-sqlite3 connection
    billData = [
      {
        Name: 'my medicine',
        'Medicine ID': 1,
        'Batch ID': 1,
        Discount: 12,
        Tax: 1,
        Qty: 3,
        Price: 100,
        'Final Price': 87,
      },
    ];
    const insert = dbService.getConnection().prepare(`INSERT INTO
      billing (name, medicines_id, batch_id,discount,tax,quantity_sold,price,final_price)
      VALUES (?, ?, ?,?, ?, ?,?, ?)`);

    billData.forEach((medi: any) => {
      const {
        Name,
        'Medicine ID': medicine_id,
        'Batch ID': batch_id,
        Discount,
        Tax,
        Qty,
        Price,
        'Final Price': final_price,
      } = medi;

      const results = insert.run(
        Name,
        medicine_id,
        batch_id,
        Discount,
        Tax,
        Qty,
        Price,
        final_price,
      );
      console.log(results);
    });

    // _event.reply('user-added', { id: result.lastInsertRowid });

    // console.log(results);
    return true;
  } catch (error) {
    console.log('error in adding bill to the billing table  ', error);
    return false;
  }
});
