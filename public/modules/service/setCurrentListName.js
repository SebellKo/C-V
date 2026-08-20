import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';

const setCurrentListName = (index) =>
  withStore(['list', 'currentList'], 'readwrite', async (listStore, store) => {
    const lists = await requestToPromise(listStore.getAll());
    const selectedList = lists[index];

    if (!selectedList) {
      throw new Error(`List not found at index: ${index}`);
    }

    await requestToPromise(store.put({ listId: selectedList.id }, 1));
  });

export default setCurrentListName;
