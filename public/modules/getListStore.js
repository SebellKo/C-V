import openDatabase from './openDatabase.js';

const getListStore = async (permission) => {
  const db = await openDatabase();
  const transaction = db.transaction(['list'], permission);
  const store = transaction.objectStore('list');

  return { db, transaction, store };
};

export default getListStore;
