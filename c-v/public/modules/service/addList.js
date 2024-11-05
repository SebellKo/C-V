import getListStore from '../getListStore.js';

const addList = async (listName, id) => {
  try {
    const listStore = await getListStore('readwrite');

    const newList = {
      id: id,
      name: listName,
      commands: [],
    };

    const addRequest = listStore.add(newList);

    addRequest.onsuccess = () => {
      console.log('Item added successfully');
    };

    addRequest.onerror = () => {
      console.log('Failed to add item');
    };
  } catch (error) {
    console.error('Database operation failed:', error);
  }
};

export default addList;
