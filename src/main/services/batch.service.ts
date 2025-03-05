import { ipcMain } from 'electron';
import {
  addMultipleBatches,
  getAllBatches
} from '../controllers/batch.controller';
import { addMultipleProducts } from '../controllers/medicine.controller';
import dbService from '../database';
import { BatchProps, ManualProductProps, MedicineProps } from '../types';

ipcMain.handle('get-batches', async () => {
  return getAllBatches();
});


ipcMain.handle(
  'add-manual-product',
  async (
    _event,
    productData: ManualProductProps[],
  ): Promise<
    | { batchIds: string[]; medicineIds: string[] }
    | { success: false; error: string }
  > => {
    // Validate that product data exists
    if (!productData?.length) {
      return {
        success: false,
        error: 'No product data provided',
      };
    }

    try {
      // Create a timestamp for batch creation/update fields
      const timestamp = new Date().toISOString();

      // Extract batch properties with proper timestamps for all products
      const batchProps = productData.map((product) => ({
        ...extractBatchProps(product),
        created_at: timestamp,
        updated_at: timestamp,
      }));

      // Execute database transaction to ensure data consistency
      const result = await dbService
        .getKnexConnection()
        .transaction(async (trx: any) => {
          try {
            // Insert all batches and get their IDs
            const batchIds = await addMultipleBatches(batchProps, trx);

            // Create medicine records linked to their corresponding batches
            const medicineProps = productData.map((product, index) => ({
              ...extractMedicineProps(product),
              batch_id: batchIds[index], // Link each medicine to its batch
            }));

            // Insert all medicines in a single transaction
            const medicineIds = await addMultipleProducts(medicineProps, trx);

            // Return both sets of IDs for confirmation
            return { batchIds, medicineIds };
          } catch (error) {
            // Roll back the transaction if any error occurs
            await trx.rollback();
            throw error; // Re-throw to be caught by outer catch block
          }
        });

      return result;
    } catch (error: unknown) {
      // Log the error for debugging
      console.error('Error in add-manual-product:', error);

      // Proper error handling with type narrowing for different error types
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'Unknown error occurred';

      return {
        success: false,
        error: errorMessage,
      };
    }
  },
);

/**
 * Extracts only the properties that are defined in the BatchProps interface
 * @param obj An object containing potential batch properties
 * @returns A new object with only valid BatchProps properties
 */
function extractBatchProps<T extends Record<string, any>>(obj: T): BatchProps {
  // Define the known batch properties based on your BatchProps interface
  const batchPropKeys: (keyof BatchProps)[] = [
    'quantity',
    'expiry_date',
    'received_date',
    'batch_code',
    'f_qty',
    'half_qty',
    'purchase_rate',
    'sale_rate',
    'local_cent',
    'scm1',
    'scm2',
    'psr_number',
    'psr_date',
    'tcs_percentage',
    'tcs_amount',
    'po_number',
    'po_date',
    'created_at',
    'updated_at',
    'supplier',
    'mrp',
    'manufacturer',
    'discount',
    'excise',
    'additional_vat',
    'scm_percentage',
    'amount',
    'cgst',
    'sgst',
    'barcode',
    'igst',
    'bill_number',
    'pack',
  ];

  // Create a new object with only the properties from batchPropKeys
  return batchPropKeys.reduce<BatchProps>((result: any, key) => {
    if (key in obj) {
      result[key] = obj[key] as any;
    }
    return result;
  }, {} as BatchProps);
}

/**
 * Extracts only the properties that are defined in the MedicineProps interface
 * @param obj An object containing potential medicine properties
 * @returns A new object with only valid MedicineProps properties
 */
function extractMedicineProps<T extends Record<string, any>>(
  obj: T,
): MedicineProps {
  // Define the known medicine properties based on the MedicineProps interface
  const medicinePropKeys: (keyof MedicineProps)[] = [
    'name',
    'hsn_code',
    'total_qty',
    'batch_id',
  ];

  // Create a new object with only the properties from medicinePropKeys
  return medicinePropKeys.reduce<MedicineProps>((result: any, key) => {
    if (key in obj) {
      result[key] = obj[key] as any;
    }
    return result;
  }, {} as MedicineProps);
}
