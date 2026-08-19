import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';

const editList = (newList) =>
  withStore('list', 'readwrite', async (store) => {
    const isExistList = newList.some((listItem, index) => {
      return (
        newList.findIndex((findItem) => listItem.name === findItem.name) !==
        index
      );
    });

    if (isExistList) {
      return { isDuplicated: true };
    }

    const requests = [store.clear(), ...newList.map((item) => store.add(item))];

    await Promise.all(requests.map(requestToPromise));
    return { isDuplicated: false };
  });

export default editList;
