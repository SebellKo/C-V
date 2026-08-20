import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';
import { CURRENT_LIST_KEY } from '../../constants/database.js';

const getCurrentListName = () =>
  withStore(
    ['currentList', 'list'],
    'readwrite',
    async (currentListStore, listStore) => {
      const selectedList = await requestToPromise(
        currentListStore.get(CURRENT_LIST_KEY),
      );

      if (!selectedList) {
        return '';
      }

      const list = await requestToPromise(
        listStore.index('id').get(selectedList.listId),
      );

      if (!list) {
        await requestToPromise(currentListStore.clear());
        return '';
      }

      return list.name;
    },
  );

export default getCurrentListName;
