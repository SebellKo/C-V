import getCurrentListStore from '../getCurrentListStore.js';
import requestToPromise from '../requestToPromise.js';
import transactionDone from '../transactionDone.js';
import getList from './getList.js';

const setCurrentListName = async (index) => {
  const listArr = await getList();
  const { db, transaction, store } = await getCurrentListStore('readwrite');
  const done = transactionDone(transaction);

  try {
    const currentListName = listArr[index].name;
    const newCurrentListName = { name: currentListName };

    await requestToPromise(store.put(newCurrentListName, 1));
    await done;
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

export default setCurrentListName;
