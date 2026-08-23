const DATABASE_NAME = 'CVStore';
const DATABASE_VERSION = 2;
const CURRENT_LIST_KEY = 1;

const requestResult = (request) =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('IndexedDB read failed'));
  });

const transactionDone = (transaction) =>
  new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = transaction.onerror = () =>
      reject(transaction.error ?? new Error('IndexedDB read failed'));
  });

const orderLists = (lists) =>
  lists
    .map((list, index) => ({
      list,
      order: Number.isInteger(list.order) ? list.order : index,
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ list }) => list);

const migrateIndexedDb = async (version) => {
  const databases = await indexedDB.databases();
  if (!databases.some((database) => database.name === DATABASE_NAME)) {
    return null;
  }

  const db = await requestResult(indexedDB.open(DATABASE_NAME));
  db.onversionchange = () => db.close();

  try {
    if (
      db.version !== DATABASE_VERSION ||
      !db.objectStoreNames.contains('list') ||
      !db.objectStoreNames.contains('currentList')
    ) {
      throw new Error('Unsupported IndexedDB schema');
    }

    const transaction = db.transaction(['list', 'currentList'], 'readonly');
    const done = transactionDone(transaction);
    const listStore = transaction.objectStore('list');
    const currentListStore = transaction.objectStore('currentList');
    const [lists, selectedList] = await Promise.all([
      requestResult(listStore.getAll()),
      requestResult(currentListStore.get(CURRENT_LIST_KEY)),
    ]);
    await done;

    return {
      version,
      lists: orderLists(lists),
      currentListId:
        typeof selectedList?.listId === 'string'
          ? selectedList.listId
          : null,
    };
  } finally {
    db.close();
  }
};

export default migrateIndexedDb;
