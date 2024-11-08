import { createMedicinesTable } from "@/src/main/schema/medicine";
import { createBatchesTable } from "@/src/main/schema/batch";

export const createInitialData = async () => {
  await createMedicinesTable();
  await createBatchesTable();
}
