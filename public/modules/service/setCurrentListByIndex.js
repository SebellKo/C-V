import { updateState } from '../appState.js';

const setCurrentListByIndex = (index) =>
  updateState((state) => {
    const selectedList = state.lists[index];

    if (!selectedList) {
      throw new Error(`List not found at index: ${index}`);
    }

    state.currentListId = selectedList.id;
  });

export default setCurrentListByIndex;
