import getListById from '../getListById.js';
import { updateState } from '../appState.js';

const setCurrentListId = (listId) =>
  updateState((state) => {
    if (listId !== null) getListById(state.lists, listId);

    state.currentListId = listId;
    return state;
  });

export default setCurrentListId;
