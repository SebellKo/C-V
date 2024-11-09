import getListByName from '../getListByName.js';
import getListStore from '../getListStore.js';

const getCommandByIndex = async (currentListName, index) => {
  try {
    const listStore = await getListStore('readonly');
    const nameIndex = listStore.index('name');

    const currentList = await getListByName(currentListName, nameIndex);

    const targetCommand = currentList.commands[index];

    return targetCommand;
  } catch (error) {
    console.log(error);
  }
};

export default getCommandByIndex;
