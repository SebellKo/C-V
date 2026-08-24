import isValidListName from '../isValidListName.js';
import { updateState } from '../appState.js';
import { MAX_LIST_COUNT } from '../../constants/list.js';

const addList = (listName, id) =>
  updateState((state) => {
    if (!isValidListName(listName)) {
      return { isInvalidName: true };
    }

    const existedList = state.lists.some((list) => list.name === listName);

    if (existedList) {
      return { isDuplicated: true };
    }

    if (state.lists.length >= MAX_LIST_COUNT) {
      return { isFull: true };
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
    return { isDuplicated: false };
  });

export default addList;
