import getListStore from '../getListStore';
import type { CommandList } from '../../../src/types/domain';

const getList = async (): Promise<CommandList[] | undefined> => {
  try {
    const listStore = await getListStore('readonly');

    return new Promise<CommandList[]>((resolve, reject) => {
      const getListRequest = listStore.getAll();

      getListRequest.onsuccess = (event) => {
        resolve((event.target as IDBRequest<CommandList[]>).result);
      };

      getListRequest.onerror = (error) => reject(error);
    });
  } catch (error) {
    console.error('Database operation failed:', error);
  }
};

export default getList;
