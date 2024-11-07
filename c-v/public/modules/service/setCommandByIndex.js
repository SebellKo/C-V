import getListByName from '../getListByName.js';
import getListStore from '../getListStore.js';
import getPrimaryKey from '../getPrimaryKey.js';

const setCommandByIndex = async (currentListName, newCommand, index) => {
  try {
    const listStore = await getListStore('readwrite');
    const nameIndex = listStore.index('name');

    const currentList = await getListByName(currentListName, nameIndex);

    const primaryKey = await getPrimaryKey(currentListName, nameIndex);

    const isDuplicated = currentList.commands.includes(newCommand);

    if (isDuplicated) return;

    currentList.commands[index] = newCommand;

    for (let i = 0; i < currentList.commands.length; i++) {
      if (currentList.commands[i] === undefined)
        currentList.commands[i] = `dummy${i}`;
    }

    await listStore.put(currentList, primaryKey);
  } catch (error) {
    console.log(error);
  }
};

export default setCommandByIndex;
