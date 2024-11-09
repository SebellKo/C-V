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
