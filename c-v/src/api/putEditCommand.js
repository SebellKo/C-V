const putEditCommand = async (currentListName, updatedCommands) => {
  const result = await new Promise((resolve, reject) => {
    chrome.runtime
      .sendMessage({
        type: 'edit-commands',
        message: {
          currentListName: currentListName,
          updatedCommands: updatedCommands,
        },
      })
      .then((response) => {
        resolve(response);
      });
  });

  return result;
};

export default putEditCommand;
