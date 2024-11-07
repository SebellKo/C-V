const openDatabase = () => {
  return new Promise((resolve, reject) => {
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

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Failed to open database');
  });
};

export default openDatabase;
