import getListStore from '../getListStore.js';

const modifyList = async (newList) => {
  try {
    const listStore = await getListStore('readwrite');

    await listStore.clear();

    newList.forEach(async (listItem) => await listStore.add(listItem));
  } catch (error) {
    console.log(error);
  }
};

export default modifyList;
