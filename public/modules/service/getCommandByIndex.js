import getListById from '../getListById.js';
import withStore from '../withStore.js';

const getCommandByIndex = (listId, index) =>
  withStore('list', 'readonly', async (store) => {
    const idIndex = store.index('id');

    const currentList = await getListById(listId, idIndex);
    return currentList.commands[index];
  });

export default getCommandByIndex;
