import getListStore from '../getListStore.js';

const getList = async () => {
  try {
    const listStore = await getListStore('readonly');

    return new Promise((resolve, reject) => {
      const getListRequest = listStore.getAll();

      getListRequest.onsuccess = (event) => {
        resolve(event.target.result);
      };

      getListRequest.onerror = (error) => reject(error);
    });
  } catch (error) {
    console.error('Database operation failed:', error);
  }
};

export default getList;
