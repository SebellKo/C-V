import sendRuntimeMessage from './sendRuntimeMessage';

const getList = async () => {
  const data = await sendRuntimeMessage({ type: 'get-list' });
  return data.listData;
};

export default getList;
