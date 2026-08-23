import { readState } from '../appState.js';

const getList = async () => {
  const state = await readState();

  return state.lists
    .map((list, index) => ({
      list,
      order: Number.isInteger(list.order) ? list.order : index,
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ list }) => list);
};

export default getList;
