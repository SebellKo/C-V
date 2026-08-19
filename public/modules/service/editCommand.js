import getListStore from '../getListStore.js';
import getListByName from '../getListByName.js';
import getPrimaryKey from '../getPrimaryKey.js';
import requestToPromise from '../requestToPromise.js';
import transactionDone from '../transactionDone.js';

const editCommand = async (currentListName, targetCommand, newCommand) => {
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

    const targetIndex = currentList.commands.findIndex(
      (commandItem) => commandItem === targetCommand,
    );

    currentList.commands[targetIndex] = newCommand;

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

export default editCommand;
