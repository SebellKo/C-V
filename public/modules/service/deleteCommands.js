import getListById from '../getListById.js';
import { updateState } from '../appState.js';

const deleteCommands = (listId) =>
  updateState((state) => {
    const currentList = getListById(state.lists, listId);

    currentList.commands = [];
    return state;
  });

export default deleteCommands;
