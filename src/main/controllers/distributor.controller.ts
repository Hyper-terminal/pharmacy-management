import dbService from '../database';

export const getDistributors = async () => {
  const knex = dbService.getKnexConnection();
  const distributors = await knex('distributors').select('*');
  return distributors;
};
