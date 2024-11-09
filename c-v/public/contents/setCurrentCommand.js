const setCurrentCommand = async (pressedKeyCode) => {
  const index =
    pressedKeyCode === 'Digit0' ? 9 : Number(pressedKeyCode.split('')[5]) - 1;

  const currentList = await getCurrentListName();

  const command = await getCurrentCommand(currentList.currentListName, index);

  navigator.clipboard.writeText(command.command);
};

const getCurrentCommand = async (currentListName, index) => {
  const result = await new Promise((resolve, reject) => {
    chrome.runtime
      .sendMessage({
        type: 'get-current-command',
        message: { currentListName: currentListName, index: index },
      })
      .then((response) => resolve(response));
  });

  return result;
};
