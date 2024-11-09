import getListStore from '../getListStore.js';
import getListByName from '../getListByName.js';
import getPrimaryKey from '../getPrimaryKey.js';

const deleteCommand = async (currentListName, targetCommand) => {
  try {
    const listStore = await getListStore('readwrite');
    const nameIndex = listStore.index('name');

    const currentList = await getListByName(currentListName, nameIndex);

    const primaryKey = await getPrimaryKey(currentListName, nameIndex);

    currentList.commands = currentList.commands.filter(
      (commandItem) => commandItem !== targetCommand,
    );
    await listStore.put(currentList, primaryKey);
  } catch (error) {
    console.log(error);
  }
};

export default deleteCommand;
