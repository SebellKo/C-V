import getListById from '../getListById.js';
import { readState } from '../appState.js';

const getCommandByIndex = async (listId, index) => {
  const state = await readState();
  return getListById(state.lists, listId).commands[index];
};

export default getCommandByIndex;
