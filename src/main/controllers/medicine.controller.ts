import dbService from '../database';
import { MedicineProps } from '../types';

export const getProducts = async (): Promise<MedicineProps[]> => {
  const knex = dbService.getKnexConnection();
  return knex('medicines').select('*');
};
