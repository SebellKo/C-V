import sendRuntimeMessage from './sendRuntimeMessage';

const deleteCommands = async (listId) => {
  return sendRuntimeMessage({
    type: 'delete-commands',
    message: {
      listId,
    },
  });
};

export default deleteCommands;
