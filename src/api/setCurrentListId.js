import sendRuntimeMessage from './sendRuntimeMessage';

const setCurrentListId = (listId) =>
  sendRuntimeMessage({
    type: 'set-current-list-id',
    message: { listId },
  });

export default setCurrentListId;
