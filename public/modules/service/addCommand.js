import getListByName from '../getListByName.js';
import getPrimaryKey from '../getPrimaryKey.js';
import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';

const addCommand = (newCommand, currentListName) =>
  withStore('list', 'readwrite', async (store) => {
    const nameIndex = store.index('name');

    const currentList = await getListByName(currentListName, nameIndex);
    const primaryKey = await getPrimaryKey(currentListName, nameIndex);
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
