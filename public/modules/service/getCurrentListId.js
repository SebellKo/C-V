import { readState, updateState } from '../appState.js';

const getCurrentListId = async () => {
  const state = await readState();
  if (
    state.currentListId === null ||
    state.lists.some((list) => list.id === state.currentListId)
  ) {
    return state.currentListId;
  }

  let currentListId;
  await updateState((latestState) => {
    currentListId = latestState.lists.some(
      (list) => list.id === latestState.currentListId,
    )
      ? latestState.currentListId
      : null;
    latestState.currentListId = currentListId;
    return latestState;
  });

  return currentListId;
};

export default getCurrentListId;
