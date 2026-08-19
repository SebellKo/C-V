import getListByName from '../getListByName.js';
import getPrimaryKey from '../getPrimaryKey.js';
import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';

const setCommandByIndex = (currentListName, newCommand, index) =>
  withStore('list', 'readwrite', async (store) => {
    const nameIndex = store.index('name');

    const currentList = await getListByName(currentListName, nameIndex);
    const primaryKey = await getPrimaryKey(currentListName, nameIndex);
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
