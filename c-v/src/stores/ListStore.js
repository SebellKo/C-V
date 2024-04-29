import { create } from 'zustand';

const useListStore = create((set) => ({
  isClick: false,
  toggleClick: () => set((prev) => ({ isClick: !prev.isClick })),
  currentListName: 'Select',
  setListName: (name) => set(() => ({ currentListName: name })),
  list: {},
  addListItem: (name) => set((prev) => (prev.list[name] = [])),
}));

export default useListStore;
