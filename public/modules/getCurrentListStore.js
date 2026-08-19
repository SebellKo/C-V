import openDatabase from './openDatabase.js';

const getCurrentListStore = async (permission) => {
  const db = await openDatabase();
  const transaction = db.transaction(['currentList'], permission);
  const store = transaction.objectStore('currentList');

  return { db, transaction, store };
};

export default getCurrentListStore;
