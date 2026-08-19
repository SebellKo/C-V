import requestToPromise from './requestToPromise.js';

const getPrimaryKey = async (currentListName, nameIndex) => {
  const primaryKey = await requestToPromise(
    nameIndex.getKey(currentListName),
  );

  if (primaryKey === undefined) {
    throw new Error(`List key not found: ${currentListName}`);
  }

  return primaryKey;
};

export default getPrimaryKey;
