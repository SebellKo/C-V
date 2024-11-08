import getListStore from '../getListStore.js';
import getListByName from '../getListByName.js';
import getPrimaryKey from '../getPrimaryKey.js';

const addCommand = async (newCommand, currentListName) => {
  try {
    const listStore = await getListStore('readwrite');
    const nameIndex = listStore.index('name');

    const currentList = await getListByName(currentListName, nameIndex);

    const primaryKey = await getPrimaryKey(currentListName, nameIndex);

    const isDuplicated = currentList.commands.includes(newCommand);

    if (isDuplicated) return { isDuplicated: true };

    if (currentList.commands.length === 10) return { isFull: true };

    currentList.commands = [...currentList.commands, newCommand];
    await listStore.put(currentList, primaryKey);
    return { isDuplicated: false };
  } catch (error) {
    console.log(error);
  }
};

export default addCommand;
