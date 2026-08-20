import openDatabase from './openDatabase.js';

const waitForTransaction = (transaction) =>
  new Promise((resolve, reject) => {
    transaction.addEventListener('complete', () => resolve(), { once: true });
    transaction.addEventListener(
      'abort',
      () =>
        reject(
          transaction.error ?? new Error('IndexedDB transaction aborted'),
        ),
      { once: true },
    );
  });

const withStore = async (storeName, mode, operation) => {
  const db = await openDatabase();

  try {
    const storeNames = Array.isArray(storeName) ? storeName : [storeName];
    const transaction = db.transaction(storeNames, mode);
    const done = waitForTransaction(transaction);

    try {
      const stores = storeNames.map((name) => transaction.objectStore(name));
      const result = await operation(...stores);
      await done;
      return result;
    } catch (error) {
      try {
        transaction.abort();
      } catch {
        // The transaction already completed or aborted.
      }
      await done.catch(() => undefined);
      throw error;
    }
  } finally {
    db.close();
  }
};

export default withStore;
