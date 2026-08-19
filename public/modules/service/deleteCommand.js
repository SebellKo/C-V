import getListStore from '../getListStore.js';
import getListByName from '../getListByName.js';
import getPrimaryKey from '../getPrimaryKey.js';
import requestToPromise from '../requestToPromise.js';
import transactionDone from '../transactionDone.js';

const deleteCommand = async (currentListName, targetCommand) => {
  const { db, transaction, store } = await getListStore('readwrite');
  const done = transactionDone(transaction);

  try {
    const nameIndex = store.index('name');

    const currentList = await getListByName(currentListName, nameIndex);
    const primaryKey = await getPrimaryKey(currentListName, nameIndex);

    currentList.commands = currentList.commands.filter(
      (commandItem) => commandItem !== targetCommand,
    );
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

export default deleteCommand;
