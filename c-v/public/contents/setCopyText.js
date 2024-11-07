const sendCopiedText = async (currentListName, currentSelection, index) => {
  const result = await new Promise((resolve, reject) => {
    chrome.runtime
      .sendMessage({
        type: 'set-command-by-index',
        message: {
          currentListName: currentListName,
          newCommand: currentSelection,
          index: index,
        },
      })
      .then((response) => resolve(response));
  });

  return result;
};

const setCopyText = async (pressedKeyCode) => {
  const index =
    pressedKeyCode === 'Digit0' ? 9 : Number(pressedKeyCode.split('')[5]) - 1;

  const currentList = await getCurrentListName();

  await sendCopiedText(currentList.currentListName, currentSelection, index);
};
