import getListStore from '../getListStore.js';
import getListByName from '../getListByName.js';

const getCurrentListByName = async (currentListName) => {
  try {
    const listStore = await getListStore('readonly');
    const nameIndex = listStore.index('name');

    const currentList = await getListByName(currentListName, nameIndex);

    return currentList;
  } catch (error) {
    console.log(error);
  }
};

export default getCurrentListByName;
