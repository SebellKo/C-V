import openDatabase from './openDatabase.js';

const getCurrentListStore = async (permission) => {
  const db = await openDatabase();
  const transaction = db.transaction(['currentList'], permission);
  const currentListStore = transaction.objectStore('currentList');

  return currentListStore;
};

export default getCurrentListStore;
