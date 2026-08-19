import getListByName from '../getListByName.js';
import withStore from '../withStore.js';

const getCommandByIndex = (currentListName, index) =>
  withStore('list', 'readonly', async (store) => {
    const nameIndex = store.index('name');

    const currentList = await getListByName(currentListName, nameIndex);
    return currentList.commands[index];
  });

export default getCommandByIndex;
