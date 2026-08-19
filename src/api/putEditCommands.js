import sendRuntimeMessage from './sendRuntimeMessage';

const putEditCommands = async (currentListName, updatedCommands) => {
  return sendRuntimeMessage({
    type: 'edit-commands',
    message: {
      currentListName,
      updatedCommands,
    },
  });
};

export default putEditCommands;
