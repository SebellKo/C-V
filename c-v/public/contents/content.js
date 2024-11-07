let currentSelection = '';

document.addEventListener('keydown', async (event) => {
  const isAltKeyDown = event.altKey;
  const isShiftKeyDown = event.shiftKey;
  const pressedKeyCode = event.code;
  const isPressedNum = pressedKeyCode.includes('Digit');

  if (isAltKeyDown && isShiftKeyDown && isPressedNum)
    return await setCopyText(pressedKeyCode);

  if (isShiftKeyDown && isPressedNum)
    return await setCurrentListName(pressedKeyCode);

  if (isAltKeyDown && isPressedNum)
    return await setCurrentCommand(pressedKeyCode);
});

document.addEventListener('selectionchange', () => {
  const selection = window.getSelection().toString().trim();
  if (selection) currentSelection = selection;
});

const setCurrentCommand = async (pressedKeyCode) => {
  const index =
    pressedKeyCode === 'Digit0' ? 9 : Number(pressedKeyCode.split('')[5]) - 1;

  const currentList = await getCurrentListName();

  const command = await getCurrentCommand(currentList.currentListName, index);
  console.log(command.command);
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
