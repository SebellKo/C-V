import getListById from '../getListById.js';
import getPrimaryKey from '../getPrimaryKey.js';
import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';

const editCommand = (listId, targetCommand, newCommand) =>
  withStore('list', 'readwrite', async (store) => {
    const idIndex = store.index('id');

    const currentList = await getListById(listId, idIndex);
    const primaryKey = await getPrimaryKey(listId, idIndex);
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
