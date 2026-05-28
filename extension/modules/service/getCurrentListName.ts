import getCurrentListStore from '../getCurrentListStore';
import type {
  CurrentListRecord,
  ListName,
} from '../../../src/types/domain';

const getCurrentListName = async (): Promise<ListName | undefined> => {
  try {
    const currentListNameStore = await getCurrentListStore('readonly');

    const currentListName = await new Promise<CurrentListRecord[]>(
      (resolve, reject) => {
      const getCurrentListNameRequest = currentListNameStore.getAll();
      getCurrentListNameRequest.onsuccess = (event) =>
        resolve((event.target as IDBRequest<CurrentListRecord[]>).result);
      getCurrentListNameRequest.onerror = (error) => reject(error);
      },
    );

    if (currentListName.length === 0) return '';

    return currentListName[0].name;
  } catch (error) {
    console.log(error);
  }
};

export default getCurrentListName;
