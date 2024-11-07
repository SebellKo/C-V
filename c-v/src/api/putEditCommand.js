const putEditCommand = async (currentListName, targetCommand, newCommand) => {
  const result = await new Promise((resolve, reject) => {
    chrome.runtime
      .sendMessage({
        type: 'edit-command',
        message: {
          currentListName: currentListName,
          targetCommand: targetCommand,
          newCommand: newCommand,
        },
      })
      .then((response) => {
        resolve(response);
      });
  });

  return result;
};

export default putEditCommand;
