import requestToPromise from './requestToPromise.js';

const DATABASE_VERSION = 2;
export const CURRENT_LIST_KEY = 1;

const openDatabase = () => {
  const request = indexedDB.open('CVStore', DATABASE_VERSION);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    const transaction = event.target.transaction;
    const listStore = db.objectStoreNames.contains('list')
      ? transaction.objectStore('list')
      : db.createObjectStore('list', { autoIncrement: true });
    const currentListStore = db.objectStoreNames.contains('currentList')
      ? transaction.objectStore('currentList')
      : db.createObjectStore('currentList', { autoIncrement: true });

    if (!listStore.indexNames.contains('name')) {
      listStore.createIndex('name', 'name', { unique: false });
    }

    if (!listStore.indexNames.contains('id')) {
      listStore.createIndex('id', 'id', { unique: true });
    }

    if (event.oldVersion === 1) {
      migrateVersionOne(listStore, currentListStore, transaction);
    }
  };

  return requestToPromise(request).then((db) => {
    db.onversionchange = () => db.close();
    return db;
  });
};

const migrateVersionOne = (listStore, currentListStore, transaction) => {
  const cursorRequest = listStore.openCursor();

  cursorRequest.onsuccess = () => {
    const cursor = cursorRequest.result;

    if (!cursor) {
      migrateCurrentList(listStore, currentListStore);
      return;
    }

    try {
      if (typeof cursor.value.id !== 'string' || !cursor.value.id) {
        cursor.update({ ...cursor.value, id: crypto.randomUUID() });
      }
      cursor.continue();
    } catch {
      transaction.abort();
    }
  };
};

const migrateCurrentList = (listStore, currentListStore) => {
  const currentListRequest = currentListStore.openCursor();

  currentListRequest.onsuccess = () => {
    const selectedList = currentListRequest.result?.value;

    if (!selectedList) {
      return;
    }

    const listId =
      typeof selectedList.listId === 'string' ? selectedList.listId : '';
    const listName =
      typeof selectedList.name === 'string' ? selectedList.name : '';

    if (!listId && !listName) {
      currentListStore.clear();
      return;
    }

    const listRequest = listId
      ? listStore.index('id').get(listId)
      : listStore.index('name').get(listName);

    listRequest.onsuccess = () => {
      const list = listRequest.result;
      const clearRequest = currentListStore.clear();

      if (list) {
        clearRequest.onsuccess = () =>
          currentListStore.put({ listId: list.id }, CURRENT_LIST_KEY);
      }
    };
  };
};

export default openDatabase;
