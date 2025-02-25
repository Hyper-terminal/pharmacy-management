import dbService from '../database'; // Import the DatabaseService instance

/**
 * Create the medicines table schema using the DatabaseService.
 */
export const createBillingTable = async (): Promise<void> => {
  const knex = dbService.getKnexConnection(); // Use the Knex connection from DatabaseService

  const exists = await knex.schema.hasTable('billing');

  if (!exists) {
    await knex.schema.createTable('billing', (table: any) => {
      table.increments('id').primary(); // Primary key for each medicine
      table.string('name').notNullable(); // Name of the medicine
      table.integer('medicines_id').unsigned();
      table
        .foreign('medicines_id')
        .references('medicines.id')
        .onDelete('CASCADE');

      table.integer('batch_id').unsigned();

      table.foreign('batch_id').references('batches.id').onDelete('CASCADE');
      table.integer('quantity_sold').unsigned();
      table.decimal('discount', 10, 2);
      table.decimal('tax', 10, 2);
      table.decimal('price', 10, 2);
      table.decimal('final_price', 10, 2);
      table.string('customer_name');
      table.string('customer_phone');
      table.string('doctor_name').nullable();
      table.string('doctor_phone').nullable();
      table.string('doctor_registration').nullable();
      table.string('hsn_code');
      table.integer('bill_no').unsigned();
      table.timestamps(true, true);

      // table.decimal('average_amount')
    });

    console.info('Medicines table created successfully');
  }
};
