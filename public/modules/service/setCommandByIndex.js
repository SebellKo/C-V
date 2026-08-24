import getListById from '../getListById.js';
import { updateState } from '../appState.js';

const setCommandByIndex = (listId, newCommand, index) =>
  updateState((state) => {
    const currentList = getListById(state.lists, listId);
    const isDuplicated = currentList.commands.includes(newCommand);

    if (isDuplicated) {
      return;
    }

    currentList.commands[index] = newCommand;

    for (let i = 0; i < currentList.commands.length; i++) {
      if (currentList.commands[i] === undefined)
        currentList.commands[i] = `dummy${i}`;
    }
  });

export default setCommandByIndex;
