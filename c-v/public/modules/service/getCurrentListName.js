import getCurrentListStore from '../getCurrentListStore.js';

const getCurrentListName = async () => {
  try {
    const currentListNameStore = await getCurrentListStore('readonly');

    const currentListName = await new Promise((resolve, reject) => {
      const getCurrentListNameRequest = currentListNameStore.getAll();
      getCurrentListNameRequest.onsuccess = (event) =>
        resolve(event.target.result);
      getCurrentListNameRequest.onError = (error) => reject(error);
    });

    if (currentListName.length === 0) return '';

    return currentListName[0].name;
  } catch (error) {
    console.log(error);
  }
};

export default getCurrentListName;
