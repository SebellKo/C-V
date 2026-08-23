import getListById from '../getListById.js';
import { updateState } from '../appState.js';

const addCommand = async (newCommand, listId) => {
  let result;

  await updateState((state) => {
    const currentList = getListById(state.lists, listId);
    const isDuplicated = currentList.commands.includes(newCommand);

    if (isDuplicated) {
      result = { isDuplicated: true };
      return state;
    }

    if (currentList.commands.length === 10) {
      result = { isFull: true };
      return state;
    }

    currentList.commands = [...currentList.commands, newCommand];
    result = { isDuplicated: false };
    return state;
  });

  return result;
};

export default addCommand;
