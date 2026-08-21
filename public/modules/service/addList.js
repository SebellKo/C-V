import isValidListName from '../isValidListName.js';
import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';
import { MAX_LIST_COUNT } from '../../constants/list.js';

const addList = (listName, id) =>
  withStore('list', 'readwrite', async (store) => {
    if (!isValidListName(listName)) {
      return { isInvalidName: true };
    }

    const lists = await requestToPromise(store.getAll());
    const existedList = lists.some((list) => list.name === listName);

    if (existedList) {
      return { isDuplicated: true };
    }

    if (lists.length >= MAX_LIST_COUNT) {
      return { isFull: true };
    }

    const lastOrder = lists.reduce(
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

    await requestToPromise(store.add(newList));
    return { isDuplicated: false };
  });

export default addList;
