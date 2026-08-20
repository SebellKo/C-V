import requestToPromise from './requestToPromise.js';

const getListById = async (listId, idIndex) => {
  const list = await requestToPromise(idIndex.get(listId));

  if (!list) {
    throw new Error(`List not found: ${listId}`);
  }

  return list;
};

export default getListById;
