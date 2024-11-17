import dbService from '@/src/main/database';

export const createBatchesTable = async () => {
  const knex = dbService.getKnexConnection();

  const exists = await knex.schema.hasTable('batches');

  if (exists) return;

  await knex.schema.createTableIfNotExists('batches', (table: any) => {
    table.increments('id').primary(); // Primary key for the batch record
    // table.integer('medicine_id').unsigned().notNullable(); // Foreign key to 'medicines'
    table.integer('quantity').notNullable(); // Quantity of the medicine in this batch
    table.date('expiry_date'); // Expiry date of this batch
    table.date('received_date').notNullable(); // Date when this batch was received
    table.string('batch_code'); // Unique code for this batch
    table.integer('f_qty'); // Full quantity in the batch
    table.integer('half_qty'); // Half quantity in the batch
    table.decimal('purchase_rate', 10, 2); // Purchase rate for this batch
    table.decimal('sale_rate', 10, 2); // Sale rate for this batch
    table.decimal('local_cent', 10, 2); // Local cent for the batch
    table.decimal('scm1', 10, 2); // Stock control measure 1 for the batch
    table.decimal('scm2', 10, 2); // Stock control measure 2 for the batch
    table.string('psr_number'); // PSR number for the batch
    table.string('psr_date'); // PSR date for the batch
    table.decimal('tcs_percentage', 10, 2); // TCS percentage for the batch
    table.decimal('tcs_amount', 10, 2); // TCS amount for the batch
    table.string('po_number').nullable(); // Purchase order number for the batch
    table.date('po_date'); // Purchase order date for the batch
    table.timestamps(true, true);
    table.string('supplier'); // Supplier name
    table.string('bill_number'); // Bill number
    table.decimal('mrp', 10, 2); // MRP of the medicine
    table.string('manufacturer'); // Manufacturer name
    table.decimal('discount', 10, 2); // Discount rate
    table.decimal('excise', 10, 2).nullable(); // Excise duty
    table.decimal('additional_vat', 10, 2).nullable(); // Additional VAT (if applicable)
    table.decimal('scm_percentage', 10, 2).nullable(); // SCM percentage
    table.decimal('amount', 10, 2).nullable(); // Total amount for this medicine
    table.decimal('cgst', 10, 2).nullable(); // CGST rate
    table.decimal('sgst', 10, 2).nullable(); // SGST rate
    table.string('barcode').unique(); // Unique barcode for the medicine
    table.decimal('igst', 10, 2).nullable(); // IGST rate
    table.string('received_batch_id').nullable(); // Unique batch ID
    table.string('pack'); // Unique batch ID

    // Set foreign key relation to 'medicines' table
    // table.foreign('medicine_id').references('medicines.id').onDelete('CASCADE');
  });

  console.info('Batches table created successfully');
};
