import dbService from '../database';

export const getDistributors = async () => {
  const knex = dbService.getKnexConnection();
  const distributors = await knex('distributors').select('*');
  return distributors;
};

export const addDistributor = async (distributor: any) => {
  const knex = dbService.getKnexConnection();
  const result = await knex('distributors').insert(distributor);
  return result;
};

export const searchDistributors = async (searchString: string) => {
  const knex = dbService.getKnexConnection();
  const distributors = await knex('distributors')
    .where('name', 'like', `%${searchString}%`)
    .select('*')
    .limit(50);
  return distributors;
};
