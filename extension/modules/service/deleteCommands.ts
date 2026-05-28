import getListStore from '../getListStore';
import getListByName from '../getListByName';
import getPrimaryKey from '../getPrimaryKey';

const deleteCommands = async (currentListName) => {
  try {
    const listStore = await getListStore('readwrite');
    const nameIndex = listStore.index('name');

    const currentList = await getListByName(currentListName, nameIndex);

    const primaryKey = await getPrimaryKey(currentListName, nameIndex);

    currentList.commands = [];

    await listStore.put(currentList, primaryKey);
  } catch (error) {
    console.log(error);
  }
};

export default deleteCommands;
