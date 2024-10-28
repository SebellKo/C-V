import { create } from 'zustand';

const useListStore = create((set) => ({
  currentListName: 'Select',
  setListName: (name) => set({ currentListName: name }),
  list: {
    apple: ['apple', 'pine', 'apple', 'something'],
    pear: [
      'pear',
      'bear',
      'lorem what is that i dont know what is that maybe something',
    ],
  },
  addListItem: (name) => set((prev) => (prev.list[name] = [])),
  modifyList: (newList) =>
    set(
      (prev) =>
        (prev.list = { ...prev.list, [newList.listName]: newList.list }),
    ),
}));

export { useListStore };
