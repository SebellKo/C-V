import getCurrentListStore from '../getCurrentListStore.js';
import requestToPromise from '../requestToPromise.js';
import transactionDone from '../transactionDone.js';

const getCurrentListName = async () => {
  const { db, transaction, store } = await getCurrentListStore('readonly');
  const done = transactionDone(transaction);

  try {
    const currentListName = await requestToPromise(store.getAll());

    if (currentListName.length === 0) {
      await done;
      return '';
    }

    await done;
    return currentListName[0].name;
  } catch (error) {
    try {
      transaction.abort();
    } catch {
      // The transaction already completed or aborted.
    }
    await done.catch(() => undefined);
    throw error;
  } finally {
    db.close();
  }
};

export default getCurrentListName;
