import { create } from 'zustand';
import type { ListName } from '../types/domain';

interface ListStore {
  currentListName: ListName;
  setListName: (name: ListName) => void;
}

const useListStore = create<ListStore>((set) => ({
  currentListName: 'Select',
  setListName: (name) => set({ currentListName: name }),
}));

export { useListStore };
