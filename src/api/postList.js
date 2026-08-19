import sendRuntimeMessage from './sendRuntimeMessage';

const postList = (listTitle) =>
  sendRuntimeMessage({
    type: 'add-list',
    message: { listName: listTitle, id: crypto.randomUUID() },
  });

export default postList;
