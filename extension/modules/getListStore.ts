import openDatabase from './openDatabase';

const getListStore = async (
  permission: IDBTransactionMode,
): Promise<IDBObjectStore> => {
  const db = await openDatabase();
  const transaction = db.transaction(['list'], permission);
  const listStore = transaction.objectStore('list');

  return listStore;
};

export default getListStore;
