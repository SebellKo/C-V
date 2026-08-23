import findListById from '../getListById.js';
import { readState } from '../appState.js';

const getListById = async (listId) => {
  const state = await readState();
  return findListById(state.lists, listId);
};

export default getListById;
