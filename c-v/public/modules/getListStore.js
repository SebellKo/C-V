import openDatabase from './openDatabase.js';

const getListStore = async (permission) => {
  const db = await openDatabase();
  const transaction = db.transaction(['list'], permission);
  const listStore = transaction.objectStore('list');

  return listStore;
};

export default getListStore;
