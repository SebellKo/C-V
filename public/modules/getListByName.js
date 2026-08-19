import requestToPromise from './requestToPromise.js';

const getListByName = async (currentListName, nameIndex) => {
  const currentList = await requestToPromise(nameIndex.get(currentListName));

  if (currentList === undefined) {
    throw new Error(`List not found: ${currentListName}`);
  }

  return currentList;
};

export default getListByName;
