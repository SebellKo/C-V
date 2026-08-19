import getListByName from '../getListByName.js';
import getListStore from '../getListStore.js';
import getPrimaryKey from '../getPrimaryKey.js';
import requestToPromise from '../requestToPromise.js';
import transactionDone from '../transactionDone.js';

const setCommandByIndex = async (currentListName, newCommand, index) => {
  const { db, transaction, store } = await getListStore('readwrite');
  const done = transactionDone(transaction);

  try {
    const nameIndex = store.index('name');

    const currentList = await getListByName(currentListName, nameIndex);
    const primaryKey = await getPrimaryKey(currentListName, nameIndex);
    const isDuplicated = currentList.commands.includes(newCommand);

    if (isDuplicated) {
      await done;
      return;
    }

    currentList.commands[index] = newCommand;

    for (let i = 0; i < currentList.commands.length; i++) {
      if (currentList.commands[i] === undefined)
        currentList.commands[i] = `dummy${i}`;
    }

    await requestToPromise(store.put(currentList, primaryKey));
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

export default setCommandByIndex;
