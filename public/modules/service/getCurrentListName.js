import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';

const getCurrentListName = () =>
  withStore(
    ['currentList', 'list'],
    'readwrite',
    async (currentListStore, listStore) => {
      const selectedList = await requestToPromise(currentListStore.get(1));

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
