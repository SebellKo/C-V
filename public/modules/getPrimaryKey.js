import requestToPromise from './requestToPromise.js';

const getPrimaryKey = async (listId, idIndex) => {
  const primaryKey = await requestToPromise(idIndex.getKey(listId));

  if (primaryKey === undefined) {
    throw new Error(`List key not found: ${listId}`);
  }

  return primaryKey;
};

export default getPrimaryKey;
