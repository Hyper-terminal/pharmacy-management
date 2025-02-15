import { createMedicinesTable } from '@/src/main/schema/medicine';
import { createBatchesTable } from '@/src/main/schema/batch';
import { createBillingTable } from './billing';
import { createUsertable } from './user';
import { createDistributorTable } from './distributor';

export const createInitialData = async () => {
  await createMedicinesTable();
  await createBatchesTable();
  await createBillingTable();
  await createUsertable();
  await createDistributorTable();
};
