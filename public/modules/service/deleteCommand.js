import getListById from '../getListById.js';
import getPrimaryKey from '../getPrimaryKey.js';
import requestToPromise from '../requestToPromise.js';
import withStore from '../withStore.js';

const deleteCommand = (listId, targetCommand) =>
  withStore('list', 'readwrite', async (store) => {
    const idIndex = store.index('id');

    const currentList = await getListById(listId, idIndex);
    const primaryKey = await getPrimaryKey(listId, idIndex);

    currentList.commands = currentList.commands.filter(
      (commandItem) => commandItem !== targetCommand,
    );
    await requestToPromise(store.put(currentList, primaryKey));
  });

export default deleteCommand;
