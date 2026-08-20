import getListById from '../getListById.js';
import getPrimaryKey from '../getPrimaryKey.js';
import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';

const addCommand = (newCommand, listId) =>
  withStore('list', 'readwrite', async (store) => {
    const idIndex = store.index('id');

    const currentList = await getListById(listId, idIndex);
    const primaryKey = await getPrimaryKey(listId, idIndex);
    const isDuplicated = currentList.commands.includes(newCommand);

    if (isDuplicated) {
      return { isDuplicated: true };
    }

    if (currentList.commands.length === 10) {
      return { isFull: true };
    }

    currentList.commands = [...currentList.commands, newCommand];
    await requestToPromise(store.put(currentList, primaryKey));
    return { isDuplicated: false };
  });

export default addCommand;
