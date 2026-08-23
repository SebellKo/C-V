import getListById from '../getListById.js';
import { updateState } from '../appState.js';

const deleteCommand = (listId, targetCommand) =>
  updateState((state) => {
    const currentList = getListById(state.lists, listId);

    currentList.commands = currentList.commands.filter(
      (commandItem) => commandItem !== targetCommand,
    );
    return state;
  });

export default deleteCommand;
