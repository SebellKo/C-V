import getListStore from '../getListStore.js';
import getListByName from '../getListByName.js';
import getPrimaryKey from '../getPrimaryKey.js';

const editCommand = async (currentListName, targetCommand, newCommand) => {
  try {
    const listStore = await getListStore('readwrite');
    const nameIndex = listStore.index('name');

    const currentList = await getListByName(currentListName, nameIndex);

    const primaryKey = await getPrimaryKey(currentListName, nameIndex);

    const isDuplicated = currentList.commands.includes(newCommand);

    if (isDuplicated) return { isDuplicated: true };

    const targetIndex = currentList.commands.findIndex(
      (commandItem) => commandItem === targetCommand,
    );

    currentList.commands[targetIndex] = newCommand;

    await listStore.put(currentList, primaryKey);
    return { isDuplicated: false };
  } catch (error) {
    console.log(error);
  }
};

export default editCommand;
