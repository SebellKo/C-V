import { create } from 'zustand';

const useListStore = create((set) => ({
  currentListName: 'Select',
  setListName: (name) => set({ currentListName: name }),
  list: [
    {
      id: 'apple',
      name: 'apple',
      commands: ['apple', 'pine', 'apple', 'something'],
    },
    {
      id: 'pear',
      name: 'pear',
      commands: [
        'pear',
        'bear',
        'lorem what is that i dont know what is that maybe something',
      ],
    },
  ],
  addListItem: (name) => set((prev) => (prev.list[name] = [])),
  modifyList: (newList) => set({ list: newList }),
}));

export { useListStore };
