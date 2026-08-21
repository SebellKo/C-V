import sendRuntimeMessage from './sendRuntimeMessage';

const getCurrentListId = async () => {
  const data = await sendRuntimeMessage({ type: 'get-current-list-id' });
  return data.currentListId;
};

export default getCurrentListId;
