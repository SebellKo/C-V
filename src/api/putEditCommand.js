import sendRuntimeMessage from './sendRuntimeMessage';

const putEditCommand = async (currentListName, targetCommand, newCommand) => {
  return sendRuntimeMessage({
    type: 'edit-command',
    message: {
      currentListName,
      targetCommand,
      newCommand,
    },
  });
};

export default putEditCommand;
