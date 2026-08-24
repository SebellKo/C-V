import { readState, updateState } from '../appState.js';

const getCurrentListId = async () => {
  const state = await readState();
  if (
    state.currentListId === null ||
    state.lists.some((list) => list.id === state.currentListId)
  ) {
    return state.currentListId;
  }

  return updateState((latestState) => {
    const currentListId = latestState.lists.some(
      (list) => list.id === latestState.currentListId,
    )
      ? latestState.currentListId
      : null;
    latestState.currentListId = currentListId;
    return currentListId;
  });
};

export default getCurrentListId;
