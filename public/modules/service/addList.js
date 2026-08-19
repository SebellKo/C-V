import getListStore from '../getListStore.js';
import requestToPromise from '../requestToPromise.js';
import transactionDone from '../transactionDone.js';

const addList = async (listName, id) => {
  const { db, transaction, store } = await getListStore('readwrite');
  const done = transactionDone(transaction);

  try {
    const nameIndex = store.index('name');
    const existedList = await requestToPromise(nameIndex.get(listName));

    if (existedList) {
      await done;
      return { isDuplicated: true };
    }

    const listCount = await requestToPromise(store.count());

    if (listCount === 10) {
      await done;
      return { isFull: true };
    }

    const newList = {
      id: id,
      name: listName,
      commands: [],
    };

    await requestToPromise(store.add(newList));
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

export default addList;
