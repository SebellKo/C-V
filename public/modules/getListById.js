const getListById = (lists, listId) => {
  const list = lists.find((item) => item.id === listId);

  if (!list) {
    throw new Error(`List not found: ${listId}`);
  }

  return list;
};

export default getListById;
