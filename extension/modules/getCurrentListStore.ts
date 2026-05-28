import openDatabase from './openDatabase';

const getCurrentListStore = async (
  permission: IDBTransactionMode,
): Promise<IDBObjectStore> => {
  const db = await openDatabase();
  const transaction = db.transaction(['currentList'], permission);
  const currentListStore = transaction.objectStore('currentList');

  return currentListStore;
};

export default getCurrentListStore;
