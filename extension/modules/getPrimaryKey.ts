import type {
  CommandListPrimaryKey,
  ListName,
} from '../../src/types/domain';

const getPrimaryKey = async (
  currentListName: ListName,
  nameIndex: IDBIndex,
): Promise<CommandListPrimaryKey> => {
  const primaryKey = await new Promise<CommandListPrimaryKey>(
    (resolve, reject) => {
    const getKeyRequest = nameIndex.getKey(currentListName);

    getKeyRequest.onsuccess = (event) =>
      resolve((event.target as IDBRequest<IDBValidKey>).result);
    getKeyRequest.onerror = (error) => reject(error);
    },
  );

  return primaryKey;
};

export default getPrimaryKey;
