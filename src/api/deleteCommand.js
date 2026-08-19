import sendRuntimeMessage from './sendRuntimeMessage';

const deleteCommand = async (currentListName, command) => {
  return sendRuntimeMessage({
    type: 'delete-command',
    message: {
      currentListName,
      targetCommand: command,
    },
  });
};

export default deleteCommand;
