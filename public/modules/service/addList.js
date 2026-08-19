import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';

const addList = (listName, id) =>
  withStore('list', 'readwrite', async (store) => {
    const nameIndex = store.index('name');
    const existedList = await requestToPromise(nameIndex.get(listName));

    if (existedList) {
      return { isDuplicated: true };
    }

    const listCount = await requestToPromise(store.count());

    if (listCount === 10) {
      return { isFull: true };
    }

    const newList = {
      id: id,
      name: listName,
      commands: [],
    };

    await requestToPromise(store.add(newList));
    return { isDuplicated: false };
  });

export default addList;
