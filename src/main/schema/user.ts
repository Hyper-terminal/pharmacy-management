import dbService from '../database'; // Import the DatabaseService instance

export const createUsertable = async (): Promise<void> => {
  const knex = dbService.getKnexConnection(); // Use the Knex connection from DatabaseService

  const exists = await knex.schema.hasTable('users');

  if (!exists) {
    await knex.schema.createTableIfNotExists('users', (table: any) => {
      table.increments('id').primary(); // Primary key for each user
      //   personal details
      table.string('name');
      table.string('email');
      table.string('mobile'); //make array of strings
      table.string('website');
      table.string('address');

      // business details

      table.string('pharmacyName');
      table.string('LicenseNumber');
      table.string('GstNumber');
      table.string('RegistrationNumber');
      table.integer('EstablishedYear').unsigned();
      table.string('timings');
      table.string('PharmacistName');
      table.string('PharmacistLicense');
      table.string('PanNumber');
      table.string('BankName');
      table.string('AccountNumber');
      table.string('IfscCode');
      table.date('LastInspection');
      table.date('NextInspection');
      //   table.decimal('total_qty', 10, 2);

      // table.decimal('average_amount')
    });

    console.info('Medicines table created successfully');
  }
};
