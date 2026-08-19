import getListStore from '../getListStore.js';
import requestToPromise from '../requestToPromise.js';
import transactionDone from '../transactionDone.js';

const getList = async () => {
  const { db, transaction, store } = await getListStore('readonly');
  const done = transactionDone(transaction);

  try {
    const list = await requestToPromise(store.getAll());
    await done;
    return list;
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

export default getList;
