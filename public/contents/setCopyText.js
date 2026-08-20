const sendCopiedText = (listId, currentSelection, index) =>
  chrome.runtime.sendMessage({
    type: 'set-command-by-index',
    message: {
      listId,
      newCommand: currentSelection,
      index,
    },
  });

const setCopyText = async (pressedKeyCode) => {
  const index =
    pressedKeyCode === 'Digit0' ? 9 : Number(pressedKeyCode.split('')[5]) - 1;

  const currentListId = await getCurrentListId();

  if (currentListId === null) return;

  await sendCopiedText(currentListId, currentSelection, index);
};
