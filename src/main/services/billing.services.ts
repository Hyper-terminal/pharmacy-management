import { ipcMain } from 'electron';
import { getBills, getRecentBills } from '../controllers/bill.controller';
import dbService from '../database';

ipcMain.handle('search-medicines', async (_event, searchString) => {
  try {
    // Access the low-level better-sqlite3 connection

    const stmt = dbService.getConnection().prepare(`
                  SELECT medicines.id,
                  medicines.name,
                  GROUP_CONCAT(medicines.total_qty) as total_qty,
                  GROUP_CONCAT(batches.id) AS batch_ids,
                  GROUP_CONCAT(batches.manufacturer) AS manufacturers,
                  GROUP_CONCAT(batches.mrp) AS mrps,
                  GROUP_CONCAT(batches.expiry_date) AS expiry_dates
                  FROM medicines
                  INNER JOIN batches ON medicines.batch_id = batches.id
                  WHERE medicines.name LIKE ?
                    AND medicines.total_qty > 0
                  GROUP BY medicines.name
                  ORDER BY batches.expiry_date ASC;

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
    const insert = dbService.getConnection().prepare(`INSERT INTO
      billing (name, medicines_id, batch_id,discount,tax,quantity_sold,price,final_price, customer_name, doctor_name, customer_phone, doctor_phone)
      VALUES (?, ?, ?,?, ?, ?,?, ?, ?, ?, ?, ?)`);
    // SET total_qty = CASE
    //                     WHEN total_qty - ? < 0 THEN 0
    //                     ELSE total_qty - ?
    //                  END

    const updateProdqty = dbService.getConnection().prepare(`
        UPDATE medicines
        set total_qty=total_qty-?
WHERE batch_id = ?;`);

    const { customer_name, doctor_name, customer_phone, doctor_phone } =
      billData.customer;

    billData.items.forEach((medi: any) => {
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

      // check if the quantity is less than the total quantity
      const exisitingMedicine: any = dbService
        .getConnection()
        .prepare(`SELECT total_qty FROM medicines WHERE id = ?`)
        .get(medicine_id);

      if (Number(exisitingMedicine?.total_qty || 0) < Number(Qty)) {
        return {
          success: false,
          message: 'Quantity is less than the total quantity',
        };
      }

      insert.run(
        Name,
        medicine_id,
        batch_id,
        Discount,
        Tax,
        Qty,
        Price,
        final_price,
        customer_name,
        doctor_name,
        customer_phone,
        doctor_phone,
      );
      updateProdqty.run(Qty, batch_id);
    });

    const recentBills = await getRecentBills();
    _event.sender.send('emit-recent-bills', recentBills);

    // dbService.close();
    return { success: true };
  } catch (error) {
    console.log('error in adding bill to the billing table  ', error);
    return false;
  }
});

ipcMain.handle('get-bills', async () => {
  return getBills();
});

ipcMain.handle('get-recent-bills', async () => {
  return getRecentBills();
});
