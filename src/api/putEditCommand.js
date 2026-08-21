import sendRuntimeMessage from './sendRuntimeMessage';

const putEditCommand = async (listId, targetCommand, newCommand) => {
  return sendRuntimeMessage({
    type: 'edit-command',
    message: {
      listId,
      targetCommand,
      newCommand,
    },
  });
};

export default putEditCommand;
