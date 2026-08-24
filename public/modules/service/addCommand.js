import getListById from '../getListById.js';
import { updateState } from '../appState.js';

const addCommand = (newCommand, listId) =>
  updateState((state) => {
    const currentList = getListById(state.lists, listId);
    const isDuplicated = currentList.commands.includes(newCommand);

    if (isDuplicated) {
      return { isDuplicated: true };
    }

    if (currentList.commands.length === 10) {
      return { isFull: true };
    }

    currentList.commands = [...currentList.commands, newCommand];
    return { isDuplicated: false };
  });

export default addCommand;
