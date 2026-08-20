import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';
import { CURRENT_LIST_KEY } from '../openDatabase.js';

const setCurrentListName = (index) =>
  withStore(['list', 'currentList'], 'readwrite', async (listStore, store) => {
    const lists = await requestToPromise(listStore.getAll());
    const selectedList = lists[index];

    if (!selectedList) {
      throw new Error(`List not found at index: ${index}`);
    }

    await requestToPromise(
      store.put({ listId: selectedList.id }, CURRENT_LIST_KEY),
    );
  });

export default setCurrentListName;
