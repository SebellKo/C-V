import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useListStore = create((set) => ({
  currentListName: 'Select',

  setListName: (name) => set({ currentListName: name }),

  list: [
    {
      id: 'apple',
      name: 'apple',
      commands: ['apple', 'pine', 'something'],
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

  addCommand: (newCommand) =>
    set(({ list }) => {
      const matchedIndex = list.findIndex(
        (listItem) => listItem.name === newCommand.currentListName,
      );

      if (matchedIndex === -1) return { list };

      const isDuplicated = list[matchedIndex].commands.find(
        (listItem) => listItem === newCommand.command,
      );

      if (isDuplicated) return { list };

      const updatedList = [...list];
      updatedList[matchedIndex].commands = [
        ...updatedList[matchedIndex].commands,
        newCommand.command,
      ];

      return { list: updatedList };
    }),

  changeCommandOrder: (newCommands) =>
    set(({ list }) => ({
      list: list.map((listItem) =>
        listItem.id === newCommands.id
          ? { ...listItem, commands: newCommands.commands }
          : listItem,
      ),
    })),

  removeCommand: (targetCommand) =>
    set(({ list }) => {
      const matchedIndex = list.findIndex(
        (listItem) => listItem.name === targetCommand.currentListName,
      );

      const updatedList = [...list];
      updatedList[matchedIndex].commands = updatedList[
        matchedIndex
      ].commands.filter((command) => command !== targetCommand.command);

      return { list: updatedList };
    }),
  removeAllCommands: (targetList) =>
    set(({ list }) => ({
      list: list.filter((listItem) => listItem.name !== targetList),
    })),
}));

export { useListStore };
