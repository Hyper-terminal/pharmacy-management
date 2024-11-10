import dbService from '../database';
import { BatchProps } from '../types';

const knex = dbService.getKnexConnection();

export const getBatches = async (offset: number, limit: number): Promise<BatchProps[]> => {
  const batches = await knex.select('*').from('batches').offset(offset).limit(limit);
  return batches;
};

export const getAllBatches = async (): Promise<BatchProps[]> => {
  const batches = await knex.select('*').from('batches');
  return batches;
};
