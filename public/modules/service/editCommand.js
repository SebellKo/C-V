import getListById from '../getListById.js';
import { updateState } from '../appState.js';

const editCommand = async (listId, targetCommand, newCommand) => {
  let result;

  await updateState((state) => {
    const currentList = getListById(state.lists, listId);
    const isDuplicated = currentList.commands.includes(newCommand);

    if (isDuplicated) {
      result = { isDuplicated: true };
      return state;
    }

    const targetIndex = currentList.commands.findIndex(
      (commandItem) => commandItem === targetCommand,
    );

    currentList.commands[targetIndex] = newCommand;
    result = { isDuplicated: false };
    return state;
  });

  return result;
};

export default editCommand;
