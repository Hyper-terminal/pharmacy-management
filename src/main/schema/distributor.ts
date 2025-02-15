import dbService from '../database'; // Import the DatabaseService instance

/**
 * Create the medicines table schema using the DatabaseService.
 */
export const createDistributorTable = async (): Promise<void> => {
  const knex = dbService.getKnexConnection(); // Use the Knex connection from DatabaseService

  const exists = await knex.schema.hasTable('distributors');

  console.log('exists', exists);

  if (!exists) {
    await knex.schema.createTable('distributors', (table: any) => {
      table.increments('id').primary(); // Primary key for each medicine
      table.string('name').notNullable(); // Name of the medicine
      table.string('phone').notNullable(); // Name of the medicine
      table.string('address').notNullable(); // Name of the medicine
      table.string('email').notNullable(); // Name of the medicine
      table.string('gstin').notNullable(); // Name of the medicine
      table.string('license_number').notNullable(); // Name of the medicine
      table.timestamps(true, true);
    });

    console.info('Distributors table created successfully');
  }
};
