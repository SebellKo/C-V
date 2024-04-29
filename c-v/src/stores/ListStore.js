import { create } from 'zustand';

const useListStore = create((set) => ({
  currentListName: 'Select',
  setListName: (name) => set({ currentListName: name }),
  list: { apple: ['apple', 'pine', 'apple', 'something'] },
  addListItem: (name) => set((prev) => (prev.list[name] = [])),
}));

const useListUiStore = create((set) => ({
  isClick: false,
  toggleClick: () => set((prev) => ({ isClick: !prev.isClick })),
}));

export { useListStore, useListUiStore };
