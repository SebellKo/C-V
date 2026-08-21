import sendRuntimeMessage from './sendRuntimeMessage';

const getListById = async (listId) => {
  const data = await sendRuntimeMessage({
    type: 'get-list-by-id',
    message: { listId },
  });
  return data.listData;
};

export default getListById;
