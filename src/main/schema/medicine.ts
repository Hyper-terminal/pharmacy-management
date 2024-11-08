import dbService from '../database'; // Import the DatabaseService instance

/**
 * Create the medicines table schema using the DatabaseService.
 */
export const createMedicinesTable = async (): Promise<void> => {
  const knex = dbService.getKnexConnection(); // Use the Knex connection from DatabaseService

  const exists = await knex.schema.hasTable('medicines');

  if (!exists) {
    await knex.schema.createTableIfNotExists('medicines', (table:any) => {
      table.increments('id').primary(); // Primary key for each medicine
      table.string('name').notNullable(); // Name of the medicine
      table.string('manufacturer'); // Manufacturer name
      table.string('barcode').unique(); // Unique barcode for the medicine
      table.string('hsn_code'); // HSN Code for GST
      table.decimal('mrp', 10, 2); // MRP of the medicine
      table.decimal('amount', 10, 2); // Total amount for this medicine
      table.decimal('cgst', 10, 2); // CGST rate
      table.decimal('sgst', 10, 2); // SGST rate
      table.decimal('igst', 10, 2); // IGST rate
      table.decimal('discount', 10, 2); // Discount rate
      table.decimal('excise', 10, 2); // Excise duty
      table.decimal('additional_vat', 10, 2); // Additional VAT (if applicable)
      table.decimal('scm_percentage', 10, 2); // SCM percentage
      table.string('supplier'); // Supplier name
    });

    console.info('Medicines table created successfully');
  }
};
