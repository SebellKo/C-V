const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CVStore', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('list')) {
        db.createObjectStore('list', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Failed to open database');
  });
};

chrome.runtime.onInstalled.addListener(async () => {
  try {
    const db = await openDatabase();
    console.log('IndexedDB opened successfully:', db);
  } catch (error) {
    console.log(error);
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === 'add-list')
    return await addList(request.message.listName, request.message.id);
});

const addList = async (listName, id) => {
  try {
    const db = await openDatabase();

    const transaction = db.transaction(['list'], 'readwrite');
    const listStore = transaction.objectStore('list');

    const newList = {
      id: id,
      name: listName,
      commands: [],
    };
    console.log(newList);

    const addRequest = listStore.add(newList);

    addRequest.onsuccess = () => {
      console.log('Item added successfully');
    };

    addRequest.onerror = () => {
      console.log('Failed to add item');
    };
  } catch (error) {
    console.error('Database operation failed:', error);
  }
  return true;
};
