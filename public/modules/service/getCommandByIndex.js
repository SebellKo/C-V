import getListByName from '../getListByName.js';
import getListStore from '../getListStore.js';
import transactionDone from '../transactionDone.js';

const getCommandByIndex = async (currentListName, index) => {
  const { db, transaction, store } = await getListStore('readonly');
  const done = transactionDone(transaction);

  try {
    const nameIndex = store.index('name');

    const currentList = await getListByName(currentListName, nameIndex);
    const targetCommand = currentList.commands[index];

    await done;
    return targetCommand;
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

export default getCommandByIndex;
