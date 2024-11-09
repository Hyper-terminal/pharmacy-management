import dbService from '../database'; // Import the DatabaseService instance

/**
 * Create the medicines table schema using the DatabaseService.
 */
export const createMedicinesTable = async (): Promise<void> => {
  const knex = dbService.getKnexConnection(); // Use the Knex connection from DatabaseService

  const exists = await knex.schema.hasTable('medicines');

  if (!exists) {
    await knex.schema.createTableIfNotExists('medicines', (table: any) => {
      table.increments('id').primary(); // Primary key for each medicine
      table.string('name').notNullable(); // Name of the medicine
      table.string('hsn_code'); // HSN Code for GST
      table.decimal('total_qty', 10, 2);
      // table.integer('batch_id');
      table.foreign('batch_id').references('batch.id').onDelete('CASCADE');

      // table.decimal('average_amount')
    });

    console.info('Medicines table created successfully');
  }
};
