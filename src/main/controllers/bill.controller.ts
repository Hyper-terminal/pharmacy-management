import dbService from '../database';

interface BillItem {
  id: number;
  medicine_id: number;
  quantity: number;
  amount: number;
  bill_id: number;
}

interface Bill {
  id: number;
  total_amount: number;
  created_at: string;
  items: BillItem[];
}

export const getBills = async (): Promise<Bill[]> => {
  const knex = dbService.getKnexConnection();

  try {
    // Get all bills
    const bills = await knex('billing')
      .select('*')
      .orderBy('created_at', 'desc')
      .groupBy('bill_no')
      .join('medicines', 'billing.medicines_id', 'medicines.id');
    return bills;
  } catch (error) {
    console.error('Error getting bills:', error);
    throw error;
  }
};

export const getRecentBills = async (): Promise<Bill[]> => {
  const knex = dbService.getKnexConnection();
  const recentBills = await knex('billing')
    .select('*')
    .orderBy('created_at', 'desc')
    .groupBy('bill_no')
    .limit(5);
  return recentBills;
};

export const getBill = async (id: number): Promise<Bill> => {
  const knex = await dbService.getKnexConnection();
  try {
    const bill = await knex('billing').where({ id }).first().groupBy('bill_no');
    console.log({ bill });
    return bill || null;
  } catch (error) {
    console.error('Error getting bill:', error);
    throw error;
  }
};
