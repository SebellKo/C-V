import getListByName from '../getListByName.js';
import getPrimaryKey from '../getPrimaryKey.js';
import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';

const deleteCommand = (currentListName, targetCommand) =>
  withStore('list', 'readwrite', async (store) => {
    const nameIndex = store.index('name');

    const currentList = await getListByName(currentListName, nameIndex);
    const primaryKey = await getPrimaryKey(currentListName, nameIndex);

    currentList.commands = currentList.commands.filter(
      (commandItem) => commandItem !== targetCommand,
    );
    await requestToPromise(store.put(currentList, primaryKey));
  });

export default deleteCommand;
