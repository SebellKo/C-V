const postCommand = async (newCommand, currentListName) => {
  const result = await new Promise((resolve, reject) => {
    chrome.runtime
      .sendMessage({
        type: 'add-new-command',
        message: { newCommand: newCommand, currentListName: currentListName },
      })
      .then((response) => {
        resolve(response);
      });
  });
  return result;
};

export default postCommand;
