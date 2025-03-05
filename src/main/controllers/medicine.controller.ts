/**
 * Medicine Controller
 *
 * This module provides database operations for medicine-related functionality.
 * It handles product retrieval and creation operations using Knex query builder.
 */
import dbService from '../database';
import { MedicineProps } from '../types';

/**
 * Retrieves a paginated list of products from the database
 *
 * @param offset - Number of records to skip for pagination
 * @param limit - Maximum number of records to return
 * @returns Promise resolving to an array of medicine products
 * @throws Will throw an error if the database operation fails
 */
export const getProducts = async (
  offset: number,
  limit: number,
): Promise<MedicineProps[]> => {
  const knex = dbService.getKnexConnection();

  try {
    // Fetch medicines with pagination
    return await knex('medicines')
      .select('*')
      .offset(offset)
      .limit(limit);
  } catch (error: any) {
    console.error('Error fetching paginated products:', error);
    throw new Error(`Failed to retrieve products: ${error.message}`);
  }
};

/**
 * Retrieves all products from the database with aggregated quantities
 *
 * This function groups medicines by name and calculates the total quantity
 * available across all batches for each medicine.
 *
 * @returns Promise resolving to an array of aggregated medicine data
 * @throws Will throw an error if the database operation fails
 */
export const getAllProducts = async (): Promise<MedicineProps[]> => {
  const knex = dbService.getKnexConnection();

  try {
    // Group medicines by name and sum their quantities
    return await knex('medicines')
      .select('name', knex.raw('SUM(total_qty) as total_qty'), 'hsn_code')
      .groupBy('name');
  } catch (error: any) {
    console.error('Error fetching all products:', error);
    throw new Error(`Failed to retrieve all products: ${error.message}`);
  }
};

/**
 * Inserts multiple medicine products into the database in a single transaction
 *
 * @param products - Array of medicine objects to be inserted
 * @returns Promise resolving to the result of the insert operation
 * @throws Will throw an error if the database operation fails
 */
export const addMultipleProducts = async (products: MedicineProps[], trx: any) => {
  const knex = dbService.getKnexConnection();

  try {
    // Perform bulk insert of multiple products
    return await knex('medicines').insert(products).transacting(trx);
  } catch (error: any) {
    console.error('Error adding multiple products:', error);
    throw new Error(`Failed to add products: ${error.message}`);
  }
};
