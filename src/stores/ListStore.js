import { create } from 'zustand';

const useListStore = create((set) => ({
  currentListName: 'Select',
  setListName: (name) => set({ currentListName: name }),
}));

export { useListStore };
