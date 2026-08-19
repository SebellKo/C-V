import sendRuntimeMessage from './sendRuntimeMessage';

const getListByName = async (listName) => {
  const data = await sendRuntimeMessage({
    type: 'get-list-by-name',
    message: { name: listName },
  });
  return data.listData;
};

export default getListByName;
