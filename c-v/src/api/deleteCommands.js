const deleteCommands = async (currentListName) => {
  const result = await new Promise((resolve, reject) => {
    chrome.runtime
      .sendMessage({
        type: 'delete-commands',
        message: {
          currentListName: currentListName,
        },
      })
      .then((response) => {
        resolve(response);
      });
  });

  return result;
};

export default deleteCommands;
