import getListById from '../getListById.js';
import getPrimaryKey from '../getPrimaryKey.js';
import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';

const setCommandByIndex = (listId, newCommand, index) =>
  withStore('list', 'readwrite', async (store) => {
    const idIndex = store.index('id');

    const currentList = await getListById(listId, idIndex);
    const primaryKey = await getPrimaryKey(listId, idIndex);
    const isDuplicated = currentList.commands.includes(newCommand);

    if (isDuplicated) {
      return;
    }

    currentList.commands[index] = newCommand;

    for (let i = 0; i < currentList.commands.length; i++) {
      if (currentList.commands[i] === undefined)
        currentList.commands[i] = `dummy${i}`;
    }

    await requestToPromise(store.put(currentList, primaryKey));
  });

export default setCommandByIndex;
