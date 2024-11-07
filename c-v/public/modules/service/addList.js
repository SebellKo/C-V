import getListByName from '../getListByName.js';
import getListStore from '../getListStore.js';

const addList = async (listName, id) => {
  try {
    const listStore = await getListStore('readwrite');
    const nameIndex = listStore.index('name');
    const existedList = await getListByName(listName, nameIndex);

    if (existedList) return { isDuplicated: true };

    const newList = {
      id: id,
      name: listName,
      commands: [],
    };

    await listStore.add(newList);

    return { isDuplicated: false };
  } catch (error) {
    console.error('Database operation failed:', error);
  }
};

export default addList;
