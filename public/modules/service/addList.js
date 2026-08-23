import isValidListName from '../isValidListName.js';
import { updateState } from '../appState.js';
import { MAX_LIST_COUNT } from '../../constants/list.js';

const addList = async (listName, id) => {
  let result;

  await updateState((state) => {
    if (!isValidListName(listName)) {
      result = { isInvalidName: true };
      return state;
    }

    const existedList = state.lists.some((list) => list.name === listName);

    if (existedList) {
      result = { isDuplicated: true };
      return state;
    }

    if (state.lists.length >= MAX_LIST_COUNT) {
      result = { isFull: true };
      return state;
    }

    const lastOrder = state.lists.reduce(
      (maxOrder, list, index) =>
        Math.max(
          maxOrder,
          Number.isInteger(list.order) ? list.order : index,
        ),
      -1,
    );

    const newList = {
      id,
      name: listName,
      commands: [],
      order: lastOrder + 1,
    };

    state.lists.push(newList);
    result = { isDuplicated: false };
    return state;
  });

  return result;
};

export default addList;
