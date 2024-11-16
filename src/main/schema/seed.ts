import { createMedicinesTable } from '@/src/main/schema/medicine';
import { createBatchesTable } from '@/src/main/schema/batch';
import { createBillingTable } from './billing';

export const createInitialData = async () => {
  await createMedicinesTable();
  await createBatchesTable();
  await createBillingTable();
};
