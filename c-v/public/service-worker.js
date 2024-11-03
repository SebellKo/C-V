const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CVStore', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('list')) {
        const listStore = db.createObjectStore('list', { autoIncrement: true });
        listStore.createIndex('name', 'name', { unique: false });
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'add-list')
    (async () => {
      await addList(request.message.listName, request.message.id);
    })();

  if (request.type === 'get-list') {
    (async () => {
      const listData = await getList();
      sendResponse({ listData: listData });
    })();
  }

  if (request.type === 'edit-list') {
    (async () => {
      await modifyList(request.message.newList);
    })();
  }

  if (request.type === 'get-list-by-name') {
    (async () => {
      const listData = await getListByName(request.message.name);
      sendResponse({ listData: listData });
    })();
  }
  return true;
});

const getListByName = async (listName) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(['list'], 'readonly');
    const listStore = transaction.objectStore('list');
    const nameIndex = listStore.index('name');

    return new Promise((resolve, reject) => {
      const getListByNameRequest = nameIndex.get(listName);

      getListByNameRequest.onsuccess = (event) => resolve(event.target.result);
      getListByNameRequest.onerror = (error) => reject(error);
    });
  } catch (error) {
    console.log(error);
  }
};

const modifyList = async (newList) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(['list'], 'readwrite');
    const listStore = transaction.objectStore('list');

    await listStore.clear();

    newList.forEach(async (listItem) => await listStore.add(listItem));
  } catch (error) {
    console.log(error);
  }
};

const getList = async () => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(['list'], 'readonly');
    const listStore = transaction.objectStore('list');
    return new Promise((resolve, reject) => {
      const getListRequest = listStore.getAll();

      getListRequest.onsuccess = (event) => {
        resolve(event.target.result);
      };

      getListRequest.onerror = (error) => reject(error);
    });
  } catch (error) {
    console.error('Database operation failed:', error);
  }
};

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
};
