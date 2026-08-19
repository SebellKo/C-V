import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';

const getCurrentListName = () =>
  withStore('currentList', 'readonly', async (store) => {
    const currentListName = await requestToPromise(store.getAll());

    if (currentListName.length === 0) {
      return '';
    }

    return currentListName[0].name;
  });

export default getCurrentListName;
