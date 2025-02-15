import dbService from '../database';
import { MedicineProps } from '../types';

export const getProducts = async (
  offset: number,
  limit: number,
): Promise<MedicineProps[]> => {
  const knex = dbService.getKnexConnection();
  return knex('medicines').select('*').offset(offset).limit(limit);
};

export const getAllProducts = async (): Promise<MedicineProps[]> => {
  const knex = dbService.getKnexConnection();
  return knex('medicines')
    .select('name', knex.raw('SUM(total_qty) as total_qty'), 'hsn_code')
    .groupBy('name');
};
