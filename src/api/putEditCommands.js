import sendRuntimeMessage from './sendRuntimeMessage';

const putEditCommands = async (listId, updatedCommands) => {
  return sendRuntimeMessage({
    type: 'edit-commands',
    message: {
      listId,
      updatedCommands,
    },
  });
};

export default putEditCommands;
