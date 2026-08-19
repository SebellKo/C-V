import sendRuntimeMessage from './sendRuntimeMessage';

const deleteCommands = async (currentListName) => {
  return sendRuntimeMessage({
    type: 'delete-commands',
    message: {
      currentListName,
    },
  });
};

export default deleteCommands;
