import findListById from '../getListById.js';
import withStore from '../withStore.js';

const getListById = (listId) =>
  withStore('list', 'readonly', async (store) => {
    const idIndex = store.index('id');
    return findListById(listId, idIndex);
  });

export default getListById;
