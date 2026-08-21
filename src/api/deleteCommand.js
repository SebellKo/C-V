import sendRuntimeMessage from './sendRuntimeMessage';

const deleteCommand = async (listId, command) => {
  return sendRuntimeMessage({
    type: 'delete-command',
    message: {
      listId,
      targetCommand: command,
    },
  });
};

export default deleteCommand;
