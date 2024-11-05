import getListStore from '../getListStore.js';
import getListByName from '../getListByName.js';

const editList = async (newList) => {
  try {
    const listStore = await getListStore('readwrite');
    const nameIndex = listStore.index('name');
    const existedList = await getListByName(newList, nameIndex);

    if (existedList) return { isDuplicated: true };

    await listStore.clear();

    newList.forEach(async (listItem) => await listStore.add(listItem));

    return { isDuplicated: false };
  } catch (error) {
    console.log(error);
  }
};

export default editList;
