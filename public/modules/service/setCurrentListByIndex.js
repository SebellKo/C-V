import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';
import { CURRENT_LIST_KEY } from '../../constants/database.js';

const setCurrentListByIndex = (index) =>
  withStore(
    ['list', 'currentList'],
    'readwrite',
    async (listStore, currentListStore) => {
      const lists = await requestToPromise(listStore.getAll());
      const selectedList = lists[index];

      if (!selectedList) {
        throw new Error(`List not found at index: ${index}`);
      }

      await requestToPromise(
        currentListStore.put({ listId: selectedList.id }, CURRENT_LIST_KEY),
      );
    },
  );

export default setCurrentListByIndex;
