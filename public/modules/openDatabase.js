import requestToPromise from './requestToPromise.js';

const openDatabase = () => {
  const request = indexedDB.open('CVStore', 1);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    if (!db.objectStoreNames.contains('list')) {
      const listStore = db.createObjectStore('list', { autoIncrement: true });
      listStore.createIndex('name', 'name', { unique: false });
    }
    if (!db.objectStoreNames.contains('currentList')) {
      db.createObjectStore('currentList', { autoIncrement: true });
    }
  };

  return requestToPromise(request).then((db) => {
    db.onversionchange = () => db.close();
    return db;
  });
};

export default openDatabase;
