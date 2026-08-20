import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';
import { CURRENT_LIST_KEY } from '../../constants/database.js';

const getCurrentListId = () =>
  withStore(
    ['currentList', 'list'],
    'readwrite',
    async (currentListStore, listStore) => {
      const selectedList = await requestToPromise(
        currentListStore.get(CURRENT_LIST_KEY),
      );

      if (!selectedList) {
        return null;
      }

      if (typeof selectedList.listId !== 'string') {
        await requestToPromise(currentListStore.clear());
        return null;
      }

      const listKey = await requestToPromise(
        listStore.index('id').getKey(selectedList.listId),
      );

      if (listKey === undefined) {
        await requestToPromise(currentListStore.clear());
        return null;
      }

      return selectedList.listId;
    },
  );

export default getCurrentListId;
