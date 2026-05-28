import getListByName from '../getListByName';
import getListStore from '../getListStore';
import type {
  DuplicateResult,
  FullResult,
  ListId,
  ListName,
} from '../../../src/types/domain';

const addList = async (
  listName: ListName,
  id: ListId,
): Promise<DuplicateResult | FullResult | undefined> => {
  try {
    const listStore = await getListStore('readwrite');
    const nameIndex = listStore.index('name');
    const existedList = await getListByName(listName, nameIndex);

    if (existedList) return { isDuplicated: true };

    const listCount = await new Promise<number>((resolve, reject) => {
      const getListCountRequest = listStore.count();
      getListCountRequest.onsuccess = (event) =>
        resolve((event.target as IDBRequest<number>).result);
      getListCountRequest.onerror = (error) => reject(error);
    });

    if (listCount === 10) return { isFull: true };

    const newList = {
      id: id,
      name: listName,
      commands: [],
    };

    await listStore.add(newList);

    return { isDuplicated: false };
  } catch (error) {
    console.error('Database operation failed:', error);
  }
};

export default addList;
