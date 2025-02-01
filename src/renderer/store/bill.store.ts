import { create } from 'zustand';

type Store = {
  billItems: any[];
  setBillItems: (items: any[]) => void;
};

export const useBillStore = create<Store>()((set) => ({
  billItems: [],
  setBillItems: (items: any[]) => set({ billItems: items }),
}));
