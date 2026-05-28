import type { CommandList, ListName } from '../../src/types/domain';

const getListByName = async (
  currentListName: ListName,
  nameIndex: IDBIndex,
): Promise<CommandList | undefined> => {
  const currentList = await new Promise<CommandList | undefined>(
    (resolve, reject) => {
    const getCurrentListRequest = nameIndex.get(currentListName);

    getCurrentListRequest.onsuccess = (event) =>
      resolve((event.target as IDBRequest<CommandList | undefined>).result);
    getCurrentListRequest.onerror = (error) => reject(error);
    },
  );

  return currentList;
};

export default getListByName;
