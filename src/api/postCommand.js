import sendRuntimeMessage from './sendRuntimeMessage';

const postCommand = async (newCommand, listId) => {
  return sendRuntimeMessage({
    type: 'add-new-command',
    message: { newCommand, listId },
  });
};

export default postCommand;
