import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';

const editList = (newList) =>
  withStore(
    ['list', 'currentList'],
    'readwrite',
    async (store, currentStore) => {
      const isExistList = newList.some((listItem, index) => {
        return (
          newList.findIndex((findItem) => listItem.name === findItem.name) !==
          index
        );
      });

      if (isExistList) {
        return { isDuplicated: true };
      }

      const selectedList = await requestToPromise(currentStore.get(1));
      const requests = [
        store.clear(),
        ...newList.map((item) => store.add(item)),
      ];

      if (
        selectedList &&
        !newList.some((listItem) => listItem.id === selectedList.listId)
      ) {
        requests.push(currentStore.clear());
      }

      await Promise.all(requests.map(requestToPromise));
      return { isDuplicated: false };
    },
  );

export default editList;
