import sendRuntimeMessage from './sendRuntimeMessage';

const postCommand = async (newCommand, currentListName) => {
  return sendRuntimeMessage({
    type: 'add-new-command',
    message: { newCommand, currentListName },
  });
};

export default postCommand;
