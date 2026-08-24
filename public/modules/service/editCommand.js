import getListById from '../getListById.js';
import { updateState } from '../appState.js';

const editCommand = (listId, targetCommand, newCommand) =>
  updateState((state) => {
    const currentList = getListById(state.lists, listId);
    const isDuplicated = currentList.commands.includes(newCommand);

    if (isDuplicated) {
      return { isDuplicated: true };
    }

    const targetIndex = currentList.commands.findIndex(
      (commandItem) => commandItem === targetCommand,
    );

    currentList.commands[targetIndex] = newCommand;
    return { isDuplicated: false };
  });

export default editCommand;
