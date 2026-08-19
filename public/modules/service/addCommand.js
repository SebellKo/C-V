import getListStore from '../getListStore.js';
import getListByName from '../getListByName.js';
import getPrimaryKey from '../getPrimaryKey.js';
import requestToPromise from '../requestToPromise.js';
import transactionDone from '../transactionDone.js';

const addCommand = async (newCommand, currentListName) => {
  const { db, transaction, store } = await getListStore('readwrite');
  const done = transactionDone(transaction);

  try {
    const nameIndex = store.index('name');

    const currentList = await getListByName(currentListName, nameIndex);
    const primaryKey = await getPrimaryKey(currentListName, nameIndex);
    const isDuplicated = currentList.commands.includes(newCommand);

    if (isDuplicated) {
      await done;
      return { isDuplicated: true };
    }

    if (currentList.commands.length === 10) {
      await done;
      return { isFull: true };
    }

    currentList.commands = [...currentList.commands, newCommand];
    await requestToPromise(store.put(currentList, primaryKey));
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

export default addCommand;
