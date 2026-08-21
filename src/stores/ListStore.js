import { create } from 'zustand';

const useListStore = create((set) => ({
  selectedListId: null,
  setSelectedListId: (selectedListId) => set({ selectedListId }),
}));

export { useListStore };
