import getListById from '../getListById.js';
import getPrimaryKey from '../getPrimaryKey.js';
import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';

const deleteCommands = (listId) =>
  withStore('list', 'readwrite', async (store) => {
    const idIndex = store.index('id');

    const currentList = await getListById(listId, idIndex);
    const primaryKey = await getPrimaryKey(listId, idIndex);

    currentList.commands = [];

    await requestToPromise(store.put(currentList, primaryKey));
  });

export default deleteCommands;
