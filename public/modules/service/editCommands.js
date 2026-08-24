import getListById from '../getListById.js';
import { updateState } from '../appState.js';

const editCommands = (listId, updatedCommands) =>
  updateState((state) => {
    const currentList = getListById(state.lists, listId);

    currentList.commands = updatedCommands;
  });

export default editCommands;
