import getListStore from '../getListStore.js';

const editList = async (newList) => {
  try {
    const listStore = await getListStore('readwrite');
    const isExistList = newList.some((listItem, index) => {
      return (
        newList.findIndex((findItem) => listItem.name === findItem.name) !==
        index
      );
    });

    if (isExistList) return { isDuplicated: true };

    await listStore.clear();

    newList.forEach(async (listItem) => await listStore.add(listItem));

    return { isDuplicated: false };
  } catch (error) {
    console.log(error);
  }
};

export default editList;
