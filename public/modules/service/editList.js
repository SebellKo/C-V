import getListStore from '../getListStore.js';
import requestToPromise from '../requestToPromise.js';
import transactionDone from '../transactionDone.js';

const editList = async (newList) => {
  const { db, transaction, store } = await getListStore('readwrite');
  const done = transactionDone(transaction);

  try {
    const isExistList = newList.some((listItem, index) => {
      return (
        newList.findIndex((findItem) => listItem.name === findItem.name) !==
        index
      );
    });

    if (isExistList) {
      await done;
      return { isDuplicated: true };
    }

    const requests = [store.clear(), ...newList.map((item) => store.add(item))];

    await Promise.all(requests.map(requestToPromise));
    await done;
    return { isDuplicated: false };
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

export default editList;
