import getListByName from '../getListByName.js';
import getPrimaryKey from '../getPrimaryKey.js';
import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';

const editCommand = (currentListName, targetCommand, newCommand) =>
  withStore('list', 'readwrite', async (store) => {
    const nameIndex = store.index('name');

    const currentList = await getListByName(currentListName, nameIndex);
    const primaryKey = await getPrimaryKey(currentListName, nameIndex);
    const isDuplicated = currentList.commands.includes(newCommand);

    if (isDuplicated) {
      return { isDuplicated: true };
    }

    const targetIndex = currentList.commands.findIndex(
      (commandItem) => commandItem === targetCommand,
    );

    currentList.commands[targetIndex] = newCommand;

    await requestToPromise(store.put(currentList, primaryKey));
    return { isDuplicated: false };
  });

export default editCommand;
