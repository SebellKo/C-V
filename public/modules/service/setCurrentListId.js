import getListById from '../getListById.js';
import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';
import { CURRENT_LIST_KEY } from '../../constants/database.js';

const setCurrentListId = (listId) =>
  withStore(
    ['list', 'currentList'],
    'readwrite',
    async (listStore, currentListStore) => {
      if (listId === null) {
        await requestToPromise(currentListStore.clear());
        return;
      }

      await getListById(listId, listStore.index('id'));
      await requestToPromise(
        currentListStore.put({ listId }, CURRENT_LIST_KEY),
      );
    },
  );

export default setCurrentListId;
