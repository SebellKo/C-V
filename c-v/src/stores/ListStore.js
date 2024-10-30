import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

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
  addListItem: (name) =>
    set(({ list }) => ({
      list: [...list, { id: uuidv4(), name: name, commands: [] }],
    })),
  modifyList: (newList) => set({ list: newList }),
}));

export { useListStore };
