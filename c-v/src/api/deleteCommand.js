const deleteCommand = async (currentListName, command) => {
  const result = await new Promise((resolve, reject) => {
    chrome.runtime
      .sendMessage({
        type: 'delete-command',
        message: {
          currentListName: currentListName,
          targetCommand: command,
        },
      })
      .then((response) => {
        resolve(response);
      });
  });

  return result;
};

export default deleteCommand;
