import getListStore from '../getListStore.js';
import getListByName from '../getListByName.js';
import transactionDone from '../transactionDone.js';

const getCurrentListByName = async (currentListName) => {
  const { db, transaction, store } = await getListStore('readonly');
  const done = transactionDone(transaction);

  try {
    const nameIndex = store.index('name');

    const currentList = await getListByName(currentListName, nameIndex);

    await done;
    return currentList;
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

export default getCurrentListByName;
